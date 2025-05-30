namespace SmartCart.Core.Entities;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "Customer"; // Customer or Admin
    public DateTime CreatedAt { get; set; }
    public DateTime LastLoginAt { get; set; }
    public UserProfile? Profile { get; set; }
    public ICollection<Order> Orders { get; set; } = new List<Order>();
} 