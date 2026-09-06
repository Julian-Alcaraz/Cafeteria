# Global Rules

## Functional & Business Logic Documentation
- **Mandatory Documentation**: Every time a functional decision is made, a new requirement is added or modified, or business logic is changed, it MUST be documented.
- **Where to Document**: Record these decisions and logic changes in the `docs/decisions/` folder. Create a new markdown file for significant features or append to existing documentation.
- **Goal**: Ensure that 3 years from now, any new developer (or AI agent) can read the documentation and understand *why* and *how* the business logic was implemented.

## Git & Commits
- **Never Auto-Commit**: DO NOT create commits automatically after completing tasks unless the user explicitly requests it.
- **Always Co-Author**: When instructed to commit, always ensure the user is set as the Author (using their global git config) and include `Co-authored-by: Antigravity <bot@antigravity.dev>` in the commit message.
