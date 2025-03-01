import { Client, Account, Databases, ID } from 'appwrite';

export const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') 
    .setProject('67aefd7a003d8acb7445'); 

export const account = new Account(client);
export const databases = new Databases(client);
export { ID };
