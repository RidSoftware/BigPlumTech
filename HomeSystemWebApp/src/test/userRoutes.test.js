const request = require('supertest');  // Supertest to make HTTP requests
const express = require('express');
const userRoutes = require('../routes/userRoutes');  // Import your actual route
const mockDB = require('../mock/mockDBConnection'); // Import your mock DB
const bcrypt = require('bcryptjs');

// Create a test Express app and use the route
const app = express();
app.use(express.json());  // Middleware for parsing JSON
app.use(userRoutes);

// Mock bcrypt.hash and bcrypt.compare
jest.mock('bcryptjs', () => ({
    hash: jest.fn(() => Promise.resolve('$2b$10$hashedpassword')), // Mocked bcrypt hash
    compare: jest.fn((password, hash) => Promise.resolve(password === 'correctpassword')) // Mocked bcrypt compare
}));

// Mock the DBConnection module so that it's replaced with the mock in the test environment
jest.mock('../config/DBConnection', () => mockDB);

describe('User Routes Tests', () => {
    /**  TEST 1: User Registration */
    test('POST /api/register - Successful registration', async () => {
        jest.setTimeout(10000); // Increase timeout for this test

        const response = await request(app)
            .post('/api/register')
            .send({
                firstname: 'John',
                lastname: 'Doe',
                email: 'johndoe@example.com',
                password: 'securepassword',
                userType: 'homeUser'
            });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('user registration successful');
    });

    /**  TEST 2: User Login - Success */
    test('POST /api/login - Successful login', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({
                email: 'johndoe@example.com',
                password: 'correctpassword'
            });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Login successful!');
        expect(response.body.user).toHaveProperty('userID');
    });

    /**  TEST 3: User Login - Incorrect password */
    test('POST /api/login - Incorrect password', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({
                email: 'johndoe@example.com',
                password: 'wrongpassword'
            });

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Incorrect password');
    });

    /**  TEST 4: Fetch All Users */
    test('GET /users - Retrieve all users', async () => {
        const response = await request(app).get('/users');

        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty('UserID');
    });
});
