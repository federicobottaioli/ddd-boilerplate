# Architecture Documentation

## Overview

This boilerplate implements **Hexagonal Architecture** (also known as Ports & Adapters) combined with **Domain-Driven Design (DDD)** principles.

## Architecture Layers

### 1. Domain Layer (Core)

The domain layer contains pure business logic with no dependencies on external frameworks or infrastructure.

**Location**: `src/modules/{module}/domain/`

**Components**:
- **Entities**: Rich domain models with business logic (e.g., `Payment`, `Transaction`)
- **Repositories**: Interfaces defining data access contracts (ports)
- **Services**: Domain services for complex business operations
- **Ports**: Interfaces for external services (e.g., `PaymentGatewayPort`)
- **Value Objects**: Immutable objects representing domain concepts
- **Types**: Domain-specific type definitions

**Example**:
```typescript
// Domain Entity
export class Payment {
    // Business logic methods
    canBeProcessed(): boolean { ... }
    canBeRefunded(): boolean { ... }
    updateStatus(statusId: string): void { ... }
}
```

### 2. Infrastructure Layer

The infrastructure layer implements the interfaces defined in the domain layer.

**Location**: `src/modules/{module}/infrastructure/`

**Components**:
- **ORM Entities**: TypeORM entities for database mapping
- **Repository Implementations**: Concrete implementations of domain repositories
- **Adapters**: External service adapters (e.g., payment gateways)
- **Mappers**: Convert between domain and infrastructure entities

**Example**:
```typescript
// Infrastructure Adapter
@Injectable()
export class MpgsPaymentAdapter implements PaymentGatewayPort {
    async authorize(request: AuthorizePaymentRequest): Promise<GatewayResponse> {
        // Implementation calling MPGS API
    }
}
```

### 3. Application/API Layer

The application layer handles HTTP requests and coordinates domain services.

**Location**: `src/modules/{module}/controllers/`

**Components**:
- **Controllers**: REST API endpoints
- **DTOs**: Data Transfer Objects for request/response
- **Mappers**: Convert between domain entities and DTOs
- **Validation**: Input validation using class-validator

## Hexagonal Architecture Flow

```
┌─────────────────────────────────────────┐
│         API Layer (Controllers)         │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Domain Services (Business Logic)    │
└──────┬───────────────────────┬──────────┘
       │                       │
┌──────▼──────────┐   ┌───────▼──────────┐
│  Repositories   │   │  Gateway Ports   │
│   (Interfaces)   │   │   (Interfaces)   │
└──────┬──────────┘   └───────┬──────────┘
       │                       │
┌──────▼──────────┐   ┌───────▼──────────┐
│ Infrastructure  │   │   Adapters       │
│  Implementations│   │  (MPGS, CS, etc) │
└─────────────────┘   └──────────────────┘
```

## Dependency Direction

**Key Principle**: Dependencies point **inward** toward the domain layer.

- ✅ Domain layer has **no dependencies** on infrastructure
- ✅ Infrastructure **implements** domain interfaces
- ✅ Application layer **uses** domain services

## Module Structure

Each module follows this structure:

```
module-name/
├── domain/
│   ├── entities/          # Domain entities
│   ├── repositories/      # Repository interfaces
│   ├── services/          # Domain services
│   ├── ports/             # External service interfaces
│   ├── types/             # Type definitions
│   └── constants/         # Domain constants
├── infrastructure/
│   ├── entities/          # ORM entities
│   ├── repositories/      # Repository implementations
│   ├── adapters/          # External service adapters
│   └── mappers/           # Domain ↔ Infrastructure mappers
└── controllers/
    ├── dto/               # Request/Response DTOs
    ├── mappers/           # Domain ↔ DTO mappers
    └── {module}.controller.ts
```

## Payment Module Example

The Payment module demonstrates the full architecture:

1. **Domain**: `Payment` entity with business rules
2. **Port**: `PaymentGatewayPort` interface
3. **Adapters**: `MpgsPaymentAdapter`, `CyberSourcePaymentAdapter`
4. **Service**: `PaymentService` orchestrates payment flow
5. **Repository**: `PaymentRepository` interface → `PaymentRepositoryImpl`

## Benefits

1. **Testability**: Domain logic can be tested without infrastructure
2. **Flexibility**: Easy to swap implementations (e.g., different payment gateways)
3. **Maintainability**: Clear separation of concerns
4. **Scalability**: Easy to add new features without breaking existing code

## Design Patterns Used

- **Repository Pattern**: Abstract data access
- **Adapter Pattern**: Payment gateway adapters
- **Mapper Pattern**: Convert between layers
- **Factory Pattern**: Entity creation methods
- **Strategy Pattern**: Different payment gateway implementations
