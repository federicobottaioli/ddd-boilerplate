# DDD Payment Processing Boilerplate

A comprehensive NestJS boilerplate demonstrating **Hexagonal Architecture** (Ports & Adapters) with **Domain-Driven Design (DDD)** principles, using a card payment processing domain as an example.

## 🏗️ Architecture Overview

This boilerplate showcases:

- **Hexagonal Architecture**: Clear separation between domain, application, and infrastructure layers
- **Domain-Driven Design**: Rich domain models with business logic encapsulated in entities
- **Payment Gateway Adapters**: Example implementations for MPGS and CyberSource (mock adapters)
- **Complete Payment Flow**: Create → Authorize → Capture → Refund operations
- **Transaction Tracking**: Full audit trail of all payment operations

## 📁 Project Structure

```
src/
├── config/              # Application configuration
├── db/                  # Database setup and migrations
├── modules/
│   ├── payment/         # Payment aggregate (main domain)
│   │   ├── domain/      # Pure business logic
│   │   ├── infrastructure/  # Technical implementations
│   │   └── controllers/ # API layer
│   ├── transaction/     # Transaction entity
│   ├── customer/        # Customer reference entity
│   ├── payment-status/  # Payment status catalog
│   └── shared/          # Shared domain/infrastructure
└── seeder/              # Database seeders
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20
- npm >= 10.5
- Docker & Docker Compose (for database)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ddd-boilerplate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.development
   # Edit .env.development with your database credentials
   ```

4. **Start database**
   ```bash
   docker-compose up -d database
   ```

5. **Run migrations**
   ```bash
   npm run migration:run
   ```

6. **Seed database**
   ```bash
   npm run seed
   ```

7. **Start development server**
   ```bash
   npm run start:dev
   ```

The API will be available at `http://localhost:3000/api`

Swagger documentation: `http://localhost:3000/docs`

## 📚 Documentation

- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Detailed architecture explanation
- [API.md](./docs/API.md) - REST API documentation
- [PAYMENT_FLOW.md](./docs/PAYMENT_FLOW.md) - Payment processing flow

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## 🔧 Available Scripts

- `npm run start:dev` - Start development server with watch mode
- `npm run build` - Build for production
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run migration:generate` - Generate a new migration
- `npm run migration:run` - Run pending migrations
- `npm run seed` - Seed the database

## 🎯 Key Features

### Domain Layer
- Pure domain entities with business logic
- Repository interfaces (ports)
- Domain services for complex operations
- Value objects and domain events support

### Infrastructure Layer
- TypeORM repository implementations
- Payment gateway adapters (MPGS, CyberSource)
- Mappers between domain and infrastructure
- Database migrations

### Application Layer
- RESTful API controllers
- DTOs with validation
- Request/Response mappers
- Error handling

## 🔌 Payment Gateway Adapters

The boilerplate includes mock implementations of:

- **MPGS (Mastercard Payment Gateway Services)**
- **CyberSource**

To switch between adapters, modify `payment.module.ts`:

```typescript
{
    provide: 'PaymentGatewayPort',
    useClass: MpgsPaymentAdapter, // or CyberSourcePaymentAdapter
}
```

## 📖 Usage Example

### Create a Payment

```bash
POST /api/payments
{
  "amount": 100.50,
  "currency": "USD",
  "cardToken": "tok_1234567890",
  "merchantReference": "ORD-12345",
  "customerId": "customer-uuid",
  "paymentStatusId": "pending-status-uuid"
}
```

### Process Payment (Authorize + Capture)

```bash
POST /api/payments/{paymentId}/process
```

### Refund Payment

```bash
POST /api/payments/{paymentId}/refund
{
  "amount": 50.25  // Optional: omit for full refund
}
```

## 🏛️ Architecture Principles

1. **Dependency Inversion**: Domain layer doesn't depend on infrastructure
2. **Single Responsibility**: Each module has a clear, single purpose
3. **Open/Closed**: Easy to add new payment gateways without modifying existing code
4. **Interface Segregation**: Small, focused interfaces
5. **DRY**: Shared utilities and base classes

## 📝 License

This is a boilerplate/template project. Use it as a starting point for your own projects.

## 🤝 Contributing

This is a reference implementation. Feel free to fork and adapt for your needs.
