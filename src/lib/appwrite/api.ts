import { INewUser } from '@/types';
import { ID, Query } from 'appwrite';
import { account, appwriteConfig, avatars, databases } from './config';

export const createUserAccount = async (user: INewUser) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error: any) {
    throw new Error(`Could not create new account: ${error.message}`);
  }
};

const saveUserToDB = async (user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
}) => {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );
    return newUser;
  } catch (error: any) {
    throw new Error(`Could not save the user to db: ${error.message}`);
  }
};

export const signInAccount = async (user: {
  email: string;
  password: string;
}) => {
  try {
    return await account.createEmailSession(user.email, user.password);
  } catch (error: any) {
    throw new Error(`Could not sign in user: ${error.message}`);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    );
    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error: any) {
    throw new Error(`Could not get current user: ${error.message}`);
  }
};

export const signOutAccount = async () => {
  try {
    return await account.deleteSession('current');
  } catch (error: any) {
    throw new Error(`Could not sing out: ${error.message}`);
  }
};