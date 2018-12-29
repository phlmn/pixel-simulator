import fs from 'fs';
import graphQl from 'express-graphql';
import { buildSchema } from 'graphql';

import resolvers from './resolvers';

const graphQlSchema = buildSchema(
  fs.readFileSync(__dirname + '/schema.graphql', { encoding: 'utf-8' })
);

export default graphQl({
  schema: graphQlSchema,
  rootValue: resolvers,
});
