import { writeFile } from 'fs/promises';
import { generateCategories, generateProducts, generateUsers, generateOrder } from './mockDataGenerators';
import { Product, User, Category, Order } from './models';

async function main() {
  // Generate categories and products
  const categories: Category[] = generateCategories(5);
  const products: Product[] = generateProducts(20, categories);
  const users: User[] = generateUsers(8, 2); // 8 customers, 2 admins

  // Generate orders for each customer
  const orders: Order[] = users
    .filter(u => u.role === 'customer')
    .flatMap(user => [generateOrder(user.id, products)]);

  // Write to JSON files
  await writeFile('smartapp/data/categories.json', JSON.stringify(categories, null, 2));
  await writeFile('smartapp/data/products.json', JSON.stringify(products, null, 2));
  await writeFile('smartapp/data/users.json', JSON.stringify(users, null, 2));
  await writeFile('smartapp/data/orders.json', JSON.stringify(orders, null, 2));

  console.log('Mock data generated and saved to smartapp/data/');
}

main().catch(console.error); 