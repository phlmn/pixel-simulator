import { Request } from 'express';

import {
  getGames,
  createGame,
  getGameById,
  deleteGame,
  updateGame,
} from '../../services/GameService';
import { getUserById } from '../../services/UserService';
import { mapUser } from './user';

export function mapGame({ _id, title, code, owner, preview }) {
  return {
    _id: _id.toString(),
    title,
    code,
    preview,
    owner: async () => owner && (await mapUser(await getUserById(owner))),
  };
}

export default {
  games: async () => {
    return (await getGames()).map(mapGame);
  },

  game: async ({ id }) => {
    return mapGame(await getGameById(id));
  },

  createGame: async ({ data }, req: Request) => {
    if (!req.user) {
      throw new Error('Not authorized!');
    }

    return mapGame(
      await createGame({
        title: data.title,
        code: data.code,
        owner: req.user.sub,
        preview: data.preview,
      })
    );
  },

  updateGame: async ({ id, data }, req: Request) => {
    if (!req.user) {
      throw new Error('Not authorized!');
    }

    const game = await getGameById(id);
    if (!game) {
      throw new Error('Game does not exist.');
    }

    if (game.owner !== req.user.sub) {
      throw new Error('Only owners can edit games.');
    }

    return mapGame(
      await updateGame(id, { title: data.title, code: data.code, preview: data.preview })
    );
  },

  deleteGame: async ({ id }, req: Request) => {
    if (!req.user) {
      throw new Error('Not authorized!');
    }

    const game = await getGameById(id);
    if (game.owner !== req.user.sub) {
      throw new Error('Not authorized!');
    }

    await deleteGame(id);
    return true;
  },
};
