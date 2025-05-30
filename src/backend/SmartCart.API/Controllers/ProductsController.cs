using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartCart.Core.Entities;
using SmartCart.Infrastructure.Data;

namespace SmartCart.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly SmartCartDbContext _context;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(SmartCartDbContext context, ILogger<ProductsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/v1/products
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<object>>> GetProducts()
    {
        try
        {
            var products = await _context.Products
                .Where(p => p.IsAvailable)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.StockLevel,
                    p.ImageUrl,
                    p.CategoryId,
                    p.IsAvailable,
                    p.CreatedAt,
                    p.UpdatedAt,
                    Category = new
                    {
                        p.Category.Id,
                        p.Category.Name,
                        p.Category.Description
                    }
                })
                .ToListAsync();
            
            return Ok(products);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving products");
            return StatusCode(500, "An error occurred while retrieving products");
        }
    }
	
	// **Navigation Features**
	// Endpoint for keyword search functionality
	[HttpGet("search")]
	public IActionResult SearchProducts([FromQuery] string keyword)
	{
    // Example response: Filter products by keyword
    var products = new[]
    {
        new { Id = 1, Name = "Product A", Price = 10.99, ImageUrl = "imageA.jpg" },
        new { Id = 2, Name = "Product B", Price = 15.99, ImageUrl = "imageB.jpg" }
    };
    var filteredProducts = products.Where(p => p.Name.Contains(keyword, StringComparison.OrdinalIgnoreCase));
    return Ok(filteredProducts);
	}


	// Endpoint for filtering options
[HttpGet("filter")]
public IActionResult FilterProducts([FromQuery] string category, [FromQuery] double? minPrice, [FromQuery] double? maxPrice)
{
    // Example response: Filter products by category and price range
    var products = new[]
    {
        new { Id = 1, Name = "Product A", Price = 10.99, Category = "Electronics", ImageUrl = "imageA.jpg" },
        new { Id = 2, Name = "Product B", Price = 15.99, Category = "Books", ImageUrl = "imageB.jpg" }
    };
    var filteredProducts = products.Where(p =>
        (string.IsNullOrEmpty(category) || p.Category.Equals(category, StringComparison.OrdinalIgnoreCase)) &&
        (!minPrice.HasValue || p.Price >= minPrice) &&
        (!maxPrice.HasValue || p.Price <= maxPrice));
    return Ok(filteredProducts);
}

	// Endpoint for sorting capabilities
[HttpGet("sort")]
public IActionResult SortProducts([FromQuery] string sortBy)
{
    // Example response: Sort products by price or category
    var products = new[]
    {
        new { Id = 1, Name = "Product A", Price = 10.99, Category = "Electronics", ImageUrl = "imageA.jpg" },
        new { Id = 2, Name = "Product B", Price = 15.99, Category = "Books", ImageUrl = "imageB.jpg" }
    };
        var sortedProducts = sortBy?.ToLower() switch
        {
            "price" => products.OrderBy(p => p.Price).ToList(),
            "category" => products.OrderBy(p => p.Category).ToList(),
            _ => products.ToList()
        };
        return Ok(sortedProducts);
}


    // GET: api/v1/products/5
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<object>> GetProduct(int id)
    {
        try
        {
            var product = await _context.Products
                .Where(p => p.Id == id)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.StockLevel,
                    p.ImageUrl,
                    p.CategoryId,
                    p.IsAvailable,
                    p.CreatedAt,
                    p.UpdatedAt,
                    Category = new
                    {
                        p.Category.Id,
                        p.Category.Name,
                        p.Category.Description
                    }
                })
                .FirstOrDefaultAsync();

            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving product {ProductId}", id);
            return StatusCode(500, "An error occurred while retrieving the product");
        }
    }

    // POST: api/v1/products (Admin only)
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<object>> CreateProduct(Product product)
    {
        try
        {
            // Validate category exists
            if (product.CategoryId > 0)
            {
                var categoryExists = await _context.Categories.AnyAsync(c => c.Id == product.CategoryId);
                if (!categoryExists)
                {
                    return BadRequest("Invalid category ID");
                }
            }

            // Create clean product entity
            var newProduct = new Product
            {
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                StockLevel = product.StockLevel,
                ImageUrl = product.ImageUrl,
                CategoryId = product.CategoryId,
                IsAvailable = product.IsAvailable,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            
            _context.Products.Add(newProduct);
            await _context.SaveChangesAsync();

            // Return clean response
            var response = await _context.Products
                .Where(p => p.Id == newProduct.Id)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.StockLevel,
                    p.ImageUrl,
                    p.CategoryId,
                    p.IsAvailable,
                    p.CreatedAt,
                    p.UpdatedAt,
                    Category = new
                    {
                        p.Category.Id,
                        p.Category.Name,
                        p.Category.Description
                    }
                })
                .FirstOrDefaultAsync();

            return CreatedAtAction(nameof(GetProduct), new { id = newProduct.Id }, response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating product");
            return StatusCode(500, "An error occurred while creating the product");
        }
    }

    // PUT: api/v1/products/5 (Admin only)
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateProduct(int id, Product product)
    {
        if (id != product.Id)
        {
            return BadRequest();
        }

        try
        {
            // Validate category exists
            if (product.CategoryId > 0)
            {
                var categoryExists = await _context.Categories.AnyAsync(c => c.Id == product.CategoryId);
                if (!categoryExists)
                {
                    return BadRequest("Invalid category ID");
                }
            }

            // Find existing product
            var existingProduct = await _context.Products.FindAsync(id);
            if (existingProduct == null)
            {
                return NotFound();
            }

            // Update fields
            existingProduct.Name = product.Name;
            existingProduct.Description = product.Description;
            existingProduct.Price = product.Price;
            existingProduct.StockLevel = product.StockLevel;
            existingProduct.ImageUrl = product.ImageUrl;
            existingProduct.CategoryId = product.CategoryId;
            existingProduct.IsAvailable = product.IsAvailable;
            existingProduct.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            
            return NoContent();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await ProductExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating product {ProductId}", id);
            return StatusCode(500, "An error occurred while updating the product");
        }
    }

    // DELETE: api/v1/products/5 (Admin only)
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        try
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting product {ProductId}", id);
            return StatusCode(500, "An error occurred while deleting the product");
        }
    }

    private async Task<bool> ProductExists(int id)
    {
        return await _context.Products.AnyAsync(e => e.Id == id);
    }
} 