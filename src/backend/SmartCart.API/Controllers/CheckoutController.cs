using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/[controller]")]
public class CheckoutController : ControllerBase
{
    // **Components**

    // Endpoint to display order summary
    [HttpGet("order-summary")]
    public IActionResult GetOrderSummary()
    {
        // Example response: Order summary details
        var orderSummary = new
        {
            Items = new[]
            {
                new { ProductId = 1, Name = "Product A", Quantity = 2, Price = 10.99 },
                new { ProductId = 2, Name = "Product B", Quantity = 1, Price = 15.99 }
            },
            TotalPrice = 37.97
        };
        return Ok(orderSummary);
    }

    // Endpoint to collect personal information
    [HttpPost("personal-info")]
    public IActionResult CollectPersonalInfo([FromBody] PersonalInfo personalInfo)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest("Invalid personal information.");
        }

        // Example: Save personal information (mocked)
        return Ok("Personal information collected successfully.");
    }

    // Endpoint to handle delivery information form
    [HttpPost("delivery-info")]
    public IActionResult CollectDeliveryInfo([FromBody] DeliveryInfo deliveryInfo)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest("Invalid delivery information.");
        }

        // Example: Save delivery information (mocked)
        return Ok("Delivery information collected successfully.");
    }

    // Endpoint to calculate delivery cost automatically
    [HttpGet("delivery-cost")]
    public IActionResult CalculateDeliveryCost([FromQuery] string deliveryAddress)
    {
        // Example: Mock delivery cost calculation
        var deliveryCost = deliveryAddress.Contains("remote") ? 15.00 : 5.00;
        return Ok(new { DeliveryCost = deliveryCost });
    }

    // Endpoint for order confirmation
    [HttpPost("confirm-order")]
    public IActionResult ConfirmOrder([FromBody] OrderConfirmation orderConfirmation)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest("Invalid order confirmation details.");
        }

        // Example: Mock order confirmation
        return Ok(new { Message = "Order confirmed successfully.", OrderId = 12345 });
    }
}

// Models for request payloads
public class PersonalInfo
{
    public string FullName { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
}

public class DeliveryInfo
{
    public string Address { get; set; }
    public string City { get; set; }
    public string PostalCode { get; set; }
}

public class OrderConfirmation
{
    public int OrderId { get; set; }
    public bool Confirmed { get; set; }
}
