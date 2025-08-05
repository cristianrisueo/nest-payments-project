# Payments Project - Hexagonal Architecture

Complete **P2P payments ecosystem** built with NestJS following **Hexagonal Architecture** (Ports and Adapters Pattern) and Domain-Driven Design principles. Features full user management and real-time payment processing with balance transfers.

## 🛠️ Technologies

- **NestJS** - Node.js framework with TypeScript-first approach
- **TypeScript** - Static typing and enhanced developer experience
- **MongoDB** - NoSQL database with dual-database architecture
- **Mongoose** - MongoDB ODM with schema validation
- **bcrypt** - Secure password hashing and verification
- **Docker** - Containerized database infrastructure
- **Jest** - Testing framework for unit and integration tests
- **Postman** - API testing with comprehensive collection

## 🏗️ Architecture

The project implements **Hexagonal Architecture** with clear separation of concerns and Domain-Driven Design:

```
src/
├── users/                    # Users Bounded Context
│   ├── domain/              # Business logic core
│   │   ├── entities/        # User aggregate root
│   │   ├── value-objects/   # Email, Password, Amount value objects
│   │   └── repositories/    # Repository interfaces
│   ├── application/         # Use cases and business workflows
│   │   ├── registerUser.ts
│   │   ├── authenticateUser.ts
│   │   ├── getUserById.ts
│   │   ├── getUserByEmail.ts
│   │   ├── deleteUser.ts
│   │   ├── changePassword.ts
│   │   └── updateBalance.ts
│   └── infrastructure/      # External adapters
│       ├── controllers/     # HTTP REST endpoints
│       ├── repositories/    # MongoDB implementation
│       └── schemas/         # Mongoose schemas
├── payments/                # Payments Bounded Context
│   ├── domain/              # Payment business logic
│   │   ├── entities/        # Payment aggregate root
│   │   ├── value-objects/   # TransactionId, Currency, PaymentMethod
│   │   └── repositories/    # Payment repository interfaces
│   ├── application/         # Payment workflows
│   │   ├── sendPayment.ts
│   │   ├── processPayment.ts
│   │   ├── getPaymentById.ts
│   │   ├── getPaymentHistory.ts
│   │   └── refundPayment.ts
│   └── infrastructure/      # Payment adapters
│       ├── controllers/     # Payment REST endpoints
│       ├── repositories/    # MongoDB implementation
│       └── schemas/         # Payment data schemas
├── shared/                  # Cross-cutting concerns
│   ├── value-objects/       # Amount (shared between domains)
│   ├── db/                  # Database configuration
│   └── filters/             # Exception handling
├── app.module.ts            # Root module
└── main.ts                  # Application entry point
```

### Bounded Contexts

1. **Users**: Complete user lifecycle with authentication and balance management
2. **Payments**: Full P2P payment processing with transaction lifecycle

## ⚡ Key Commands

### Development

```bash
npm run start:dev         # Hot reload development server
npm run build             # Compile TypeScript
npm run start:prod        # Production server
```

### Testing

```bash
npm test                  # Unit tests
npm run test:watch        # Watch mode testing
npm run test:cov          # Coverage reports
npm run test:e2e          # End-to-end tests
npm run test:api          # Newman API collection tests
npm run test:api:users    # Users domain API tests
npm run test:api:payments # Payments domain API tests
```

### Code Quality

```bash
npm run lint              # ESLint with auto-fix
npm run format            # Prettier formatting
```

### API Testing with Newman

```bash
npm install -g newman     # Global Newman installation
npm run test:api          # Run complete API test suite
npm run test:api:ci       # CI-friendly with detailed reports
npm run test:api:watch    # Watch mode for API development
```

### Database

```bash
docker-compose up -d      # Start MongoDB containers
docker-compose down       # Stop containers
```

## 🚀 Installation & Setup

1. **Clone Repository**

```bash
git clone <repository-url>
cd payments-project
```

2. **Install Dependencies**

```bash
npm install
```

3. **Configure Environment Variables**

Create `.env` file in project root:

```bash
# Database Configuration
USERS_DB_URL=mongodb://admin:users123@localhost:27017/users_db?authSource=admin
PAYMENTS_DB_URL=mongodb://admin:payments123@localhost:27018/payments_db?authSource=admin

# Application Configuration
PORT=3000
NODE_ENV=development
```

4. **Start Database Infrastructure**

```bash
docker-compose up -d
```

5. **Run Development Server**

```bash
npm run start:dev
```

## 📊 API Endpoints

### User Management

- `POST /users/register` - Register new user with email/password
- `POST /users/authenticate` - Authenticate user credentials
- `GET /users/:id` - Retrieve user by unique identifier
- `GET /users/email/:email` - Find user by email address
- `PATCH /users/:id/password` - Change user password
- `PATCH /users/:id/balance` - Update user balance
- `DELETE /users/:id` - Delete user account

### Payment Processing

- `POST /payments` - Create new P2P payment
- `GET /payments/:transactionId` - Retrieve payment details
- `PATCH /payments/:transactionId/process` - Process pending payment
- `PATCH /payments/:transactionId/refund` - Refund completed payment
- `GET /payments/user/:userId/history` - Get user payment history

### Request/Response Examples

**Register User:**

```json
POST /users/register
{
  "email": "alice@payments.com",
  "password": "SecurePass123"
}

Response: 201 Created
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "alice@payments.com",
  "createdAt": "2025-08-05T17:30:00.000Z"
}
```

**Send Payment:**

```json
POST /payments
{
  "fromUserId": "550e8400-e29b-41d4-a716-446655440000",
  "toUserId": "660f9511-f39c-52e5-b827-557766551111",
  "amountCents": 2500,
  "currencyCode": "USD",
  "paymentMethodType": "CREDIT_CARD",
  "paymentMethodLastFour": "4532",
  "description": "Dinner split payment"
}

Response: 201 Created
{
  "id": "tx_1a2b3c4d5e6f7g8h",
  "fromUserId": "550e8400-e29b-41d4-a716-446655440000",
  "toUserId": "660f9511-f39c-52e5-b827-557766551111",
  "amount": "$25.00",
  "currency": "USD",
  "paymentMethod": "CREDIT_CARD ending in 4532",
  "status": "PENDING",
  "description": "Dinner split payment",
  "createdAt": "2025-08-05T17:30:00.000Z"
}
```

**Process Payment:**

```json
PATCH /payments/tx_1a2b3c4d5e6f7g8h/process

Response: 200 OK
{
  "id": "tx_1a2b3c4d5e6f7g8h",
  "status": "COMPLETED",
  "processedAt": "2025-08-05T17:31:00.000Z",
  "message": "Payment completed successfully. Transferred $25.00 from alice@payments.com to bob@payments.com",
  "senderNewBalance": "$75.00",
  "receiverNewBalance": "$75.00"
}
```

## 🧪 Testing

### Newman API Testing

**Install Newman globally:**

```bash
npm install -g newman
```

**Run API test suites:**

```bash
# Complete API test suite
npm run test:api

# Individual domain testing
npm run test:api:users
npm run test:api:payments

# CI/CD pipeline testing
npm run test:api:ci

# Development with auto-retry
npm run test:api:watch
```

**Newman Scripts (add to package.json):**

```json
{
  "scripts": {
    "test:api": "newman run postman/Complete_Payments_API.postman_collection.json -e postman/local.postman_environment.json",
    "test:api:users": "newman run postman/Users_API.postman_collection.json -e postman/local.postman_environment.json",
    "test:api:payments": "newman run postman/Complete_Payments_API.postman_collection.json -e postman/local.postman_environment.json --folder 'Payment Operations'",
    "test:api:ci": "newman run postman/Complete_Payments_API.postman_collection.json -e postman/local.postman_environment.json --reporters cli,json --reporter-json-export reports/newman-report.json",
    "test:api:watch": "nodemon --watch src --ext ts --exec 'npm run test:api'",
    "test:integration": "npm run test:api && npm test",
    "test:full": "npm run lint && npm run test:integration"
  }
}
```

### Manual Testing with Postman

Import the comprehensive Postman collections:

```bash
postman/
├── Complete_Payments_API.postman_collection.json
├── Users_API.postman_collection.json
└── local.postman_environment.json
```

**Test Coverage:**

- ✅ User registration and authentication flows
- ✅ Balance management operations
- ✅ Complete payment lifecycle (Send → Process → Refund)
- ✅ Payment history and retrieval operations
- ✅ Error handling scenarios
- ✅ Balance validation and insufficient funds testing
- ✅ Cross-domain operations validation
- ✅ Automated assertions and variable chaining
- ✅ Environment-based testing (local, staging, production)

### Unit Testing

```bash
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:cov          # Coverage report
npm run test:integration  # Unit + API tests
npm run test:full         # Lint + Integration tests
```

**Testing Philosophy:**
- Domain logic unit tests
- Use case integration tests
- Repository contract compliance
- Value object validation tests
- **Newman automated API validation**
- **End-to-end workflow verification**

### CI/CD Integration

**GitHub Actions example:**

```yaml
name: API Tests
on: [push, pull_request]
jobs:
  api-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: docker-compose up -d
      - run: npm run start:dev &
      - run: sleep 10  # Wait for app startup
      - run: npm run test:api:ci
      - uses: actions/upload-artifact@v3
        with:
          name: newman-report
          path: reports/newman-report.json
```

## 🗄️ Database Architecture

### Dual Database Setup

- **Users Database** (Port 27017): User accounts, authentication, balances
- **Payments Database** (Port 27018): Transaction data, payment methods, history

### Domain Models

**User Entity:**
- Unique UUID identifier
- Email value object with validation
- Password value object with bcrypt hashing
- Balance amount with monetary operations
- Creation timestamp
- Immutable value objects design

**Payment Entity:**
- Transaction ID value object
- Amount value object with formatting
- Currency value object with validation
- Payment method value object
- Payment status lifecycle (PENDING → PROCESSING → COMPLETED/FAILED/REFUNDED)
- Creation and processing timestamps

**Value Objects:**
- `Email`: Format validation, normalization
- `Password`: Strength requirements, secure hashing
- `Amount`: Monetary operations, formatting, validation
- `Currency`: Supported currency validation
- `TransactionId`: Unique payment identification
- `PaymentMethod`: Payment type and card information

## 🔧 Domain-Driven Design Features

### Aggregate Roots

- **User**: Controls all user-related data and business rules
- **Payment**: Manages payment lifecycle and transaction integrity

### Repository Pattern

- Interface-based contracts in domain layer
- MongoDB implementation in infrastructure layer
- Dependency injection with tokens
- Cross-domain repository access for balance operations

### Use Cases

Clean application services that orchestrate domain logic:

- **Users**: Registration, authentication, profile management, balance updates
- **Payments**: Payment creation, processing, refunding, history retrieval
- Business rule validation
- Domain object coordination
- Error handling and response formatting

### Value Object Design

- **Immutability**: Value objects never change after creation
- **Validation**: Built-in business rule enforcement
- **Encapsulation**: Hide implementation details
- **Equality**: Value-based comparison, not reference-based

## 📋 Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **Input Validation**: Email format, password strength, amount validation
- **Balance Verification**: Insufficient funds protection
- **Error Handling**: Secure error messages preventing enumeration
- **Domain Validation**: Business rules enforced at entity level
- **Transaction Integrity**: Atomic balance operations

## 🔄 Payment Lifecycle

### 1. Payment Creation
- User initiates payment with recipient and amount
- Payment created in PENDING status
- Amount and currency validation
- Payment method verification

### 2. Payment Processing
- Balance verification for sender
- Atomic balance transfer operation
- Status updated to PROCESSING → COMPLETED
- Balance updates for both users
- Error handling for insufficient funds

### 3. Payment History
- Complete transaction audit trail
- User-specific payment history
- Status tracking and timestamps
- Cross-reference with user balances

### 4. Refund Operations
- Completed payments can be refunded
- Reverse balance operations
- Status updated to REFUNDED
- Balance restoration verification

## 🏛️ Architectural Principles

### Hexagonal Architecture Layers

1. **Domain Layer (Core)**
   - Pure business logic
   - No infrastructure dependencies
   - Value objects and entities
   - Repository interfaces

2. **Application Layer (Use Cases)**
   - Business workflows
   - Domain object coordination
   - Cross-cutting concerns
   - Error handling

3. **Infrastructure Layer (Adapters)**
   - Database implementations
   - HTTP controllers
   - External service adapters
   - Framework-specific code

### Dependency Inversion

- Domain defines interfaces
- Infrastructure implements contracts
- Application orchestrates domain logic
- Clean dependency direction (inward)

### Single Responsibility

- Each use case has one business purpose
- Value objects encapsulate single concepts
- Repository interfaces are focused
- Controllers handle only HTTP concerns

## 🎯 Development Workflow

1. **Domain First**: Create entities and value objects
2. **Repository Interfaces**: Define persistence contracts
3. **Use Cases**: Implement business workflows
4. **Infrastructure**: Add databases, controllers, external adapters
5. **Module Integration**: Wire dependencies through modules
6. **Testing**: Validate with unit tests and API collection

```bash
# Complete validation workflow
npm run lint && npm run test && npm run start:dev
```

## 📊 Project Status

### ✅ Completed Features

**Users Domain:**
- Complete user lifecycle management
- Authentication and authorization
- Balance management with monetary operations
- Password security with bcrypt hashing
- Email validation and normalization

**Payments Domain:**
- Full P2P payment processing
- Real-time balance transfers
- Payment status lifecycle management
- Transaction history and audit trails
- Refund operations with balance restoration
- Cross-domain user integration

**Infrastructure:**
- Dual MongoDB database architecture
- Comprehensive Postman API collections
- Docker containerization
- Professional documentation
- Clean git history with meaningful commits

**Architecture:**
- Hexagonal architecture implementation
- Domain-driven design principles
- Repository pattern with dependency injection
- Value object immutability design
- Cross-cutting concerns separation

### 🚀 Ready for Production

- **Local Development**: Full Docker setup with hot reload
- **Team Collaboration**: Comprehensive documentation and testing
- **Deployment**: Production-ready configuration
- **Monitoring**: Error handling and validation
- **Automated Testing**: Newman API validation pipeline
- **CI/CD Ready**: Automated test execution and reporting

### 🔮 Future Enhancements

- **JWT Authentication**: Token-based session management
- **Email Verification**: Account activation workflows
- **Payment Providers**: Integration with Stripe, PayPal
- **Event Sourcing**: Domain events for audit trails
- **CQRS**: Command Query Responsibility Segregation
- **Real-time Notifications**: WebSocket payment updates
- **Rate Limiting**: API throttling and protection
- **Caching**: Redis for performance optimization

## 📝 Architecture Principles Applied

### **Clean Architecture**
- **Dependency Inversion**: Domain independent of infrastructure
- **Single Responsibility**: Each layer has distinct concerns
- **Interface Segregation**: Repository contracts define minimal operations
- **Domain Integrity**: Business rules encapsulated in domain objects

### **Security Best Practices**
- Never store plaintext passwords
- Secure error messages prevent information leakage
- Input validation at multiple layers
- Environment-based configuration
- Atomic monetary operations

### **Clean Code Standards**
- Descriptive naming conventions
- Comprehensive JSDoc documentation
- Type safety throughout application
- Consistent error handling patterns
- Immutable value object design

---

**Built with ❤️ following clean architecture principles and modern TypeScript practices.**

*A collaboration that demonstrates how proper domain modeling and hexagonal architecture create maintainable, testable, and scalable payment systems.*