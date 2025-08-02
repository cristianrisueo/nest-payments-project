# Payments Project - Hexagonal Architecture

Complete user management and payments system built with NestJS following **Hexagonal Architecture** (Ports and Adapters Pattern) and Domain-Driven Design principles.

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
│   │   ├── value-objects/   # Email, Password value objects
│   │   └── repositories/    # Repository interfaces
│   ├── application/         # Use cases and business workflows
│   │   ├── registerUser.ts
│   │   ├── authenticateUser.ts
│   │   ├── getUserById.ts
│   │   ├── getUserByEmail.ts
│   │   ├── deleteUser.ts
│   │   └── changePassword.ts
│   └── infrastructure/      # External adapters
│       ├── controllers/     # HTTP REST endpoints
│       ├── repositories/    # MongoDB implementation
│       └── schemas/         # Mongoose schemas
├── payments/                # Payments Bounded Context (Future)
├── shared/                  # Cross-cutting concerns
│   ├── db/                  # Database configuration
│   └── filters/             # Exception handling
├── app.module.ts            # Root module
└── main.ts                  # Application entry point
```

### Bounded Contexts

1. **Users**: Complete user lifecycle with authentication and profile management
2. **Payments**: Payment processing and transaction management (Future implementation)

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
```

### Code Quality

```bash
npm run lint              # ESLint with auto-fix
npm run format            # Prettier formatting
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
- `DELETE /users/:id` - Delete user account

### Request/Response Examples

**Register User:**
```json
POST /users/register
{
  "email": "john.doe@example.com",
  "password": "SecurePass123"
}

Response: 201 Created
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john.doe@example.com",
  "createdAt": "2025-08-02T17:30:00.000Z"
}
```

**Authenticate User:**
```json
POST /users/authenticate
{
  "email": "john.doe@example.com",
  "password": "SecurePass123"
}

Response: 200 OK
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john.doe@example.com",
  "isAuthenticated": true
}
```

## 🧪 Testing

### API Testing with Postman

Import the comprehensive Postman collection:

```bash
# Collection file
Users_API_Collection.postman_collection.json
```

**Test Coverage:**
- ✅ User registration with validation
- ✅ Authentication flows
- ✅ Profile retrieval operations
- ✅ Password management
- ✅ Error handling scenarios
- ✅ Input validation testing

## 🗄️ Database Architecture

### Dual Database Setup

- **Users Database** (Port 27017): User accounts, authentication
- **Payments Database** (Port 27018): Transaction data, payment methods

### Domain Models

**User Entity:**
- Unique UUID identifier
- Email value object with validation
- Password value object with bcrypt hashing
- Creation timestamp
- Immutable domain model

**Value Objects:**
- `Email`: Format validation, normalization
- `Password`: Strength requirements, secure hashing

## 🔧 Domain-Driven Design Features

### Value Objects
- **Email**: Validates format, normalizes case and whitespace
- **Password**: Enforces security rules, handles hashing/verification

### Aggregate Roots
- **User**: Controls all user-related data and business rules

### Repository Pattern
- Interface-based contracts in domain layer
- MongoDB implementation in infrastructure layer
- Dependency injection with tokens

### Use Cases
Clean application services that orchestrate domain logic:
- Business rule validation
- Domain object coordination
- Error handling and response formatting

## 📋 Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **Input Validation**: Email format, password strength requirements
- **Error Handling**: Secure error messages preventing enumeration
- **Domain Validation**: Business rules enforced at entity level

## 🔄 Development Workflow

1. **Domain First**: Create entities and value objects
2. **Application Layer**: Implement use cases and business workflows
3. **Infrastructure**: Add databases, controllers, external adapters
4. **Integration**: Wire dependencies through modules
5. **Testing**: Validate with unit tests and API collection

```bash
# Complete validation workflow
npm run lint && npm run test && npm run start:dev
```

## 📝 Architecture Principles

- **Dependency Inversion**: Domain independent of infrastructure
- **Single Responsibility**: Each layer has distinct concerns
- **Interface Segregation**: Repository contracts define minimal operations
- **Domain Integrity**: Business rules encapsulated in domain objects
- **Immutability**: Value objects and entities maintain state consistency

## 🚀 Future Enhancements

- **Payments Domain**: Complete payment processing implementation
- **JWT Authentication**: Token-based session management
- **Event Sourcing**: Domain events for audit trails
- **CQRS**: Command Query Responsibility Segregation
- **Email Verification**: Account activation workflows
- **Rate Limiting**: API throttling and protection

---

Built with ❤️ following clean architecture principles and modern TypeScript practices.