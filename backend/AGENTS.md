# Backend (NestJS) Rules

## Clean Code
- **Dependency Injection**: Always use NestJS dependency injection.
- **Controllers**: Keep controllers small and focused only on routing and handling HTTP requests/responses. Delegate all business logic to Services.
- **DTOs and Validation**: Use Data Transfer Objects (DTOs) for all incoming data and validate them using `class-validator` and `class-transformer`.
- **Typing**: Use strict TypeScript typing. Avoid `any`.
- **Modularity**: Organize code by domain/feature modules.

## Unit Testing
- **Mandatory Tests**: Every Service, Controller, Guard, and Pipe must have a corresponding `.spec.ts` file.
- **Coverage**: Do not leave business logic uncovered. Write unit tests for all public methods.
- **Mocks**: Mock external dependencies and database interactions in unit tests.

## Documentation (Swagger & Postman)
- **Mandatory Swagger**: EVERY endpoint in the controllers must be documented using `@nestjs/swagger` decorators (e.g., `@ApiOperation`, `@ApiResponse`, `@ApiTags`, `@ApiBody`, `@ApiParam`).
- **DTO Documentation**: All DTO properties must be documented using `@ApiProperty` so they reflect correctly in the Swagger UI.
- **Postman Collection**: Maintain and update the Postman collection file (`postman_collection.json`) in the backend root directory whenever a new endpoint is created or modified.
