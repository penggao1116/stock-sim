const request = require('supertest');
const app = require('../app'); // Import the raw Express app
const pool = require('../db');

describe('Portfolio Endpoints', () => {
  let token;
  let userId;
  const testEmail = `portfolio_test_${Date.now()}@example.com`;

  beforeAll(async () => {
    // Sign up a new user
    let res = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'portfolioUser',
        email: testEmail,
        password: 'password123',
      });
    userId = res.body.userId;

    // Log in to get token
    res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: 'password123',
      });
    token = res.body.token;
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should fetch the portfolio (initially empty)', async () => {
    const res = await request(app)
      .get('/api/portfolio')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('holdings');
    expect(Array.isArray(res.body.holdings)).toBe(true);
  });
});
