# SmartCart Backend

This is the backend API for the SmartCart e-commerce platform, built with .NET 8, Entity Framework Core, and SQLite.

## Project Structure

```
src/backend/
├── SmartCart.API/              # REST API project
│   ├── Controllers/            # API controllers
│   ├── Services/              # API-specific services
│   ├── Middleware/            # Custom middleware
│   ├── Models/                # API models/DTOs
│   └── Properties/            # Project properties
├── SmartCart.Core/            # Core business logic
│   ├── Entities/              # Domain entities
│   ├── Interfaces/            # Core interfaces
│   ├── Services/              # Business services
│   └── DTOs/                  # Data Transfer Objects
├── SmartCart.Infrastructure/  # Data access layer
│   ├── Data/                  # Database context
│   ├── Repositories/          # Repository implementations
│   └── Services/              # Infrastructure services
├── SmartCart.Tests/           # Unit and integration tests
│   ├── Unit/                  # Unit tests
│   └── Integration/           # Integration tests
└── SmartCart.sln             # Solution file
```

## Technologies Used

- **.NET 8**: Latest version of .NET framework
- **Entity Framework Core**: ORM for data access
- **SQLite**: Lightweight database for development
- **Swagger/OpenAPI**: API documentation
- **JWT**: Token-based authentication
- **xUnit**: Testing framework

## Getting Started

### Prerequisites

- .NET 8 SDK
- Visual Studio 2022 or Visual Studio Code

### Setup

1. Navigate to the backend directory:
   ```bash
   cd src/backend
   ```

2. Restore NuGet packages:
   ```bash
   dotnet restore
   ```

3. Build the solution:
   ```bash
   dotnet build
   ```

4. Run the API:
   ```bash
   cd SmartCart.API
   dotnet run
   ```

5. Access Swagger UI at: `https://localhost:5001` or `http://localhost:5000`

## Database

The project uses SQLite with Entity Framework Core Code-First approach. The database file (`smartcart.db`) will be created automatically when you run the application.

### Entity Models

- **Product**: Product information with pricing and stock
- **Category**: Product categorization
- **User**: User accounts with role-based access
- **UserProfile**: Additional user information
- **Order**: Customer orders
- **OrderItem**: Individual items in an order

### Migrations

To create a new migration:
```bash
dotnet ef migrations add InitialCreate -p SmartCart.Infrastructure -s SmartCart.API
```

To update the database:
```bash
dotnet ef database update -p SmartCart.Infrastructure -s SmartCart.API
```

## API Endpoints

The API follows REST conventions:

- `GET /api/v1/products` - List all products
- `GET /api/v1/products/{id}` - Get product details
- `POST /api/v1/products` - Create product (Admin)
- `PUT /api/v1/products/{id}` - Update product (Admin)
- `DELETE /api/v1/products/{id}` - Delete product (Admin)

Similar patterns apply for orders, users, and other resources.

## Authentication

The API uses JWT tokens for authentication. Admin endpoints require authentication with appropriate role claims.

## Testing

Run tests with:
```bash
dotnet test
```

## Configuration

Key configuration settings in `appsettings.json`:
- Database connection string
- JWT settings
- CORS policies
- Logging configuration

## Next Steps

1. Implement remaining controllers (Orders, Users, Categories)
2. Add authentication middleware
3. Implement repository pattern
4. Add service layer for business logic
5. Create DTOs for API responses
6. Add validation
7. Implement unit and integration tests 