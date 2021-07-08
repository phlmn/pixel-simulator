import ApolloClient from 'apollo-boost';

const GRAPHQL_URI =
  process.env.NODE_ENV === 'production' ? `${window.location}graphql` : 'http://localhost/graphql';
console.log(GRAPHQL_URI);

export const client = new ApolloClient({
  uri: GRAPHQL_URI,
  request: async (operation) => {
    const accessToken = localStorage.getItem('accessToken');
    const headers = {};

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    operation.setContext({
      headers,
    });
  },
});
