import { PostType } from 'types/post';
import http from './index';

export const getPosts = async (): Promise<PostType[]> => {
    return http.get('post', {
        baseURL: process.env.NEXT_PUBLIC_POST_API_URL,
    });
};

export const getPost = async (postId: string): Promise<PostType> => {
    return http.get(`post/${postId}`, {
        baseURL: process.env.NEXT_PUBLIC_POST_API_URL,
    });
};
