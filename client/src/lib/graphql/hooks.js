import { useMutation, useQuery } from '@apollo/client';
import { addMessageMutation, messagesQuery } from './queries';

export function useAddMessage() {
  const [mutate] = useMutation(addMessageMutation);

  const addMessage = async (text) => {
    const { data: { message } } = await mutate({
      variables: { text },
      update: (cache, { data }) => { // Updating the cache using updateQuery cache method to updating the cache data. It is mostly used for messaging apis. OR you don't want to call the getQuery API and without reloading the page you can use this updateQuery to modify the cache on page. 
        const newMessage = data.message;
        cache.updateQuery({ query: messagesQuery }, ({ messages }) => {
          return { messages: [...messages, newMessage] }
        })
      }
    });
    return message;
  };

  return { addMessage };
}

export function useMessages() {
  const { data } = useQuery(messagesQuery);
  return {
    messages: data?.messages ?? [],
  };
}
