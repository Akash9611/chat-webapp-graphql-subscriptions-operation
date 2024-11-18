import { GraphQLError } from 'graphql';
import { createMessage, getMessages } from './controllers/messages.js';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub(); // This package is not suitable for production environment. links—> 1.pubSub Class[https://www.apollographql.com/docs/apollo-server/data/subscriptions#the-pubsub-class], 2.pubsub production library doc[https://www.apollographql.com/docs/apollo-server/data/subscriptions#production-pubsub-libraries]


export const resolvers = {
  Query: {
    messages: (_root, _args, { user }) => {
      if (!user) throw unauthorizedError();
      return getMessages();
    },
  },

  Mutation: {
    addMessage: async (_root, { text }, { user }) => {
      if (!user) throw unauthorizedError();
      const message = await createMessage(user, text);
      pubSub.publish('MESSAGE_ADDED', { messageAdded: message })
      return message;
    },
  },

  Subscription: {
    messageAdded: {
      subscribe: () => pubSub.asyncIterableIterator('MESSAGE_ADDED')
    }
  }
};

function unauthorizedError() {
  return new GraphQLError('Not authenticated', {
    extensions: { code: 'UNAUTHORIZED' },
  });
}
