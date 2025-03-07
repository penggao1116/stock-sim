const request = require('supertest');
const app = require('../app'); // Import the raw Express app
const pool = require('../db');

describe('Transaction Endpoints', () => {
  let token;
  let userId;
  const testEmail = `trans_test_${Date.now()}@example.com`;

  beforeAll(async () => {
    // Create and log in a test user.
    let res = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'transUser',
        email: testEmail,
        password: 'password123',
      });
    userId = res.body.userId;

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

  it('should return an error if buying without symbol or quantity', async () => {
    const res = await request(app)
      .post('/api/transactions/buy')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Symbol and quantity are required');
  });

});
