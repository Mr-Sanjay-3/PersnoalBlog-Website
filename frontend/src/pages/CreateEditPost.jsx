import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import usePostStore from '../store/usePostStore';
import useAuthStore from '../store/useAuthStore';
import api from '../utils/api';

const CreateEditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm();
  const { createPost, updatePost, fetchPost, post } = usePostStore();
  const isPrivate = watch('isPrivate', false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [uploadingMedia, setUploadingMedia] = useState(false);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isEditMode) {
      const loadPost = async () => {
        try {
          await fetchPost(id);
        } catch (err) {
          setError('Failed to load post');
        }
      };
      loadPost();
    }
  }, [isEditMode, id, fetchPost]);

  useEffect(() => {
    if (isEditMode && post) {
      setValue('title', post.title);
      setValue('content', post.content);
      if (post.isPrivate) {
        setValue('isPrivate', post.isPrivate);
        if (post.hideTitle) {
          setValue('hideTitle', post.hideTitle);
        }
      }
      setMediaUrl(post.mediaUrl || '');
    }
  }, [isEditMode, post, setValue]);

  const handleMediaUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('media', file);

    setUploadingMedia(true);
    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMediaUrl(response.data.url);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload media');
    } finally {
      setUploadingMedia(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    const postData = {
      ...data,
      mediaUrl,
    };

    try {
      let savedPost;
      if (isEditMode) {
        savedPost = await updatePost(id, postData);
      } else {
        savedPost = await createPost(postData);
      }
      navigate(`/post/${savedPost._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <div className="glass-card p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-8">{isEditMode ? 'Edit Post' : 'Create New Post'}</h1>
        
        {error && <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded mb-6">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Media Upload Area */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Cover Media</label>
            <div 
              className={`border-2 border-dashed ${mediaUrl ? 'border-primary-500' : 'border-gray-600'} rounded-xl h-64 flex flex-col items-center justify-center relative overflow-hidden bg-surface-dark/30 transition-colors hover:bg-surface-dark/50 cursor-pointer`}
              onClick={() => !mediaUrl && fileInputRef.current?.click()}
            >
              {mediaUrl ? (
                <>
                  {mediaUrl.endsWith('.mp4') ? (
                    <video src={mediaUrl} className="w-full h-full object-cover" muted loop autoPlay />
                  ) : (
                    <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                  )}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setMediaUrl(''); }}
                    className="absolute top-4 right-4 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </>
              ) : (
                <div className="text-center p-6">
                  {uploadingMedia ? (
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
                  ) : (
                    <>
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-gray-300 text-sm">Click to upload image or video</p>
                    </>
                  )}
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleMediaUpload}
                accept="image/*,video/mp4"
                className="hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              className="w-full bg-surface-dark/50 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors text-lg"
              placeholder="Give your post a catchy title"
            />
            {errors.title && <span className="text-red-400 text-sm mt-1">{errors.title.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
            <textarea
              {...register('content', { required: 'Content is required' })}
              rows="10"
              className="w-full bg-surface-dark/50 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors resize-y leading-relaxed"
              placeholder="What do you want to share..."
            />
            {errors.content && <span className="text-red-400 text-sm mt-1">{errors.content.message}</span>}
          </div>

          <div className="flex flex-col space-y-4 p-4 border border-gray-800 rounded-lg bg-surface-dark/30">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPrivate"
                {...register('isPrivate')}
                className="w-5 h-5 accent-primary-500 cursor-pointer"
              />
              <label htmlFor="isPrivate" className="ml-3 font-medium text-white cursor-pointer select-none">
                Make this post Private 🔒
              </label>
            </div>
            
            {isPrivate && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pl-8 flex flex-col space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Access Code (Required for viewers)</label>
                  <input
                    type="password"
                    {...register('accessCode', { 
                      required: isPrivate ? 'Access code is required for private posts' : false,
                      minLength: { value: 4, message: 'Code must be at least 4 characters' }
                    })}
                    className="w-full max-w-sm bg-black/50 border border-primary-500/50 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500 transition-colors text-primary-400 font-mono tracking-widest"
                    placeholder="Secret Code..."
                  />
                  {errors.accessCode && <span className="text-red-400 text-sm mt-1 block">{errors.accessCode.message}</span>}
                  {isEditMode && <p className="text-xs text-gray-500 mt-2">Leave access code blank to keep the existing encryption key.</p>}
                </div>

                <div className="flex items-center pt-2 border-t border-gray-700/50 max-w-sm">
                  <input
                    type="checkbox"
                    id="hideTitle"
                    {...register('hideTitle')}
                    className="w-4 h-4 accent-primary-500 cursor-pointer"
                  />
                  <label htmlFor="hideTitle" className="ml-3 text-sm font-medium text-gray-300 cursor-pointer select-none">
                    Hide Title from Public (Replaced with "CLASSIFIED DOCUMENT")
                  </label>
                </div>
              </motion.div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingMedia}
              className="px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
              ) : null}
              {isEditMode ? 'Update Post' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CreateEditPost;
