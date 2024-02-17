import { Client, Account, Databases, Storage, Avatars } from 'appwrite';

export const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
