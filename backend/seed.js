import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';
import Supplier from './models/Supplier.js';
import Product from './models/Product.js';
import StockTransaction from './models/StockTransaction.js';
import User from './models/User.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Get an existing admin/user for stock transactions
    const user = await User.findOne({ role: 'Admin' });
    if (!user) {
      console.log('✗ No admin user found. Please create an admin first using: node createAdmin.js');
      process.exit(1);
    }
    console.log(`✓ Using user: ${user.name} (${user.email})`);

    // Clear existing data (except users)
    await Category.deleteMany({});
    await Supplier.deleteMany({});
    await Product.deleteMany({});
    await StockTransaction.deleteMany({});
    console.log('✓ Cleared existing categories, suppliers, products, and stock transactions');

    // --- CATEGORIES ---
    const categories = await Category.insertMany([
      { name: 'Electronics', description: 'Electronic devices, gadgets, and components' },
      { name: 'Furniture', description: 'Office and home furniture items' },
      { name: 'Clothing', description: 'Apparel and fashion accessories' },
      { name: 'Food & Beverages', description: 'Consumable food items and drinks' },
      { name: 'Office Supplies', description: 'Stationery, paper, and office essentials' },
      { name: 'Sports Equipment', description: 'Fitness and sports gear' },
      { name: 'Tools & Hardware', description: 'Construction and repair tools' },
      { name: 'Health & Beauty', description: 'Personal care and wellness products' },
    ]);
    console.log(`✓ Seeded ${categories.length} categories`);

    // --- SUPPLIERS ---
    const suppliers = await Supplier.insertMany([
      {
        name: 'TechVision Electronics',
        email: 'sales@techvision.com',
        phone: '+1-555-0101',
        image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop',
        address: { street: '123 Tech Blvd', city: 'San Francisco', state: 'CA', zipCode: '94105', country: 'USA' },
      },
      {
        name: 'FurniCraft Industries',
        email: 'orders@furnicraft.com',
        phone: '+1-555-0202',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
        address: { street: '456 Oak Avenue', city: 'Portland', state: 'OR', zipCode: '97201', country: 'USA' },
      },
      {
        name: 'StyleWear Co.',
        email: 'supply@stylewear.com',
        phone: '+1-555-0303',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
        address: { street: '789 Fashion St', city: 'New York', state: 'NY', zipCode: '10001', country: 'USA' },
      },
      {
        name: 'FreshGoods Ltd.',
        email: 'wholesale@freshgoods.com',
        phone: '+1-555-0404',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
        address: { street: '321 Market Rd', city: 'Chicago', state: 'IL', zipCode: '60601', country: 'USA' },
      },
      {
        name: 'ProTools Supply',
        email: 'info@protools.com',
        phone: '+1-555-0505',
        image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400&h=300&fit=crop',
        address: { street: '654 Industrial Way', city: 'Detroit', state: 'MI', zipCode: '48201', country: 'USA' },
      },
      {
        name: 'WellnessPrime',
        email: 'orders@wellnessprime.com',
        phone: '+1-555-0606',
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop',
        address: { street: '987 Health Ave', city: 'Austin', state: 'TX', zipCode: '73301', country: 'USA' },
      },
    ]);
    console.log(`✓ Seeded ${suppliers.length} suppliers`);

    // --- PRODUCTS ---
    const catMap = {};
    categories.forEach(c => { catMap[c.name] = c._id; });
    const supMap = {};
    suppliers.forEach(s => { supMap[s.name] = s._id; });

    const products = await Product.insertMany([
      // Electronics
      { name: 'Wireless Keyboard', description: 'Bluetooth mechanical keyboard with RGB', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop', category: catMap['Electronics'], supplier: supMap['TechVision Electronics'], price: 79.99, costPrice: 45.00, quantity: 150, minStockLevel: 20, unit: 'piece' },
      { name: 'USB-C Hub 7-in-1', description: 'Multi-port adapter with HDMI, USB-A, SD card', image: 'https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=400&h=300&fit=crop', category: catMap['Electronics'], supplier: supMap['TechVision Electronics'], price: 49.99, costPrice: 22.00, quantity: 200, minStockLevel: 30, unit: 'piece' },
      { name: '27" Monitor 4K', description: 'Ultra HD IPS display with HDR support', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop', category: catMap['Electronics'], supplier: supMap['TechVision Electronics'], price: 349.99, costPrice: 210.00, quantity: 45, minStockLevel: 10, unit: 'piece' },
      { name: 'Noise Cancelling Headphones', description: 'Over-ear wireless headphones with ANC', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop', category: catMap['Electronics'], supplier: supMap['TechVision Electronics'], price: 199.99, costPrice: 110.00, quantity: 8, minStockLevel: 15, unit: 'piece' },
      { name: 'Webcam HD 1080p', description: 'Streaming webcam with built-in microphone', image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop', category: catMap['Electronics'], supplier: supMap['TechVision Electronics'], price: 59.99, costPrice: 28.00, quantity: 120, minStockLevel: 25, unit: 'piece' },

      // Furniture
      { name: 'Ergonomic Office Chair', description: 'Adjustable lumbar support mesh chair', image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=300&fit=crop', category: catMap['Furniture'], supplier: supMap['FurniCraft Industries'], price: 299.99, costPrice: 160.00, quantity: 35, minStockLevel: 10, unit: 'piece' },
      { name: 'Standing Desk 60"', description: 'Electric height-adjustable desk', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop', category: catMap['Furniture'], supplier: supMap['FurniCraft Industries'], price: 449.99, costPrice: 250.00, quantity: 20, minStockLevel: 5, unit: 'piece' },
      { name: 'Bookshelf 5-Tier', description: 'Industrial style wooden bookshelf', image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400&h=300&fit=crop', category: catMap['Furniture'], supplier: supMap['FurniCraft Industries'], price: 129.99, costPrice: 65.00, quantity: 3, minStockLevel: 8, unit: 'piece' },

      // Clothing
      { name: 'Cotton T-Shirt Pack (3)', description: 'Premium cotton crew neck T-shirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop', category: catMap['Clothing'], supplier: supMap['StyleWear Co.'], price: 34.99, costPrice: 12.00, quantity: 500, minStockLevel: 50, unit: 'piece' },
      { name: 'Denim Jacket', description: 'Classic fit denim jacket', image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=300&fit=crop', category: catMap['Clothing'], supplier: supMap['StyleWear Co.'], price: 89.99, costPrice: 40.00, quantity: 75, minStockLevel: 15, unit: 'piece' },
      { name: 'Running Shoes', description: 'Lightweight mesh running shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop', category: catMap['Clothing'], supplier: supMap['StyleWear Co.'], price: 119.99, costPrice: 55.00, quantity: 5, minStockLevel: 20, unit: 'piece' },

      // Food & Beverages
      { name: 'Organic Coffee Beans 1kg', description: 'Single origin Arabica coffee beans', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop', category: catMap['Food & Beverages'], supplier: supMap['FreshGoods Ltd.'], price: 24.99, costPrice: 14.00, quantity: 300, minStockLevel: 50, unit: 'kg' },
      { name: 'Green Tea Box (100 bags)', description: 'Premium Japanese green tea', image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=400&h=300&fit=crop', category: catMap['Food & Beverages'], supplier: supMap['FreshGoods Ltd.'], price: 18.99, costPrice: 8.00, quantity: 200, minStockLevel: 30, unit: 'box' },
      { name: 'Protein Bars (12-pack)', description: 'High-protein snack bars, mixed flavors', image: 'https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=400&h=300&fit=crop', category: catMap['Food & Beverages'], supplier: supMap['FreshGoods Ltd.'], price: 29.99, costPrice: 15.00, quantity: 4, minStockLevel: 25, unit: 'box' },

      // Office Supplies
      { name: 'A4 Paper Ream (500 sheets)', description: '80gsm white multipurpose paper', image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&h=300&fit=crop', category: catMap['Office Supplies'], supplier: supMap['ProTools Supply'], price: 9.99, costPrice: 4.00, quantity: 800, minStockLevel: 100, unit: 'piece' },
      { name: 'Ballpoint Pen Set (12)', description: 'Blue ink retractable pens', image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&h=300&fit=crop', category: catMap['Office Supplies'], supplier: supMap['ProTools Supply'], price: 7.99, costPrice: 2.50, quantity: 400, minStockLevel: 50, unit: 'box' },
      { name: 'Whiteboard Markers (8)', description: 'Assorted colors dry-erase markers', image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&h=300&fit=crop', category: catMap['Office Supplies'], supplier: supMap['ProTools Supply'], price: 12.99, costPrice: 5.00, quantity: 15, minStockLevel: 30, unit: 'box' },

      // Sports Equipment
      { name: 'Yoga Mat Premium', description: 'Non-slip 6mm thick exercise mat', image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=300&fit=crop', category: catMap['Sports Equipment'], supplier: supMap['StyleWear Co.'], price: 39.99, costPrice: 18.00, quantity: 90, minStockLevel: 15, unit: 'piece' },
      { name: 'Resistance Bands Set', description: '5-level resistance training bands', image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&h=300&fit=crop', category: catMap['Sports Equipment'], supplier: supMap['StyleWear Co.'], price: 24.99, costPrice: 9.00, quantity: 60, minStockLevel: 10, unit: 'piece' },

      // Tools & Hardware
      { name: 'Cordless Drill 20V', description: 'Lithium-ion battery powered drill', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop', category: catMap['Tools & Hardware'], supplier: supMap['ProTools Supply'], price: 89.99, costPrice: 48.00, quantity: 40, minStockLevel: 10, unit: 'piece' },
      { name: 'Screwdriver Set (32pc)', description: 'Magnetic precision screwdriver kit', image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=400&h=300&fit=crop', category: catMap['Tools & Hardware'], supplier: supMap['ProTools Supply'], price: 34.99, costPrice: 14.00, quantity: 2, minStockLevel: 15, unit: 'piece' },

      // Health & Beauty
      { name: 'Vitamin C Serum', description: '30ml anti-aging facial serum', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=300&fit=crop', category: catMap['Health & Beauty'], supplier: supMap['WellnessPrime'], price: 29.99, costPrice: 10.00, quantity: 150, minStockLevel: 20, unit: 'piece' },
      { name: 'Hand Sanitizer 500ml', description: '70% alcohol antibacterial gel', image: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=400&h=300&fit=crop', category: catMap['Health & Beauty'], supplier: supMap['WellnessPrime'], price: 8.99, costPrice: 3.00, quantity: 350, minStockLevel: 50, unit: 'piece' },
      { name: 'First Aid Kit', description: '100-piece emergency medical kit', image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&h=300&fit=crop', category: catMap['Health & Beauty'], supplier: supMap['WellnessPrime'], price: 44.99, costPrice: 20.00, quantity: 7, minStockLevel: 10, unit: 'piece' },
    ]);
    console.log(`✓ Seeded ${products.length} products`);

    // --- STOCK TRANSACTIONS ---
    const transactions = [];
    const types = ['in', 'out'];
    const reasons = {
      in: ['Supplier delivery', 'Return from customer', 'Inventory recount adjustment', 'New shipment received'],
      out: ['Customer order', 'Damaged item removed', 'Internal use', 'Sample sent to client'],
    };

    for (const product of products) {
      const numTransactions = Math.floor(Math.random() * 4) + 2; // 2-5 transactions per product
      let currentQty = product.quantity;

      for (let i = 0; i < numTransactions; i++) {
        const type = types[Math.floor(Math.random() * 2)];
        const qty = Math.floor(Math.random() * 20) + 1;
        const reasonList = reasons[type];
        const reason = reasonList[Math.floor(Math.random() * reasonList.length)];

        const prevQty = currentQty;
        const newQty = type === 'in' ? currentQty + qty : Math.max(0, currentQty - qty);
        currentQty = newQty;

        // Random date in the last 30 days
        const daysAgo = Math.floor(Math.random() * 30);
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);

        transactions.push({
          product: product._id,
          type,
          quantity: qty,
          previousQuantity: prevQty,
          newQuantity: newQty,
          reason,
          performedBy: user._id,
          createdAt: date,
          updatedAt: date,
        });
      }
    }

    await StockTransaction.insertMany(transactions);
    console.log(`✓ Seeded ${transactions.length} stock transactions`);

    console.log('\n🎉 Database seeded successfully!');
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Suppliers: ${suppliers.length}`);
    console.log(`   Products: ${products.length}`);
    console.log(`   Stock Transactions: ${transactions.length}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('✗ Seeding failed:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
