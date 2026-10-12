# Approval Agents public review and image optimization

Reviewed October 12, 2026. Public production and local production preview are separate environments. PR #2 remains a review proposal; no PR was merged and no production deployment was performed by this review.

## Current public behavior

Fresh HTTP/source checks passed 32/32 assertions. Home, booking and privacy each return 200 with a distinct title, description, apex canonical, matching Open Graph URL and one H1 in source. Their in-page links have matching targets. Robots allows crawling and advertises the three canonical sitemap routes. Sampled www, HTTP and trailing-slash redirects reach the expected canonical URL in one hop; the booking query string is preserved. A missing path returns 404.

Home and privacy have Open Graph title, description, URL and site name but no image in their HTTP metadata. Booking has a poster image. This is recorded as a sharing-preview follow-up; it does not establish an indexing problem. No schema absence is inferred from static HTML.

## Proposed image improvement

The public financing illustration at `/agent-approvals-routing.png` was 1,231,954 bytes. Its bytes match the original source asset. A lossless WebP of the same illustration is 867,716 bytes: 364,238 bytes (29.57%) smaller. Both decode to exactly the same RGBA pixels at 1672 × 941.

The homepage now references the WebP and provides its intrinsic dimensions, native lazy loading and asynchronous decoding. The original PNG remains available for existing external references. The below-the-fold illustration is no longer emitted as an image preload in local HTML. No copy, styles, headings or customer-flow logic changed.

This reduces transferred bytes when the illustration is requested and permits the browser to defer its request. No measured Core Web Vitals, load-time or ranking improvement is claimed.

## Validation

- Lossless conversion with `cwebp -lossless -z 9 -metadata all`; decoded pixel equality and exact dimensions verified.
- Latest `master` merged into the review branch to retain the already-merged analytics 2.1.0 update. The pending Next.js 16.3.8 and PostCSS maintenance changes are preserved.
- Clean dependency install, production build and standalone TypeScript check passed on Node 24.19.0. The clean install audit reported zero known vulnerabilities at that time.
- Local production preview passed 9/9 focused HTTP checks: the three public pages, robots, sitemap and optimized image returned 200; image attributes, removed preload and served-byte equality were verified.
- Next's generated type references now point to the production build's generated types, matching the validated build.

## Release and next actions

Review [PR #2](https://github.com/WebRise-Inc/approval-agents/pull/2), then release through the normal approval process. Recheck the production image URL, lazy-loading behavior, routes and customer journey after release. The live PNG remains the production observation until deployment is separately verified.

Confirm actual analytics/data practices before changing the privacy statement. Revisit Google-selected canonicals and booking discovery in Search Console before drawing search-performance conclusions. No customer application or calendar booking was submitted.
