# Gratifi project archive

Everything behind the Gratifi build, from the first idea (27 Sep 2026) to the live app with Claude (2 Oct 2026). The app code itself sits in the folders above (`gratifi/`, `kit/`, `pwa/`, `api/`, `site/`).

| Folder | What's in it |
| --- | --- |
| `conversation/` | The working conversation with Claude, as Markdown, in blocks of five turns (`turns-000-004.md` onwards). Amit's messages are copied word for word. Claude's replies are kept word for word, and each run of tool work is shortened to one line. |
| `research/` | Working notes and briefs: the commerce-in-chat use-case doc, the system map notes, the design-system brief, the review briefs, copy scans and review scores, and the use-case spreadsheets with the scripts that built them. |
| `design-references/` | The approved design originals from 27 Sep (`approved-originals-27-sep/`), Amit's reference screenshots (`ref-01` to `ref-09`), the screens used in the handover doc, and the design-system tokens. |
| `artifacts/` | Pages published along the way: the Gratifi system map, the pitch deck source, and the chat components sheet for sign-off (2 Oct). |
| `review/` | The test and review scripts from each review round, with their text reports. Screenshots are left out to keep the repo small. |
| `docs/` | Reserved for the Markdown exports of the Claude Docs listed below. |

## The live documents

These stay live in Claude and are the latest versions:

- Gratifi product doc (one-pager, where the money is, first 25 brands, deal scores, what we checked, competitive landscape, company data map, UK and EU targets): https://claude.ai/code/artifact/19bfb967-3831-43cc-aa7b-1e70712e47af
- Gratifi team handoff: https://claude.ai/code/artifact/f3fec621-39ab-455f-9952-26cd9d4f6d45
- Gratifi for Barclaycard, build and handover: https://claude.ai/code/artifact/be6d2d20-bbad-4ba8-a093-575124c82f94
- Every service, every flow (2 Oct): https://claude.ai/code/artifact/2d7068c1-4675-4080-ae1f-7147e443d1b4
- Chat components for sign-off (2 Oct): https://claude.ai/artifact/3RQrj3mBvjc5i6inmZxrjR
- The app inside Claude: https://claude.ai/artifact/PnL2cqt2NU8tFYp8MDMKaj
- The app on the web: https://project-95d8n.vercel.app

These links open only for people the owner has shared them with.

## Still to add

Some conversation turns are not in `conversation/` yet: 20–25, 41–51, 65–77 and 208–259, plus everything after turn 308. The tool that reads past turns allows a fixed number of reads an hour, so these follow in a later commit.
