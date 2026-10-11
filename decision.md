# Decision Record: Resume AI Parser

**Status:** Accepted
**Date:** 2026-10-11
**Scope:** Phase 1, frontend only

---

## 1. Context

Build a web app that reads a resume file and returns structured data.

- Input: PDF, DOCX, or TXT.
- Output: name, email, phone, links, skills, education, experience, projects.
- Constraint: no backend for now.

---

## 2. Decisions

| # | Decision | Choice | Reason |
|---|----------|--------|--------|
| D1 | UI framework | React.js | Component model fits upload, result cards. |
| D2 | Build tool | Vite | Fast dev server, minimal config. |
| D3 | Language | JavaScript (JSX) | Faster start. TypeScript can come later. |
| D4 | Styling | Plain CSS | No extra dependency. Easy to read. |
| D5 | PDF text extraction | `pdfjs-dist` | Runs fully in the browser. |
| D6 | DOCX text extraction | `mammoth` | Browser-compatible raw text output. |
| D7 | Parsing engine | Rule-based (regex, section detection, skill dictionary) | No server, no API key, no cost. |
| D8 | State management | React `useState` | Single-page app, small state. |
| D9 | Persistence | None | No backend. Results live in memory. |
| D10 | Export | JSON download, copy to clipboard | Cheap and useful. |

---

## 3. Why "AI" is rule-based for now

- LLM calls need an API key.
- Keys in frontend code are public.
- A backend proxy is the safe path.
- Phase 1 uses heuristics. Interface stays swappable.

The parser is isolated in `src/lib/parseResume.js`. Replace its internals with an API call later. UI code stays unchanged.

---

## 4. In Scope

- Drag-and-drop or file picker upload.
- Client-side text extraction.
- Structured parsing into JSON.
- Result display in cards.
- JSON export.
- Basic error handling.

## 5. Out of Scope

- Backend, database, authentication.
- OCR for scanned PDFs.
- LLM-based parsing.
- Multi-resume batch ranking.
- Job description matching.

---

## 6. Folder Structure

```
resume-parser/
  index.html
  package.json
  src/
    main.jsx
    App.jsx
    App.css
    lib/
      extractText.js
      parseResume.js
    components/
      UploadBox.jsx
      ResultView.jsx
```

---

## 7. Known Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Multi-column PDFs scramble text order | Wrong sections | Use line-break aware extraction. Accept limits. |
| Scanned PDFs have no text layer | Empty output | Show clear error. Add OCR in a later phase. |
| Non-standard section headings | Missed sections | Expand heading patterns over time. |
| Skill dictionary is finite | Missed skills | Keep list editable in one file. |
| Name detection is heuristic | Occasional errors | Let user edit fields in a later phase. |

---

## 8. Future Phases

1. **Phase 2:** Editable result fields, localStorage history.
2. **Phase 3:** Node.js or Python backend, LLM parsing via API.
3. **Phase 4:** Job description matching and scoring.
4. **Phase 5:** Auth, saved profiles, deployment.

---

## 9. Revisit Triggers

- Parsing accuracy falls below acceptable level on real resumes.
- Need to store results across devices.
- Need to use an LLM.

Any trigger moves the project to Phase 3.
