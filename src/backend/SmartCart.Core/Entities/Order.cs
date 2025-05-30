namespace SmartCart.Core.Entities;

public class Order
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User Customer { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Processing, Completed, Cancelled
    public decimal SubTotal { get; set; }
    public decimal DeliveryFee { get; set; }
    public decimal TotalAmount { get; set; }
    public string DeliveryAddress { get; set; } = string.Empty;
    public string DeliveryCity { get; set; } = string.Empty;
    public string DeliveryPostalCode { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = string.Empty;
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
} 