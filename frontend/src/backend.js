import ApolloClient from "apollo-boost";

export const client = new ApolloClient({
  uri: process.env.NODE_ENV === 'production' ? 'https://px.niemo.de/graphql' : 'http://localhost:8000/graphql',
});
