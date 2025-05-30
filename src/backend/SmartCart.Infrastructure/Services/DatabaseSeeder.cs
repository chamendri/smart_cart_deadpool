using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SmartCart.Core.Entities;
using SmartCart.Infrastructure.Data;

namespace SmartCart.Infrastructure.Services;

public class DatabaseSeeder
{
    private readonly SmartCartDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly ILogger<DatabaseSeeder> _logger;

    public DatabaseSeeder(SmartCartDbContext context, IConfiguration configuration, ILogger<DatabaseSeeder> logger)
    {
        _context = context;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SeedAsync()
    {
        try
        {
            // Ensure database is created
            await _context.Database.EnsureCreatedAsync();

            // Seed admin user if none exists
            await SeedAdminUserAsync();

            // Seed sample data if needed
            await SeedSampleDataAsync();

            _logger.LogInformation("Database seeding completed successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while seeding the database");
            throw;
        }
    }

    private async Task SeedAdminUserAsync()
    {
        // Check if any admin users exist
        var adminExists = await _context.Users.AnyAsync(u => u.Role == "Admin");

        if (!adminExists)
        {
            _logger.LogInformation("No admin users found. Creating default admin user...");

            // Get admin credentials from configuration or use defaults
            var adminEmail = _configuration["DefaultAdmin:Email"] ?? "admin@smartcart.com";
            var adminPassword = _configuration["DefaultAdmin:Password"] ?? "Admin123!";
            var adminFirstName = _configuration["DefaultAdmin:FirstName"] ?? "System";
            var adminLastName = _configuration["DefaultAdmin:LastName"] ?? "Administrator";

            // Hash the password
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(adminPassword);

            // Create admin user
            var adminUser = new User
            {
                Email = adminEmail.ToLower().Trim(),
                PasswordHash = passwordHash,
                Role = "Admin",
                CreatedAt = DateTime.UtcNow,
                LastLoginAt = DateTime.UtcNow
            };

            _context.Users.Add(adminUser);
            await _context.SaveChangesAsync();

            // Create admin profile
            var adminProfile = new UserProfile
            {
                UserId = adminUser.Id,
                FirstName = adminFirstName,
                LastName = adminLastName,
                PhoneNumber = string.Empty,
                Address = string.Empty,
                City = string.Empty,
                PostalCode = string.Empty,
                Country = string.Empty
            };

            _context.UserProfiles.Add(adminProfile);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Default admin user created successfully");
            _logger.LogInformation("Admin Email: {Email}", adminEmail);
            _logger.LogWarning("Default Password: {Password} - PLEASE CHANGE THIS PASSWORD AFTER FIRST LOGIN!", adminPassword);
        }
        else
        {
            _logger.LogInformation("Admin user(s) already exist. Skipping admin user creation.");
        }
    }

    private async Task SeedSampleDataAsync()
    {
        // Only seed sample data in development environment
        var environment = _configuration["ASPNETCORE_ENVIRONMENT"];
        if (environment != "Development")
        {
            return;
        }

        // Seed sample categories if none exist
        if (!await _context.Categories.AnyAsync())
        {
            _logger.LogInformation("Seeding sample categories...");

            var categories = new List<Category>
            {
                new() { Name = "Electronics", Description = "Electronic devices and accessories" },
                new() { Name = "Books", Description = "Books and educational materials" },
                new() { Name = "Clothing", Description = "Clothing and apparel" },
                new() { Name = "Home & Garden", Description = "Home improvement and gardening supplies" },
                new() { Name = "Sports & Outdoors", Description = "Sports equipment and outdoor gear" }
            };

            _context.Categories.AddRange(categories);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Sample categories seeded successfully");
        }

        // Seed sample products if none exist
        if (!await _context.Products.AnyAsync())
        {
            var electronicsCategory = await _context.Categories.FirstOrDefaultAsync(c => c.Name == "Electronics");
            var booksCategory = await _context.Categories.FirstOrDefaultAsync(c => c.Name == "Books");

            if (electronicsCategory != null || booksCategory != null)
            {
                _logger.LogInformation("Seeding sample products...");

                var products = new List<Product>();

                if (electronicsCategory != null)
                {
                    products.AddRange(new[]
                    {
                        new Product
                        {
                            Name = "Smartphone Pro",
                            Description = "Latest smartphone with advanced features",
                            Price = 999.99m,
                            StockLevel = 50,
                            ImageUrl = "/images/smartphone-pro.jpg",
                            CategoryId = electronicsCategory.Id,
                            IsAvailable = true,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new Product
                        {
                            Name = "Wireless Headphones",
                            Description = "High-quality wireless headphones with noise cancellation",
                            Price = 299.99m,
                            StockLevel = 30,
                            ImageUrl = "/images/wireless-headphones.jpg",
                            CategoryId = electronicsCategory.Id,
                            IsAvailable = true,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        }
                    });
                }

                if (booksCategory != null)
                {
                    products.AddRange(new[]
                    {
                        new Product
                        {
                            Name = "Programming Guide",
                            Description = "Comprehensive guide to modern programming practices",
                            Price = 49.99m,
                            StockLevel = 100,
                            ImageUrl = "/images/programming-guide.jpg",
                            CategoryId = booksCategory.Id,
                            IsAvailable = true,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        }
                    });
                }

                _context.Products.AddRange(products);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Sample products seeded successfully");
            }
        }
    }
} 