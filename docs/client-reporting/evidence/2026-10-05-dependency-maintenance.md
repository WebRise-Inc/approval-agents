# October 5, 2026: dependency maintenance

Status: proposed in [PR #2](https://github.com/WebRise-Inc/approval-agents/pull/2), not merged or verified in production. This October maintenance follows the earlier documentation-only review and is not counted as September work.

## Change and rationale

The existing lockfile had five advisory groups, including a critical Next.js group. Following the [official Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16) and [16.3.8 release](https://github.com/vercel/next.js/releases/tag/v16.3.8), this change pins Next.js from the previously locked 16.2.6 to 16.3.8, raises the PostCSS override floor to `^8.5.23`, and refreshes compatible affected transitive packages. React and React DOM remain at 19.2.6 and satisfy the new framework's peer range. No major-version migration codemod applies to this app.

The resulting lockfile uses PostCSS 8.5.29, nanoid 3.3.20, sharp 0.35.5 and baseline-browser-mapping 2.11.27. Both the complete lockfile audit and the installed production-dependency audit report zero known vulnerabilities on October 5. This clears the reported package ranges; it is not a guarantee that every possible security issue is absent.

Next.js generated an additional root-parameter type import in `next-env.d.ts` and current `AGENTS.md`/`CLAUDE.md` pointers to its bundled version-matched docs during development validation. No application, styling, page copy, consent, calendar or intake-handler source changed.

## Advisory applicability review

This is a source/configuration assessment of the advisories reported for the original lockfile, not exploitation testing. No exploit payloads were sent to production.

| Advisory group | App assessment |
| --- | --- |
| [Middleware/proxy bypass](https://github.com/vercel/next.js/security/advisories/GHSA-6gpp-xcg3-4w24) | No middleware/proxy authorization or single-locale i18n configuration. |
| [Server Action CPU denial of service](https://github.com/vercel/next.js/security/advisories/GHSA-m99w-x7hq-7vfj), [host forwarding](https://github.com/vercel/next.js/security/advisories/GHSA-89xv-2m56-2m9x), [Edge payload limits](https://github.com/vercel/next.js/security/advisories/GHSA-4c39-4ccg-62r3), [endpoint disclosure](https://github.com/vercel/next.js/security/advisories/GHSA-955p-x3mx-jcvp) | No Server Actions or `use cache` endpoints. Intake uses a Node.js Route Handler. |
| [Fetch init confusion](https://github.com/vercel/next.js/security/advisories/GHSA-68g3-v927-f742), [non-UTF-8 body cache confusion](https://github.com/vercel/next.js/security/advisories/GHSA-4633-3j49-mh5q) | Intake fetch uses one URL/init pair, `JSON.stringify` and `cache: "no-store"`; affected request shapes were not found. |
| [Dynamic redirect/rewrite hostname](https://github.com/vercel/next.js/security/advisories/GHSA-p9j2-gv94-2wf4) | All redirect destination hosts are fixed to `approvalagents.ca`; no rewrite or user-controlled hostname interpolation. |
| [SVG image optimization](https://github.com/vercel/next.js/security/advisories/GHSA-q8wf-6r8g-63ch) | No remote image patterns; production is observed on Vercel, which the advisory excludes. |
| [AVIF image optimization](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4) | Templates use ordinary images; no AVIF files or remote patterns found. The underlying optimizer still belongs to the framework, so unused components are not treated as proof of no exposure. The framework and sharp are updated. |
| [Windows-hosted execution](https://github.com/vercel/next.js/security/advisories/GHSA-p293-qw3h-jr36) | No Windows hosting was observed; local validation uses macOS and production evidence identifies managed Vercel hosting. |
| [ImageResponse execution](https://github.com/vercel/next.js/security/advisories/GHSA-vcvr-r3jv-pc5j) | No `ImageResponse` or dynamic OG generation; the booking sharing image is a static JPEG. |

The 16.3.8 release also lists newer security fixes. The selected maintained release includes them; no broad exploitability conclusion is inferred from the audit alone.

## Validation

- Clean `npm ci` succeeded on Node 24.18.1; dependency installation reported zero vulnerabilities.
- `npm run build` succeeded with Turbopack on Next.js 16.3.8, including its TypeScript pass and all expected routes.
- Separate `tsc --noEmit` passed after both build and development-generated types.
- Local production server at `http://127.0.0.1:4323`: 46/46 assertions passed for home/book/privacy status, titles/descriptions/canonicals/Open Graph URLs, links and anchors, robots/sitemap, all six www redirect/query cases, slash normalization, actual 404 and read-only API 405 behavior under local/apex/www Host headers.
- Page titles, descriptions, link destinations, robots and sitemap matched the October 5 pre-upgrade production captures.
- `next dev` served home, booking and privacy with 200 and no server compilation errors. The clean production build remains the browser-review target.
- Both `npm audit --package-lock-only` and `npm audit --omit=dev` exited 0 with zero known vulnerabilities.
- Application/public/config source is byte-for-byte unchanged from reporting commit `07dcef2`. No customer form or calendar booking was submitted. Environment secrets and live lead intake were not used.

Browser comparison of the local production build is coordinated separately before release. Production still needs a normal reviewed release and post-deployment check; successful local validation does not deploy these dependency updates.
