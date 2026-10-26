# Approval Agents dependency refresh, October 26, 2026

A later dependency review found that the pending Next.js 16.3.8 proposal now falls in newly published advisory ranges. This supplements the earlier October 26 monitoring-only review. Existing [PR #2](https://github.com/WebRise-Inc/approval-agents/pull/2) now pins Next.js 16.4.3 and refreshes its matching Next packages in the lockfile. Application source, the pending illustration patch, analytics 2.1.0, React packages and customer-flow copy are unchanged.

## Evidence and applicability

A fresh audit of the starting lockfile reported one critical dependency group for Next.js, containing two critical advisories and one high advisory. The maintainer advisories list 16.4.1 as patched; 16.4.3 is the compatible version recommended by the current audit.

- [Image Optimization / SVG advisory](https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw): involves an upstream image library on glibc Linux. This application uses ordinary image tags and has no `next/image` import or explicit SVG-optimization configuration. Production endpoint exposure and exploitability were not established.
- [Server Actions denial-of-service advisory](https://github.com/vercel/next.js/security/advisories/GHSA-p3m5-59mp-jv5r): requires App Router with at least one Server Action. No user-defined Server Action was found; the intake uses a client fetch to its existing Route Handler.
- [Cache Components / typed-array advisory](https://github.com/vercel/next.js/security/advisories/GHSA-673q-mjm6-r5xr): concerns `use cache` functions returning typed arrays. No matching directives or Cache Components configuration were found. The maintainer recommends upgrading even without similar functions.

These are package findings and source applicability checks, not evidence of live exploitation or compromise. No exploit requests were made. Earlier clean audits retain their original dates; the new advisory information warrants refreshing the still-pending maintenance proposal.

## Current validation

On Node 24.19.0 / npm 11.13.0, the fresh install, Next.js 16.4.3 production build and standalone TypeScript check passed. Complete-lockfile and production dependency audits both report zero known vulnerabilities at this capture. Bundled version-matched Next.js upgrade guidance and the existing AGENTS pointer were checked.

The upgraded local production server passed 40/40 HTTP/source assertions: home, booking, privacy, robots, sitemap, metadata, headings, anchors, representative redirects/query preservation, missing-route handling, read-only application API GET behavior, original assets and the pending WebP. The optimized illustration remains 867,716 bytes with the expected intrinsic dimensions, lazy loading, asynchronous decoding and no preload.

Coordinated desktop and 390px mobile runtime QA passed the sampled flow: selecting SUV advances to step 2; Back retains that selection on both sizes; no horizontal overflow was captured. Booking video playback reached readyState 4 with advancing time, and the mute control changed the video to muted. Privacy navigation passed. The calendar iframe and separate direct links were present, but its loading status persisted; actual appointment availability and booking completion are not verified. No personal information, application or booking was submitted.

Public preview proof: [desktop](media/2026-10-26/after-desktop.png), [mobile](media/2026-10-26/after-mobile.png), [silent walkthrough](media/2026-10-26/preview-walkthrough.mp4), [capture details](media/2026-10-26/capture-note.json). The walkthrough uses 22 actual browser screencast frames from the interactions, with idle pauses capped at two seconds. The 15.2-second H.264, 1280 × 720 file has no audio stream and passed a full FFmpeg decode. It is a local preview capture, not a production release.

## Release status

This is an update to the existing open review PR. No merge or production deployment has been performed. The earlier current-production checks still describe live behavior before release, including the original PNG. Review the complete PR and its final checks, then verify production after an authorized release. The September draft, prior October records and the owner's separate modified video are preserved.
