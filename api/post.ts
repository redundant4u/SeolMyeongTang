import { Post, Posts } from 'types/post';
import http from './index';

export const getPosts = async (): Promise<Posts> => {
    return http.get('post');
};

export const getPost = async (postId: string): Promise<Post> => {
    return http.get(`post/${postId}`);
};
