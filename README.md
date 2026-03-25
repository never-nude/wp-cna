# WPCNA Site

Modern static website for the White Plains Council of Neighborhood Associations, focused on clean event discovery, stronger local identity, and simple long-term maintenance.

## Project Structure

```text
wpcna-site/
├── .eleventy.js
├── package.json
├── src/
│   ├── index.njk
│   ├── about/index.njk
│   ├── events/index.njk
│   ├── events/event.njk
│   ├── _data/
│   │   ├── site.js
│   │   ├── navigation.json
│   │   ├── resources.json
│   │   ├── neighborhoods.json
│   │   ├── events.json
│   │   └── eventStore.js
│   ├── _includes/
│   │   ├── layouts/base.njk
│   │   └── components/
│   └── assets/
│       ├── css/styles.css
│       ├── js/site.js
│       └── img/
└── _site/ (generated)
```

## How To Run Locally

```bash
npm install
npm run start
```

Eleventy will serve the site locally and watch for changes.

## How To Build

```bash
npm run build
```

The production-ready static site will be generated in `_site/`.

## GitHub Pages

This project is configured to publish as a GitHub Pages project site at:

`https://never-nude.github.io/wpcna/`

In production, the build uses the `/wpcna/` path prefix so links and assets resolve correctly on GitHub Pages.

## How To Edit Or Add Events

All event content lives in [`src/_data/events.json`](./src/_data/events.json).

Each event follows the same structure:

- `id`
- `slug`
- `title`
- `category`
- `shortSummary`
- `fullDescription`
- `startDate`
- `endDate`
- `startTime`
- `endTime`
- `locationName`
- `locationAddress`
- `image`
- `flyerPdf`
- `externalUrl`
- `ctaLabel`
- `featured`
- `status`
- `tags`
- `organizer`
- `sourceUrl`
- `sourceLabel`

### Recommended workflow

1. Duplicate a similar event object in `events.json`.
2. Update the `id` and `slug` so they are unique.
3. Keep `shortSummary` brief enough for cards.
4. Put longer context in `fullDescription`.
5. Set `status` to `upcoming` or `past`.
6. Choose the most useful primary action:
   - `externalUrl` for registration, ticketing, or official details
   - `flyerPdf` if the flyer is the main resource
7. Set `featured` to `true` if the event should appear in the home page spotlight.

### Notes

- If the exact time is unknown, set `startTime` and `endTime` to `null`.
- If an event has both an official page and a flyer, use the official page as the primary action and keep the flyer as a secondary resource.
- The Events page automatically separates `upcoming` and `past` items.
- Detail pages are generated automatically from the event data.

## Other Editable Content

- Site-wide organization info and shared imagery references: [`src/_data/site.js`](./src/_data/site.js)
- Header navigation: [`src/_data/navigation.json`](./src/_data/navigation.json)
- Home/About resource cards: [`src/_data/resources.json`](./src/_data/resources.json)
- Homepage neighborhood tiles: [`src/_data/neighborhoods.json`](./src/_data/neighborhoods.json)

## Visual Refresh Notes

This refinement pass keeps the existing Eleventy/Nunjucks structure and event data model intact, while updating the site's tone to feel more current, city-facing, and specific to White Plains.

Key changes include:

- a full sans-serif typography system
- a cooler slate-and-navy civic palette
- flatter, less rounded surface styling
- a photography-led White Plains homepage hero
- text-forward event cards with stronger date/location hierarchy
- a new neighborhood section on the homepage

## Imagery

- Rights-clear White Plains photography lives in [`src/assets/img/photos`](./src/assets/img/photos).
- Neighborhood tile images currently live in [`src/assets/img/neighborhoods`](./src/assets/img/neighborhoods) and are placeholder graphics designed to be swapped later if neighborhood-specific photography is sourced confidently.
- Image sourcing and attribution notes live in [`IMAGE_SOURCING.md`](./IMAGE_SOURCING.md).

### Replacing neighborhood placeholders later

1. Add the new image file under `src/assets/img/neighborhoods/`.
2. Update the matching item in `src/_data/neighborhoods.json`.
3. Keep image filenames stable and descriptive.
4. Add or update the attribution entry in `IMAGE_SOURCING.md`.

## Deployment

This is a plain static site, so it can be deployed to any static host:

- Netlify
- Vercel
- GitHub Pages
- Cloudflare Pages
- Any traditional web host that serves static files

Typical deployment flow:

1. Run `npm install`
2. Run `npm run build`
3. Publish the `_site/` directory

## Content Sourcing Notes

This project uses the current WPCNA site strictly as a content source, not a design reference.

The event dataset combines:

- WPCNA's existing local-events and workshop materials pages
- Official White Plains partner sources such as:
  - City of White Plains
  - White Plains Public Library
  - White Plains BID
  - White Plains Performing Arts Center

That mix gives the site a healthier launch set of upcoming events while keeping WPCNA's neighborhood context front and center.
