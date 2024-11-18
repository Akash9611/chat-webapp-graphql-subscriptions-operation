import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { addMessageMutation, messageAddedSubscription, messagesQuery } from './queries';

export function useAddMessage() {
  const [mutate] = useMutation(addMessageMutation);

  const addMessage = async (text) => {
    const { data: { message } } = await mutate({
      variables: { text },
      // update: (cache, { data }) => { // Updating the cache using updateQuery cache method to updating the cache data. It is mostly used for messaging apis. OR you don't want to call the getQuery API and without reloading the page you can use this updateQuery to modify the cache on page. 
      //   const newMessage = data.message;
      //   cache.updateQuery({ query: messagesQuery }, ({ messages }) => {
      //     return { messages: [...messages, newMessage] }
      //   })
      // }
    });
    return message;
  };

  return { addMessage };
}

export function useMessages() {
  const { data } = useQuery(messagesQuery);
  //Adding Subscription logic by using useSubscription Hook from apollo-client library
  useSubscription(messageAddedSubscription, {
    onData: ({ client, data }) => {
      // console.log("Messages: ",data)
      // console.log("Messages: ",data.data)
      const newMessage = data.data.message;
      client.cache.updateQuery({ query: messagesQuery }, ({ messages }) => {
        return { messages: [...messages, newMessage] }
      })
    }
  })

  return {
    messages: data?.messages ?? [],
  };
}
