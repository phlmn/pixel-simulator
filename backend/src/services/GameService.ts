import { ObjectID } from 'bson';

import { db } from '../database';

function collection() {
  return db.collection('games');
}

export async function createGame({
  title,
  code,
  owner,
  preview,
}: {
  title: string;
  code: string;
  owner?: string;
  preview?: number[][][];
}) {
  const result = await collection().insertOne({
    owner,
    title,
    code,
    preview,
  });
  return getGameById(result.insertedId);
}

export async function getGames() {
  const entries = await collection()
    .find({})
    .toArray();

  return entries;
}

export async function getGameById(id: string | ObjectID) {
  if (!id) {
    throw new Error("Parameter 'id' may not be null.");
  }

  return await collection().findOne({ _id: new ObjectID(id) });
}

export async function updateGame(
  id: string | ObjectID,
  {
    title,
    code,
    preview,
    owner,
  }: { title?: string; code?: string; preview?: number[][][]; owner?: string }
) {
  if (!id) {
    throw new Error("Parameter 'id' may not be null.");
  }

  const $set: any = {};
  if (title) $set.title = title;
  if (code) $set.code = code;
  if (preview) $set.preview = preview;
  if (owner) $set.owner = owner;

  await collection().updateOne({ _id: new ObjectID(id) }, { $set });
  return getGameById(id);
}

export async function deleteGame(id: string | ObjectID) {
  if (!id) {
    throw new Error("Parameter 'id' may not be null.");
  }

  await collection().deleteOne({ _id: new ObjectID(id) });
}
