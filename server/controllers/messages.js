import { connection } from '../db/connection.js';
import { generateId } from '../db/ids.js';

const getMessageTable = () => connection.table('message');

export async function getMessages() {
  return await getMessageTable().select().orderBy('createdAt', 'asc');
}

export async function createMessage(user, text) {
  const message = {
    id: generateId(),
    user,
    text,
    createdAt: new Date().toISOString(),
  };
  await getMessageTable().insert(message);
  return message;
}
