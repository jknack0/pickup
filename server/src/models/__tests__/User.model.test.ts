import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '@/models/User.js';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
}, 60000); // Increase timeout to 60s for download

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('User Model', () => {
  it('should hash password on save', async () => {
    const user = new User({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      passwordHash: 'plainPassword123',
      dateOfBirth: new Date('2000-01-01'),
    });

    await user.save();
    expect(user.passwordHash).not.toBe('plainPassword123');
    expect(user.passwordHash).toHaveLength(60); // Bcrypt hash length
  });

  it('should compare password correctly', async () => {
    const user = new User({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com',
      passwordHash: 'secret',
      dateOfBirth: new Date('2000-01-01'),
    });
    await user.save();

    const isMatch = await user.comparePassword('secret');
    const isNotMatch = await user.comparePassword('wrong');

    expect(isMatch).toBe(true);
    expect(isNotMatch).toBe(false);
  });
});
