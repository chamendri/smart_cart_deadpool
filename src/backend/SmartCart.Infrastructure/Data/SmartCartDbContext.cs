using Microsoft.EntityFrameworkCore;
using SmartCart.Core.Entities;

namespace SmartCart.Infrastructure.Data;

public class SmartCartDbContext : DbContext
{
    public SmartCartDbContext(DbContextOptions<SmartCartDbContext> options)
        : base(options)
    {
    }

    public DbSet<Product> Products { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<UserProfile> UserProfiles { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Product configuration
        modelBuilder.Entity<Product>()
            .Property(p => p.Price)
            .HasPrecision(10, 2);

        // Category configuration
        modelBuilder.Entity<Category>()
            .HasMany(c => c.Products)
            .WithOne(p => p.Category)
            .HasForeignKey(p => p.CategoryId);

        // User configuration
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // UserProfile configuration
        modelBuilder.Entity<UserProfile>()
            .HasOne(p => p.User)
            .WithOne(u => u.Profile)
            .HasForeignKey<UserProfile>(p => p.UserId);

        // Order configuration
        modelBuilder.Entity<Order>()
            .HasOne(o => o.Customer)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.UserId);

        modelBuilder.Entity<Order>()
            .Property(o => o.SubTotal)
            .HasPrecision(10, 2);

        modelBuilder.Entity<Order>()
            .Property(o => o.DeliveryFee)
            .HasPrecision(10, 2);

        modelBuilder.Entity<Order>()
            .Property(o => o.TotalAmount)
            .HasPrecision(10, 2);

        // OrderItem configuration
        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Order)
            .WithMany(o => o.Items)
            .HasForeignKey(oi => oi.OrderId);

        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Product)
            .WithMany()
            .HasForeignKey(oi => oi.ProductId);

        modelBuilder.Entity<OrderItem>()
            .Property(oi => oi.UnitPrice)
            .HasPrecision(10, 2);

        modelBuilder.Entity<OrderItem>()
            .Property(oi => oi.TotalPrice)
            .HasPrecision(10, 2);

        base.OnModelCreating(modelBuilder);
    }
} 