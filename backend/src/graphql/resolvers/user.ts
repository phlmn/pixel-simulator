import { createUser, login, getUserById } from '../../services/UserService';
import { createToken } from '../../services/JwtService';

export function mapUser({ _id, username }) {
  return {
    _id: _id.toString(),
    username,
  };
}

export default {
  user: async ({ id }) => {
    return mapUser(await getUserById(id));
  },

  register: async ({ username, password }) => {
    return mapUser(await createUser({ username, password }));
  },

  login: async ({ username, password }) => {
    const user = await login(username, password);
    if (user) {
      return {
        accessToken: createToken({ userId: user._id.toString() }),
        type: 'Bearer'
      };
    }

    return null;
  },
};
