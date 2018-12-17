import { ObjectID } from 'bson';
import { compare, hash } from 'bcrypt';

import { db } from '../database';

function collection() {
  return db.collection('users');
}

async function hashPassword(password) {
  return hash(password, 13);
}

export async function login(username: string, password: string) {
  const user = await collection().findOne({ username });
  if (!user || !await compare(password, user.password)) {
    return null;
  }

  return user;
}

export async function createUser({ username, password }) {
  const existingUser = await collection().findOne({ username });
  if (existingUser) {
    throw new Error("Username already in use!");
  }

  const result = await collection().insertOne({
    username,
    password: await hashPassword(password),
  });
  return getUserById(result.insertedId);
}

export async function getUserById(id: string | ObjectID) {
  return await collection().findOne({ _id: new ObjectID(id) });
}
