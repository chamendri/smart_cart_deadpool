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
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
    {
        try
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Where(p => p.IsAvailable)
                .ToListAsync();
            
            return Ok(products);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving products");
            return StatusCode(500, "An error occurred while retrieving products");
        }
    }

    // GET: api/v1/products/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        try
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == id);

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
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        try
        {
            product.CreatedAt = DateTime.UtcNow;
            product.UpdatedAt = DateTime.UtcNow;
            
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating product");
            return StatusCode(500, "An error occurred while creating the product");
        }
    }

    // PUT: api/v1/products/5 (Admin only)
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, Product product)
    {
        if (id != product.Id)
        {
            return BadRequest();
        }

        try
        {
            product.UpdatedAt = DateTime.UtcNow;
            _context.Entry(product).State = EntityState.Modified;
            
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