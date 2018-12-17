import jwt, { SignOptions } from 'jsonwebtoken';
import uuid from 'uuid/v4';

const JWT_OPTIONS: SignOptions = { expiresIn: '7d', algorithm: 'HS512', audience: 'pixelwall' };
const JWT_SECRET = 'asdasd';

export async function createToken({ userId }) {
  const jwtid = uuid();
  return await jwt.sign({}, JWT_SECRET, { ...JWT_OPTIONS, subject: userId, jwtid });
}
