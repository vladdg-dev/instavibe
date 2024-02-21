import { INewPost, INewUser } from '@/types';
import { ID, Query } from 'appwrite';
import { account, appwriteConfig, avatars, databases, storage } from './config';

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

export const uploadFile = async (file: File) => {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );
    return uploadedFile;
  } catch (error: any) {
    throw new Error(`Could not upload file: ${error.message}`);
  }
};

export const getFilePreview = (fileId: string) => {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      'top',
      100
    );
    return fileUrl;
  } catch (error: any) {
    throw new Error(`Could not get file preview: ${error.message}`);
  }
};

export const deleteFile = async (fileId: string) => {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);
    return { status: 'ok' };
  } catch (error: any) {
    throw new Error(`Could not delete file: ${error.message}`);
  }
};

export const createPost = async (post: INewPost) => {
  try {
    const uploadedFile = await uploadFile(post.file[0]);
    if (!uploadedFile) throw Error;

    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      deleteFile(uploadedFile.$id);
      throw Error;
    }

    const tags = post.tags?.replace(/ /g, '').split(',') || [];

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags,
      }
    );
    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }
    return newPost;
  } catch (error: any) {
    throw new Error(`Could not create post: ${error.message}`);
  }
};
