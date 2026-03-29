const manualEvents = require("./events.json");

let autoEvents = [];

try {
  autoEvents = require("./events.auto.json");
} catch (error) {
  if (error.code !== "MODULE_NOT_FOUND") {
    throw error;
  }
}

const TIME_ZONE = "America/New_York";

function getTodayIso() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  })
    .format(new Date())
    .replaceAll("/", "-");
}

function normalizeUrl(url) {
  if (!url) {
    return null;
  }

  try {
    const normalized = new URL(url);
    normalized.pathname = normalized.pathname.replace(/\/{2,}/g, "/");
    return normalized.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function eventKeys(event) {
  const keys = [];

  if (event.id) {
    keys.push(`id:${event.id}`);
  }

  if (event.slug) {
    keys.push(`slug:${event.slug}`);
  }

  for (const url of [event.externalUrl, event.sourceUrl]) {
    const normalizedUrl = normalizeUrl(url);
    if (normalizedUrl) {
      keys.push(`url:${normalizedUrl}`);
    }
  }

  if (event.title && event.startDate) {
    keys.push(`title:${normalizeText(event.title)}|${event.startDate}|${normalizeText(event.locationName)}`);
  }

  return [...new Set(keys)];
}

function mergeEvents(autoItems, manualItems) {
  const merged = [];
  const keyToIndex = new Map();

  function upsert(event, priority) {
    const keys = eventKeys(event);
    const matchedKey = keys.find((key) => keyToIndex.has(key));

    if (!matchedKey) {
      const index = merged.push({ ...event, __priority: priority }) - 1;
      keys.forEach((key) => keyToIndex.set(key, index));
      return;
    }

    const index = keyToIndex.get(matchedKey);
    if (priority < merged[index].__priority) {
      return;
    }

    merged[index] = { ...event, __priority: priority };
    keys.forEach((key) => keyToIndex.set(key, index));
  }

  autoItems.forEach((event) => upsert(event, 0));
  manualItems.forEach((event) => upsert(event, 1));

  return merged.map(({ __priority, ...event }) => event);
}

function deriveStatus(event, todayIso) {
  if (!event.startDate) {
    return event.status || "upcoming";
  }

  const endDate = event.endDate || event.startDate;
  return endDate < todayIso ? "past" : "upcoming";
}

function scoreRelated(baseEvent, candidate) {
  let score = 0;

  if (baseEvent.category === candidate.category) {
    score += 4;
  }

  const sharedTags = candidate.tags.filter((tag) => baseEvent.tags.includes(tag));
  score += sharedTags.length;

  if (baseEvent.organizer === candidate.organizer) {
    score += 2;
  }

  if (baseEvent.status === candidate.status) {
    score += 1;
  }

  return score;
}

function buildPrimaryAction(event) {
  if (event.externalUrl) {
    return {
      label: event.ctaLabel || "Get info",
      url: event.externalUrl
    };
  }

  if (event.flyerPdf) {
    return {
      label: event.ctaLabel || "Open flyer",
      url: event.flyerPdf
    };
  }

  return null;
}

function buildSecondaryLinks(event) {
  const links = [];

  if (event.flyerPdf && event.flyerPdf !== event.externalUrl) {
    links.push({
      label: "Open flyer (PDF)",
      url: event.flyerPdf
    });
  }

  if (event.sourceUrl && event.sourceUrl !== event.externalUrl) {
    links.push({
      label: event.sourceLabel || "Original source",
      url: event.sourceUrl
    });
  }

  return links;
}

function compareUpcoming(a, b) {
  return `${a.startDate}${a.startTime || "00:00"}`.localeCompare(`${b.startDate}${b.startTime || "00:00"}`);
}

function comparePast(a, b) {
  return `${b.startDate}${b.startTime || "00:00"}`.localeCompare(`${a.startDate}${a.startTime || "00:00"}`);
}

function buildRelatedPreview(event) {
  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    category: event.category,
    shortSummary: event.shortSummary,
    startDate: event.startDate,
    endDate: event.endDate,
    startTime: event.startTime,
    endTime: event.endTime,
    locationName: event.locationName,
    organizer: event.organizer,
    status: event.status,
    monthKey: event.monthKey,
    displayImage: event.displayImage,
    searchText: event.searchText,
    detailUrl: event.detailUrl,
    primaryAction: event.primaryAction
  };
}

const todayIso = getTodayIso();
const mergedEvents = mergeEvents(autoEvents, manualEvents);

const all = mergedEvents.map((event) => {
  const hasIllustration = Boolean(event.image && event.image.startsWith("/assets/img/events/"));

  return {
    ...event,
    status: deriveStatus(event, todayIso),
    detailUrl: `/events/${event.slug}/`,
    primaryAction: buildPrimaryAction(event),
    secondaryLinks: buildSecondaryLinks(event),
    monthKey: event.startDate.slice(0, 7),
    hasIllustration,
    displayImage: hasIllustration ? null : event.image,
    searchText: [
      event.title,
      event.category,
      event.organizer,
      event.shortSummary,
      event.locationName,
      event.locationAddress,
      ...(event.tags || [])
    ]
      .join(" ")
      .toLowerCase()
  };
});

const upcoming = all.filter((event) => event.status === "upcoming").sort(compareUpcoming);
const past = all.filter((event) => event.status === "past").sort(comparePast);

const bySlug = new Map(all.map((event) => [event.slug, event]));

for (const event of all) {
  event.relatedEvents = all
    .filter((candidate) => candidate.slug !== event.slug)
    .map((candidate) => ({
      candidate,
      score: scoreRelated(event, candidate)
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return compareUpcoming(a.candidate, b.candidate);
    })
    .slice(0, 3)
    .map((entry) => buildRelatedPreview(entry.candidate));
}

const categories = [...new Set(all.map((event) => event.category))].sort();
const months = [...new Set(all.map((event) => event.monthKey))].sort();

const featuredUpcoming = upcoming.filter((event) => event.featured);
const featuredPast = past.filter((event) => event.featured);
const homeUpcoming = (featuredUpcoming.length ? featuredUpcoming : upcoming).slice(0, 4);
const homePast = (featuredPast.length ? featuredPast : past).slice(0, 4);

module.exports = {
  all,
  bySlug,
  upcoming,
  past,
  categories,
  months,
  homeUpcoming,
  homePast
};
