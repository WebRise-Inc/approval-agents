# Client work record

This directory records website and SEO work so monthly client updates can be assembled from evidence.

## Files

- `logs/YYYY-MM.md`: dated weekly observations, changes, validation, release updates and next steps.
- `monthly/YYYY-MM.md`: email-ready draft for that completed calendar month, created during the first weekly run of the following month.
- `templates/monthly-email.md`: the monthly writing format.

Weekly portfolio review runs on Mondays at 9:00 a.m. America/Toronto. Its scheduler and private analytics evidence are maintained in the WebRise portfolio task, outside this repository. This file documents the workflow; it is not a GitHub Actions schedule.

## Weekly entry

Use a unique ID such as `domain/YYYY-MM-DD/topic`. Record date, pages or issue checked, evidence source and date, changes, client benefit, PR/commit, validation, public visual evidence where useful, current release status, blockers and next action. Include the entry with the implementation PR where possible. Record a no-change review honestly instead of inventing work. Append dated release updates and corrections; do not erase the original history.

## Evidence and release status

Distinguish **proposed in PR**, **merged**, **deployed**, and **verified live**. Build or preview success does not prove production delivery. Give the date and exact production URLs for live verification. Do not claim search gains until supported by comparable measured windows. Recheck current PR state when preparing a monthly report and count each improvement once.

Only public website evidence belongs here. Keep raw Search Console/Ahrefs exports, private account screenshots, customer information, credentials and recipient details outside the repo. Link public screenshots or walkthroughs from their PR and label capture date/environment. Never commit secrets. Preserve project instructions and unrelated local changes.

Monthly reports are drafts for review. Creating a draft does not send an email. PRs do not authorize automatic merging or production deployment.
