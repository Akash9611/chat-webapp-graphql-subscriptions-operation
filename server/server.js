import { ApolloServer } from '@apollo/server';
import { expressMiddleware as apolloMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import express from 'express';
import { readFile } from 'node:fs/promises';
import { authMiddleware, decodeToken, handleLogin } from './auth.js';
import { resolvers } from './resolvers.js';

//! import for applying Subscription functionality or Creating WebSocket Server 
import { useServer as useWsServer } from 'graphql-ws/lib/use/ws';
import { createServer as createHttpServer } from 'node:http';
import { WebSocketServer } from 'ws';
import { makeExecutableSchema } from '@graphql-tools/schema';

const PORT = 9000;

const app = express();
app.use(cors(), express.json());

app.post('/login', handleLogin);

function getHttpContext({ req }) {
  if (req.auth) {
    return { user: req.auth.sub };
  }
  return {};
}

// For Authenticating WebSocket Server API calls by subscription by creating new context for authorization
function getWsContext({ connectionParams }) {
  // console.log('[ConnectionParams] Context: ', connectionParams);
  const accessToken = connectionParams?.accessToken;
  if (accessToken) {
    const payload = decodeToken(accessToken)
    // console.log(payload.sub)
    return { user: payload.sub }
  }
  return {}
}
const typeDefs = await readFile('./schema.graphql', 'utf8');

const schema = makeExecutableSchema({ typeDefs, resolvers });

const apolloServer = new ApolloServer({ schema });
await apolloServer.start();
app.use('/graphql', authMiddleware, apolloMiddleware(apolloServer, {
  context: getHttpContext,
}));

//! Creating WebSocket Server
const httpServer = createHttpServer(app);
const wsServer = new WebSocketServer({ server: httpServer, path: '/graphql' })
useWsServer({ schema, context: getWsContext }, wsServer)

httpServer.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});
// app.listen({ port: PORT }, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
// });
