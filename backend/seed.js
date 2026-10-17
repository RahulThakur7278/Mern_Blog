// ============================================
// FILE: seed.js
// PURPOSE: Database seed script — creates sample data for testing.
// HOW TO RUN: node seed.js (from backend folder)
// WARNING: This will DELETE all existing data and create fresh data.
// ============================================

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Blog = require('./models/Blog');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('MongoDB Connected\n');

  // ============================================
  // STEP 0: Clear existing data
  // ============================================
  console.log('Clearing existing data...');
  await User.deleteMany({});
  await Blog.deleteMany({});
  console.log('Database cleared.\n');

  // ============================================
  // STEP 1: Create Users
  // ============================================
  console.log('Creating users...');
  
  const admin = await User.create({ name: 'Rahul', email: 'rahul7278@gmail.com', password: '123456', role: 'admin' });
  const surya = await User.create({ name: 'Surya', email: 'surya72785@gmail.com', password: '123456', role: 'user' });
  const monika = await User.create({ name: 'Monika', email: 'monika@gmail.com', password: '123456', role: 'user' });
  const ami = await User.create({ name: 'Ami', email: 'ami@gmail.com', password: '123456', role: 'user' });
  
  console.log('4 users created.\n');

  // ============================================
  // STEP 2: Create Sample Blogs
  // ============================================
  console.log('Creating blogs...');

  const blog1 = await Blog.create({
    title: 'Understanding React.js Components and Hooks',
    content: 'React.js is the most popular JavaScript library for building user interfaces. It uses a virtual DOM which makes it extremely fast...',
    author: surya._id,
    status: 'approved'
  });

  const blog2 = await Blog.create({
    title: 'Building REST APIs with Node.js and Express.js',
    content: 'Node.js and Express.js together form the backbone of modern backend development. Here is how to build a REST API...',
    author: monika._id,
    status: 'approved'
  });

  const blog3 = await Blog.create({
    title: 'MongoDB and Mongoose Complete Guide',
    content: 'Every application needs a database to store data. In the MERN stack, we use MongoDB and Mongoose...',
    author: ami._id,
    status: 'approved'
  });

  const blog4 = await Blog.create({
    title: 'JWT Authentication in MERN Stack',
    content: 'Every web application needs a way to identify users. JWT authentication is the industry standard...',
    author: surya._id,
    status: 'rejected'
  });

  const blog5 = await Blog.create({
    title: 'Building a Blog Approval System',
    content: 'In any content platform, quality control is essential. Here is how to build a moderation system...',
    author: monika._id,
    status: 'pending'
  });

  console.log('5 sample blogs created.\n');

  // ============================================
  // STEP 3: Add Sample Comments
  // ============================================
  console.log('Adding comments...');

  // Add comments to blog1 using Mongoose push
  blog1.comments.push(
    { user: monika._id, text: 'Great explanation of React hooks!', createdAt: new Date() },
    { user: admin._id, text: 'Very well written, Surya!', createdAt: new Date() }
  );
  await blog1.save();

  // Add comments to blog2
  blog2.comments.push(
    { user: surya._id, text: 'Awesome API guide, Monika!', createdAt: new Date() }
  );
  await blog2.save();

  console.log('Comments added.\n');

  // ============================================
  // STEP 4: Final Summary
  // ============================================
  console.log('========================================');
  console.log('  SEED COMPLETE!');
  console.log('========================================\n');

  console.log('  Role   | Name    | Email                  | Password');
  console.log('  -------|---------|------------------------|---------');
  console.log('  Admin  | Rahul   | rahul7278@gmail.com    | 123456');
  console.log('  User   | Surya   | surya72785@gmail.com   | 123456');
  console.log('  User   | Monika  | monika@gmail.com       | 123456');
  console.log('  User   | Ami     | ami@gmail.com          | 123456');
  console.log('\nOpen http://localhost:5173 to see the result!');

  mongoose.connection.close();
  process.exit(0);
}).catch(err => {
  console.error('Error:', err.message);
  mongoose.connection.close();
  process.exit(1);
});