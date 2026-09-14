# Global Rules

## Functional & Business Logic Documentation
- **Mandatory Documentation**: Every time a functional decision is made, a new requirement is added or modified, or business logic is changed, it MUST be documented.
- **Where to Document**: Record these decisions and logic changes in the `docs/decisions/` folder. Create a new markdown file for significant features or append to existing documentation.
- **Goal**: Ensure that 3 years from now, any new developer (or AI agent) can read the documentation and understand *why* and *how* the business logic was implemented.

## Git & Commits
- **Never Auto-Commit**: DO NOT create commits automatically after completing tasks unless the user explicitly requests it.
- **Always Co-Author**: When instructed to commit, always ensure the user is set as the Author (using their global git config) and include `Co-authored-by: Antigravity <bot@antigravity.dev>` in the commit message.

## UX & UI Standards (Frontend)
- **Async Action Feedback (Loading States)**: Any button that triggers an asynchronous request (API call) MUST be disabled while the request is processing and display a loading state (e.g., `<i class="pi pi-spinner pi-spin"></i> Cargando...`).
- **User Feedback (Toast)**: Every action that requires user feedback MUST use the PrimeNG Toast component (`MessageService`). 
  - On **success**: Display a success toast and, if applicable, close modals and clear forms.
  - On **error**: Display an error/warning toast and DO NOT clear forms or close modals so the user can correct the input or retry.

## Code Quality & Architecture
- **Use Path Aliases (No Relative Hell)**: Never use long relative paths (e.g., `../../../../../`). Always prefer using the defined path aliases (like `@shared`, `@core`, `@features`, `@environments`, `@modules`, etc.) from the respective `tsconfig.json`. If a logical alias does not exist for a newly created top-level folder, create it and use it.
