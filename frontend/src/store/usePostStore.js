import { create } from 'zustand';
import api from '../utils/api';

const usePostStore = create((set, get) => ({
  posts: [],
  post: null,
  loading: false,
  error: null,
  
  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/posts');
      set({ posts: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
    }
  },
  
  fetchPost: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/posts/${id}`);
      set({ post: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
    }
  },

  createPost: async (postData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/posts', postData);
      set((state) => ({ posts: [response.data, ...state.posts], loading: false }));
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      throw error;
    }
  },

  updatePost: async (id, postData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/posts/${id}`, postData);
      set((state) => ({
        posts: state.posts.map((p) => (p._id === id ? response.data : p)),
        post: response.data,
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      throw error;
    }
  },

  deletePost: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/posts/${id}`);
      set((state) => ({
        posts: state.posts.filter((p) => p._id !== id),
        post: null,
        loading: false,
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      throw error;
    }
  },

  toggleSavePost: async (id) => {
    try {
      const response = await api.post(`/posts/${id}/save`);
      return response.data;
    } catch (error) {
      console.error('Save failed', error);
      throw error;
    }
  },

  unlockPost: async (id, accessCode) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(`/posts/${id}/unlock`, { accessCode });
      // Update the current post and the post in the generic posts list to unscrubbed
      set((state) => ({ 
        post: response.data, 
        posts: state.posts.map(p => p._id === id ? response.data : p),
        loading: false 
      }));
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Invalid access code', loading: false });
      throw error;
    }
  },
}));

export default usePostStore;
