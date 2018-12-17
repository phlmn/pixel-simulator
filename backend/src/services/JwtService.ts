import jwt, { SignOptions } from 'jsonwebtoken';
import uuid from 'uuid/v4';

import { db } from '../database';

const JWT_OPTIONS: SignOptions = { expiresIn: '7d', algorithm: 'HS512', audience: 'pixelwall' };
const JWT_SECRET = 'asdasd';

function collection() {
  return db.collection('jwts');
}

export async function createToken({ userId }) {
  const jwtid = uuid();
  const token = await jwt.sign({}, JWT_SECRET, { ...JWT_OPTIONS, subject: userId, jwtid });
  await collection().insertOne({ user: userId, type: 'access', token: jwt.decode(token) });
  return token;
}
