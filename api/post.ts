import { PostType } from 'types/post';
import http from './index';

export const getPosts = async (): Promise<PostType[]> => {
    return http.get('post');
};

export const getPost = async (postId: string): Promise<PostType> => {
    return http.get(`post/${postId}`);
};
