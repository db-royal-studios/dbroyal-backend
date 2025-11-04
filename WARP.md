# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

NestJS backend infrastructure project designed for building a fully functional and scalable backend system with microservices architecture, intended for fintech domain applications.

## Common Commands

### Development
```bash
# Install dependencies
yarn install

# Start in development mode with hot-reload
yarn run start:dev

# Start in production mode
yarn run start:prod

# Build the project
yarn run build
```

### Testing
```bash
# Run all unit tests
yarn run test

# Run tests in watch mode
yarn run test:watch

# Run end-to-end tests
yarn run test:e2e

# Generate test coverage report
yarn run test:cov

# Debug tests
yarn run test:debug
```

### Code Quality
```bash
# Lint and auto-fix TypeScript files
yarn run lint

# Format code with Prettier
yarn run format
```

## Architecture

### NestJS Structure

This is a **NestJS v10** TypeScript application following standard NestJS patterns:

- **Modular architecture**: Uses NestJS modules (`@Module` decorator) to organize features
- **Dependency injection**: Services are injectable (`@Injectable`) and injected via constructors
- **Controllers**: Handle HTTP requests using decorators (`@Controller`, `@Get`, `@Post`, etc.)
- **Services**: Contain business logic and are injected into controllers
- **Entry point**: `src/main.ts` bootstraps the application on port 3000

### Project Goals (from README)

The backend is architected with these key principles:

1. **Microservices Architecture**: Services divided by business function (user management, transaction processing, reporting)
2. **API Gateway**: Centralized request routing with cross-cutting concerns (authentication, logging, rate limiting)
3. **Horizontal Scalability**: Services scale independently using Docker/Kubernetes
4. **Event-Driven Communication**: Message brokers (RabbitMQ, Kafka) for inter-service communication
5. **Security**: OAuth2/JWT authentication, HTTPS, encryption at rest
6. **Database Strategy**: Mixed (PostgreSQL for relational, MongoDB for document-based), with replication and sharding

### Testing Strategy

- **Unit tests**: Located in `src/**/*.spec.ts` (Jest framework)
- **E2E tests**: Located in `test/**/*.e2e-spec.ts` (Supertest framework)
- Test configuration in `package.json` jest section and `test/jest-e2e.json`

## TypeScript Configuration

- **Target**: ES2021
- **Module**: CommonJS
- **Decorators enabled**: Required for NestJS dependency injection
- **Strict mode**: Partially disabled (strictNullChecks, noImplicitAny off)
- **Output**: Compiled to `dist/` directory

## Development Guidelines

### When Adding New Features

1. Create a new module if the feature represents a distinct business domain
2. Generate NestJS resources using the CLI: `nest generate resource <name>`
3. Follow the existing pattern: Controller → Service → Module
4. Write unit tests alongside implementation (`.spec.ts` files)
5. Add E2E tests for API endpoints in `test/` directory

### Code Organization

- Keep business logic in **services**, not controllers
- Controllers should only handle HTTP concerns (request/response mapping)
- Use NestJS built-in decorators for validation, transformation, and guards
- Services should be stateless and injectable

### Package Manager

**Yarn v1.22.22** is the specified package manager. Always use `yarn` commands, not `npm`.

## Future Architecture Considerations

As per the README, the following are planned architectural elements (may not be implemented yet):

- Centralized logging (ELK stack)
- Performance monitoring (Prometheus, Grafana)
- Message brokers for event-driven architecture
- API documentation (Swagger/OpenAPI)
- Caching layer (Redis)
- CI/CD pipelines (Jenkins/GitLab CI/GitHub Actions)
- Compliance measures (GDPR, PCI-DSS)
- Rate limiting and throttling
- Disaster recovery and backup strategies
