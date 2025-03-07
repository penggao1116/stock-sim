const request = require('supertest');
const app = require('../app'); // Import the raw Express app

describe('Auth Endpoints', () => {
  // Generate a unique email to avoid conflicts
  const testEmail = `testuser_${Date.now()}@example.com`;

  it('should sign up a new user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: testEmail,
        password: 'password123',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('userId');
  });

  it('should not sign up with an existing email', async () => {
    // Attempt to sign up with the same email
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser2',
        email: testEmail, // same email as above
        password: 'password123',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message');
  });

  it('should log in the user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: 'password123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
