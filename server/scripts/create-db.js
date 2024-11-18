import { connection } from '../db/connection.js';

await connection.schema.dropTableIfExists('user');
await connection.schema.dropTableIfExists('message');

await connection.schema.createTable('user', (table) => {
  table.text('username').notNullable().primary();
  table.text('password').notNullable();
});

await connection.schema.createTable('message', (table) => {
  table.text('id').notNullable().primary();
  table.text('user').notNullable();
  table.text('text').notNullable();
  table.text('createdAt').notNullable();
});

await connection.table('message').insert([
  {
    id: 'abcde0000122',
    user: 'system',
    text: 'Welcome to the GraphQL Leaning chat!',
    createdAt: '2024-11-18T12:10:20.000Z',
  },
]);

await connection.table('user').insert([
  {
    username: 'akash',
    password: 'akash123',
  },
  {
    username: 'ram',
    password: 'ram123',
  },
  {
    username: 'krishna',
    password: 'krishna123',
  },
]);

process.exit();
