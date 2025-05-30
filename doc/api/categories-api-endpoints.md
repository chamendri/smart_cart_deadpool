# Categories API Endpoints Documentation

## Overview
The Categories API provides full CRUD operations for managing product categories in the SmartCart e-commerce platform. These endpoints follow REST conventions and are designed for admin users to manage the category structure.

**Key Feature**: Categories can be created and managed independently of products. You can create empty categories and add products to them later.

## Base URL
```
/api/v1/categories
```

## Authentication
All write operations (POST, PUT, DELETE) require admin authentication. Read operations are publicly accessible.

## Endpoints

### 1. Get All Categories
**GET** `/api/v1/categories`

Retrieves all categories with their associated products.

**Response:**
- **200 OK**: Array of category objects
- **500 Internal Server Error**: Server error

**Example Response:**
```json
[
  {
    "id": 1,
    "name": "Electronics",
    "description": "Electronic devices and accessories",
    "products": [
      {
        "id": 1,
        "name": "Smartphone",
        "description": "Latest smartphone model",
        "price": 599.99,
        "stockLevel": 50,
        "imageUrl": "/images/smartphone.jpg",
        "categoryId": 1,
        "isAvailable": true,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ]
  },
  {
    "id": 2,
    "name": "Books",
    "description": "Books and literature",
    "products": []
  }
]
```

### 2. Get Category by ID
**GET** `/api/v1/categories/{id}`

Retrieves a specific category by its ID with associated products.

**Parameters:**
- `id` (path, integer, required): Category ID

**Response:**
- **200 OK**: Category object
- **404 Not Found**: Category not found
- **500 Internal Server Error**: Server error

**Example Response:**
```json
{
  "id": 2,
  "name": "Books",
  "description": "Books and literature",
  "products": []
}
```

### 3. Create Category
**POST** `/api/v1/categories`

Creates a new category. **Admin only**.

**✅ Important**: Categories can be created without any products. Products can be added to categories later via product management endpoints.

**Request Body:**
```json
{
  "name": "Books",
  "description": "Books and literature"
}
```

**Validation Rules:**
- `name` is required and cannot be empty or whitespace
- `description` is optional and can be empty
- Category name must be unique (case-insensitive)
- **No products are required** - categories are created empty by default

**Response:**
- **201 Created**: Category created successfully
- **400 Bad Request**: Validation errors or duplicate name
- **500 Internal Server Error**: Server error

**Example Response (Empty Category):**
```json
{
  "id": 3,
  "name": "Books",
  "description": "Books and literature",
  "products": []
}
```

**Example Usage - Creating Empty Categories:**

**Request 1 - Category with description:**
```http
POST /api/v1/categories
Content-Type: application/json

{
  "name": "Home & Garden",
  "description": "Home improvement and gardening supplies"
}
```

**Request 2 - Category without description:**
```http
POST /api/v1/categories
Content-Type: application/json

{
  "name": "Sports",
  "description": ""
}
```

**Request 3 - Minimal category:**
```http
POST /api/v1/categories
Content-Type: application/json

{
  "name": "Health & Beauty"
}
```

All these requests will successfully create empty categories that can have products added to them later.

### 4. Update Category
**PUT** `/api/v1/categories/{id}`

Updates an existing category. **Admin only**.

**Parameters:**
- `id` (path, integer, required): Category ID

**Request Body:**
```json
{
  "id": 1,
  "name": "Consumer Electronics",
  "description": "Consumer electronic devices and accessories"
}
```

**Validation Rules:**
- `id` in URL must match `id` in request body
- `name` is required and cannot be empty or whitespace
- Category name must be unique among other categories (case-insensitive)
- Category must exist

**Business Logic:**
- Only updates `name` and `description` fields
- Trims whitespace from input values
- Preserves associated products relationship
- Does not affect product associations
- **Empty categories remain empty** - updating a category does not require products

**Response:**
- **204 No Content**: Category updated successfully
- **400 Bad Request**: Validation errors, ID mismatch, or duplicate name
- **404 Not Found**: Category not found
- **500 Internal Server Error**: Server error

**Error Examples:**
```json
// ID Mismatch
{
  "error": "Category ID in URL does not match the category ID in the request body"
}

// Validation Error
{
  "error": "Category name is required"
}

// Duplicate Name
{
  "error": "A category with this name already exists"
}

// Not Found
{
  "error": "Category with ID 999 not found"
}
```

### 5. Delete Category
**DELETE** `/api/v1/categories/{id}`

Deletes a category. **Admin only**.

**Parameters:**
- `id` (path, integer, required): Category ID

**Business Rules:**
- Cannot delete a category that has associated products
- Must reassign or delete products first
- **Empty categories can be deleted freely**

**Response:**
- **204 No Content**: Category deleted successfully
- **400 Bad Request**: Category has associated products
- **404 Not Found**: Category not found
- **500 Internal Server Error**: Server error

**Error Example:**
```json
{
  "error": "Cannot delete category because it has associated products. Please reassign or delete the products first."
}
```

### 6. Get Category Products
**GET** `/api/v1/categories/{id}/products`

Retrieves all products belonging to a specific category.

**Parameters:**
- `id` (path, integer, required): Category ID

**Response:**
- **200 OK**: Array of product objects (can be empty array for categories without products)
- **404 Not Found**: Category not found
- **500 Internal Server Error**: Server error

**Example Response (Empty Category):**
```json
[]
```

**Example Response (Category with Products):**
```json
[
  {
    "id": 1,
    "name": "Smartphone",
    "description": "Latest smartphone model",
    "price": 599.99,
    "stockLevel": 50,
    "imageUrl": "/images/smartphone.jpg",
    "categoryId": 1,
    "category": null,
    "isAvailable": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

## Update Category - Detailed Specifications

### HTTP Method and URL
```
PUT /api/v1/categories/{id}
```

### Request Headers
```
Content-Type: application/json
Authorization: Bearer {jwt_token} // Admin role required
```

### Request Parameters
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| id | integer | path | Yes | The ID of the category to update |

### Request Body Schema
```json
{
  "id": "integer (required, must match path parameter)",
  "name": "string (required, non-empty, unique)",
  "description": "string (optional, can be empty)"
}
```

### Response Status Codes
| Status Code | Description | Response Body |
|-------------|-------------|---------------|
| 204 | No Content - Update successful | Empty |
| 400 | Bad Request - Validation error | Error message |
| 404 | Not Found - Category doesn't exist | Error message |
| 409 | Conflict - Name already exists | Error message |
| 500 | Internal Server Error | Error message |

### Example Usage

#### Successful Update
**Request:**
```http
PUT /api/v1/categories/1
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "id": 1,
  "name": "Consumer Electronics",
  "description": "Consumer electronic devices and smart gadgets"
}
```

**Response:**
```http
HTTP/1.1 204 No Content
```

#### Validation Error
**Request:**
```http
PUT /api/v1/categories/1
Content-Type: application/json

{
  "id": 1,
  "name": "",
  "description": "Updated description"
}
```

**Response:**
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Category name is required"
}
```

## Error Handling
All endpoints implement comprehensive error handling with:
- Proper HTTP status codes
- Descriptive error messages
- Logging for debugging
- Graceful failure handling

## Notes
- All operations are logged for audit purposes
- Category names are case-insensitive for uniqueness checks
- Input is trimmed to prevent whitespace-only values
- Navigation properties are properly managed to avoid EF tracking issues
- Concurrency conflicts are handled for update operations 