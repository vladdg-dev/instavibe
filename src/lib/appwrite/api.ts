import { INewUser } from '@/types';
import { ID } from 'appwrite';
import { account } from './config';

export const createUserAccount = async (user: INewUser) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );
  } catch (error: any) {
    throw new Error(`Could not create new account: ${error.message}`);
  }
};
