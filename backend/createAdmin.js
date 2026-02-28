import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Admin credentials
    const adminEmail = 'admin@example.com';
    const adminPassword = 'Admin@123';
    const adminName = 'Admin User';

    // Get the users collection
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Check if admin already exists
    const existingAdmin = await usersCollection.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('✗ Admin user already exists with this email');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // Create admin user
    const adminUser = {
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'Admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert into database
    const result = await usersCollection.insertOne(adminUser);
    console.log('✓ Admin user created successfully!');
    console.log('\nAdmin Credentials:');
    console.log('─────────────────');
    console.log(`Email:    ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('─────────────────');

    await mongoose.connection.close();
    console.log('\n✓ Database connection closed');
  } catch (error) {
    console.error('✗ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
