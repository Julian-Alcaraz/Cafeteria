# Frontend (Angular) Rules

## Agent Skills and Rules
- **Mandatory Skills Activation**: Whenever you work on code inside this frontend directory, you MUST review and follow the skills available in `frontend/.agents/skills/` (such as `angular-developer` and `angular-new-app`).
- **Read Skills First**: Before making architectural changes or writing new features, ensure you have read the relevant `SKILL.md` files located in the `.agents/skills` folder to apply the correct guidelines.
- **Enforce Best Practices**: Always adhere to the Angular best practices and code standards defined in those skills.
- **Use Path Aliases**: Never use long relative paths (like `../../../../../`). Always use the defined path aliases (like `@shared`, `@core`, `@features`, `@environments`) from `tsconfig.json`. If a required alias does not exist for a new architectural folder, define it in `tsconfig.json` and use it.
