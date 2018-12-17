import express from 'express';
import expressPlayground from 'graphql-playground-middleware-express';
import expressJwt from 'express-jwt';

import graphql from './graphql';
import { initDatabase } from './services';

const app = express();

const jwtMiddleware = expressJwt({
  credentialsRequired: false,
  secret: 'asdasd',
});

app.use('/graphql', jwtMiddleware, graphql);
app.get('/playground', expressPlayground({ endpoint: '/graphql' }));

initDatabase().then(() => {
  app.listen(8000);
});
