const sitePathPrefix = process.env.SITE_PATH_PREFIX || "/";
const deployBaseUrl = process.env.SITE_BASE_URL || "http://localhost:8080";
const cleanPrefix = sitePathPrefix === "/" ? "" : sitePathPrefix.replace(/\/$/, "");

module.exports = {
  name: "White Plains Council of Neighborhood Associations",
  shortName: "WPCNA",
  tagline: "Current events and neighborhood connection across White Plains.",
  baseUrl: `${deployBaseUrl.replace(/\/$/, "")}${cleanPrefix}`,
  pathPrefix: sitePathPrefix,
  contactName: "Michael Dalton, President",
  email: "michael@mdalton.com",
  location: "White Plains, New York, United States",
  currentSiteUrl: "https://wp-cna.org/",
  defaultOgImage: "/assets/img/photos/white-plains-downtown-street.jpg",
  heroImage: "/assets/img/photos/white-plains-downtown-street.jpg",
  heroImageAlt: "Street-level view of downtown White Plains with office towers, traffic lights, and surrounding city blocks.",
  heroImageLabel: "Downtown White Plains",
  heroImageSummary: "Street-level view of the city center.",
  aboutImage: "/assets/img/photos/white-plains-downtown-street.jpg",
  aboutImageAlt: "Downtown White Plains with towers, streetlights, and surrounding city blocks.",
  mission:
    "WPCNA helps residents and neighborhood associations across White Plains find current civic, cultural, and community events without digging through cluttered pages or pasted announcements.",
  meetingNote:
    "WPCNA meetings are typically held on the second Tuesday of each month at 7:00 p.m. Agenda details are posted as they are confirmed.",
  communityChannels: [
    {
      label: "White Plains BID Instagram",
      url: "https://www.instagram.com/whiteplains.bid/"
    },
    {
      label: "White Plains Public Library Calendar",
      url: "https://calendar.whiteplainslibrary.org/"
    },
    {
      label: "City of White Plains Calendar",
      url: "https://www.cityofwhiteplains.com/Calendar.aspx"
    }
  ]
};
