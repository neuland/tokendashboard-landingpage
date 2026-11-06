# Contributing

Thanks for helping to document the Token & CO₂ Dashboard.

- **Fixing or extending the documentation:** open a pull request against `main`. Keep the
  site's role in mind — it explains how the pieces fit together and links to the repositories
  for details; it does not replace their READMEs.
- **Decisions:** the decisions section is generated from `backend/docs/decisions.md` in the
  tokendashboard repository (see [README.md → Decisions](README.md#decisions)). To add or change a
  decision, change it there; this site only needs a change when a new entry lands in the
  wrong area.
- **Issues with the dashboard itself** belong in the respective repository
  (tokendashboard for backend and frontend, or one of the plugins), not here.
- **Security issues** in any of the components: follow the `SECURITY.md` of that repository.

Before opening a pull request, run `npm run build` — the content collection schema is
validated during the build, so a malformed record fails early.
