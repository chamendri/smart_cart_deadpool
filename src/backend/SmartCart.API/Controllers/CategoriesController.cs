using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartCart.Core.Entities;
using SmartCart.Infrastructure.Data;

namespace SmartCart.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly SmartCartDbContext _context;
    private readonly ILogger<CategoriesController> _logger;

    public CategoriesController(SmartCartDbContext context, ILogger<CategoriesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/v1/categories
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<object>>> GetCategories()
    {
        try
        {
            var categories = await _context.Categories
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Description,
                    ProductCount = c.Products.Count()
                })
                .ToListAsync();
            
            return Ok(categories);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving categories");
            return StatusCode(500, "An error occurred while retrieving categories");
        }
    }

    // GET: api/v1/categories/5
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<object>> GetCategory(int id)
    {
        try
        {
            var category = await _context.Categories
                .Where(c => c.Id == id)
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Description,
                    Products = c.Products.Select(p => new
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
                        p.UpdatedAt
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (category == null)
            {
                return NotFound($"Category with ID {id} not found");
            }

            return Ok(category);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving category {CategoryId}", id);
            return StatusCode(500, "An error occurred while retrieving the category");
        }
    }

    // POST: api/v1/categories (Admin only)
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<object>> CreateCategory(Category category)
    {
        try
        {
            // Validate required fields
            if (string.IsNullOrWhiteSpace(category.Name))
            {
                return BadRequest("Category name is required");
            }

            // Check if category with same name already exists
            var existingCategory = await _context.Categories
                .FirstOrDefaultAsync(c => c.Name.ToLower() == category.Name.ToLower());
            
            if (existingCategory != null)
            {
                return BadRequest("A category with this name already exists");
            }

            // Create clean category entity
            var newCategory = new Category
            {
                Name = category.Name.Trim(),
                Description = category.Description?.Trim() ?? string.Empty
            };
            
            _context.Categories.Add(newCategory);
            await _context.SaveChangesAsync();

            // Return clean response without circular references
            var response = new
            {
                newCategory.Id,
                newCategory.Name,
                newCategory.Description,
                Products = new List<object>()
            };

            return CreatedAtAction(nameof(GetCategory), new { id = newCategory.Id }, response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating category");
            return StatusCode(500, "An error occurred while creating the category");
        }
    }

    // PUT: api/v1/categories/5 (Admin only)
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateCategory(int id, Category category)
    {
        if (id != category.Id)
        {
            return BadRequest("Category ID in URL does not match the category ID in the request body");
        }

        try
        {
            // Validate required fields
            if (string.IsNullOrWhiteSpace(category.Name))
            {
                return BadRequest("Category name is required");
            }

            // Check if category exists
            var existingCategory = await _context.Categories.FindAsync(id);
            if (existingCategory == null)
            {
                return NotFound($"Category with ID {id} not found");
            }

            // Check if another category with the same name already exists
            var duplicateCategory = await _context.Categories
                .FirstOrDefaultAsync(c => c.Name.ToLower() == category.Name.ToLower() && c.Id != id);
            
            if (duplicateCategory != null)
            {
                return BadRequest("A category with this name already exists");
            }

            // Update only the fields that should be updated
            existingCategory.Name = category.Name.Trim();
            existingCategory.Description = category.Description?.Trim() ?? string.Empty;

            await _context.SaveChangesAsync();
            
            return NoContent();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await CategoryExists(id))
            {
                return NotFound($"Category with ID {id} not found");
            }
            else
            {
                throw;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating category {CategoryId}", id);
            return StatusCode(500, "An error occurred while updating the category");
        }
    }

    // DELETE: api/v1/categories/5 (Admin only)
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        try
        {
            var category = await _context.Categories
                .Include(c => c.Products)
                .FirstOrDefaultAsync(c => c.Id == id);
            
            if (category == null)
            {
                return NotFound($"Category with ID {id} not found");
            }

            // Check if category has associated products
            if (category.Products.Any())
            {
                return BadRequest("Cannot delete category because it has associated products. Please reassign or delete the products first.");
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting category {CategoryId}", id);
            return StatusCode(500, "An error occurred while deleting the category");
        }
    }

    // GET: api/v1/categories/5/products
    [HttpGet("{id}/products")]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<object>>> GetCategoryProducts(int id)
    {
        try
        {
            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == id);
            if (!categoryExists)
            {
                return NotFound($"Category with ID {id} not found");
            }

            var products = await _context.Products
                .Where(p => p.CategoryId == id)
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
                    p.UpdatedAt
                })
                .ToListAsync();

            return Ok(products);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving products for category {CategoryId}", id);
            return StatusCode(500, "An error occurred while retrieving category products");
        }
    }

    private async Task<bool> CategoryExists(int id)
    {
        return await _context.Categories.AnyAsync(e => e.Id == id);
    }
} 