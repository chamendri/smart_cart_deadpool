# SmartCart Database Seeding Documentation

## Overview
The SmartCart application includes an automatic database seeding system that creates essential data when the application starts up. This solves the "chicken-and-egg" problem of needing an admin user to create admin users.

## Features

### ✅ Automatic Admin User Creation
- **Problem Solved**: No more circular dependency - admin users can be created without existing admin users
- **Automatic Detection**: Checks if any admin users exist on startup
- **Safe Execution**: Only creates default admin if no admin users are found
- **Configurable**: Admin credentials can be customized via configuration

### ✅ Sample Data Seeding (Development Only)
- **Sample Categories**: Pre-populated product categories
- **Sample Products**: Example products for testing
- **Environment Aware**: Only seeds sample data in Development environment

## Default Admin User

### Credentials
The system automatically creates a default admin user with these credentials:

```
Email: admin@smartcart.com
Password: Admin123!
Role: Admin
Name: System Administrator
```

### Configuration
You can customize the default admin credentials in `appsettings.json`:

```json
{
  "DefaultAdmin": {
    "Email": "admin@smartcart.com",
    "Password": "Admin123!",
    "FirstName": "System",
    "LastName": "Administrator"
  }
}
```

### Security Considerations
⚠️ **IMPORTANT SECURITY NOTES**:

1. **Change Password Immediately**: After first login, change the default password
2. **Production Environment**: Use environment variables instead of appsettings.json
3. **Unique Credentials**: Use different credentials for each environment
4. **Strong Passwords**: Ensure production passwords meet security requirements

## How It Works

### Database Seeding Process
```
Application Startup -> DatabaseSeeder.SeedAsync() -> {
  1. Ensure database exists
  2. Check for existing admin users
  3. If no admin exists:
     - Create default admin user
     - Hash password with BCrypt
     - Create user profile
     - Log creation details
  4. Seed sample data (Development only)
  5. Complete seeding process
}
```

### Code Implementation
The seeding system consists of:

1. **DatabaseSeeder Service** (`SmartCart.Infrastructure.Services.DatabaseSeeder`)
2. **Service Registration** (Program.cs)
3. **Startup Execution** (Program.cs)
4. **Configuration** (appsettings.json)

## Sample Data (Development Only)

### Categories Created
- Electronics
- Books  
- Clothing
- Home & Garden
- Sports & Outdoors

### Products Created
- Smartphone Pro (Electronics)
- Wireless Headphones (Electronics)
- Programming Guide (Books)

## Usage Guide

### First Time Setup
1. **Start Application**: Run the SmartCart API
2. **Check Logs**: Look for admin creation messages in console
3. **Login**: Use default credentials to login
4. **Verify Access**: Test admin endpoints in Swagger UI
5. **Change Password**: Update admin password immediately

### Login Process
```http
POST /api/v1/users/login
Content-Type: application/json

{
  "email": "admin@smartcart.com",
  "password": "Admin123!"
}
```

**Expected Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresAt": "2024-01-15T13:00:00Z",
  "user": {
    "id": 1,
    "email": "admin@smartcart.com",
    "role": "Admin",
    "profile": {
      "firstName": "System",
      "lastName": "Administrator",
      "fullName": "System Administrator"
    }
  }
}
```

### Testing Admin Access
Use the JWT token to test admin endpoints:

```http
# Create Category (Admin Only)
POST /api/v1/categories
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Test Category",
  "description": "Test category description"
}

# Create Product (Admin Only)
POST /api/v1/products
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Test Product",
  "description": "Test product",
  "price": 99.99,
  "stockLevel": 10,
  "categoryId": 1,
  "isAvailable": true
}
```

## Creating Additional Admin Users

### Method 1: Manual Database Update
1. Register user as customer via API
2. Update role in database:
   ```sql
   UPDATE Users SET Role = 'Admin' WHERE Email = 'newadmin@example.com';
   ```

### Method 2: Future Implementation
The `POST /api/v1/users/admin/create` endpoint is prepared for implementation to allow existing admins to create new admin users.

## Environment Configuration

### Development
```json
{
  "ASPNETCORE_ENVIRONMENT": "Development",
  "DefaultAdmin": {
    "Email": "admin@smartcart.local",
    "Password": "DevAdmin123!"
  }
}
```

### Production
```json
{
  "ASPNETCORE_ENVIRONMENT": "Production",
  "DefaultAdmin": {
    "Email": "admin@yourcompany.com",
    "Password": "StrongProductionPassword123!"
  }
}
```

### Environment Variables (Recommended for Production)
```bash
export DefaultAdmin__Email="admin@yourcompany.com"
export DefaultAdmin__Password="StrongProductionPassword123!"
export DefaultAdmin__FirstName="System"
export DefaultAdmin__LastName="Administrator"
```

## Logging

### Console Output Examples
```
info: SmartCart.Infrastructure.Services.DatabaseSeeder[0]
      No admin users found. Creating default admin user...

info: SmartCart.Infrastructure.Services.DatabaseSeeder[0]
      Default admin user created successfully

info: SmartCart.Infrastructure.Services.DatabaseSeeder[0]
      Admin Email: admin@smartcart.com

warn: SmartCart.Infrastructure.Services.DatabaseSeeder[0]
      Default Password: Admin123! - PLEASE CHANGE THIS PASSWORD AFTER FIRST LOGIN!

info: SmartCart.Infrastructure.Services.DatabaseSeeder[0]
      Database seeding completed successfully
```

## Database Schema Impact

### Tables Affected
- **Users**: Default admin user record
- **UserProfiles**: Default admin profile record  
- **Categories**: Sample categories (Development only)
- **Products**: Sample products (Development only)

### Data Integrity
- **Uniqueness**: Email uniqueness is enforced
- **Relationships**: Foreign keys properly maintained
- **Timestamps**: CreatedAt and UpdatedAt fields properly set

## Troubleshooting

### Common Issues

#### Issue: Admin User Not Created
**Possible Causes**:
- Admin user already exists
- Database connection issues
- Configuration missing

**Solution**:
- Check application logs
- Verify database connectivity
- Ensure appsettings.json is properly configured

#### Issue: Default Password Not Working
**Possible Causes**:
- Password was changed after creation
- Configuration override
- Case sensitivity

**Solution**:
- Check configuration in appsettings.json
- Verify exact credentials (case-sensitive)
- Reset admin password in database if needed

#### Issue: Sample Data Not Created
**Expected Behavior**:
- Sample data only created in Development environment
- Check ASPNETCORE_ENVIRONMENT setting

## Best Practices

### Security
1. **Change Default Credentials**: Never use default credentials in production
2. **Environment Variables**: Use environment variables for production secrets
3. **Strong Passwords**: Use complex passwords for admin accounts
4. **Regular Updates**: Rotate admin passwords regularly

### Operations
1. **Backup Before Changes**: Always backup database before manual changes
2. **Test Environment**: Test seeding in development before production
3. **Monitor Logs**: Check application logs for seeding status
4. **Document Changes**: Keep track of any manual admin user changes

## Future Enhancements

### Planned Features
- [ ] Admin user creation via API endpoint
- [ ] Password change enforcement on first login
- [ ] Admin user management interface
- [ ] Audit logging for admin actions
- [ ] Role hierarchy and permissions
- [ ] Automated admin account expiry

### Configuration Improvements
- [ ] Environment-specific default credentials
- [ ] External credential providers
- [ ] Secret management integration
- [ ] Automated credential rotation

The database seeding system ensures your SmartCart application is ready to use immediately with proper admin access! 🚀 