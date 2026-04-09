import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Upload, User, Lock, Mail, Camera } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import usePostStore from '../store/usePostStore';
import PostCard from '../components/post/PostCard';
import api from '../utils/api';

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const { posts } = usePostStore();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'settings');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const fileInputRef = useRef(null);

  React.useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state?.tab]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
    }
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('media', file);

    setUploadingImage(true);
    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProfileImage(response.data.url);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const submitData = { ...data, profileImage };
      // Remove password if empty
      if (!submitData.password) {
        delete submitData.password;
      }
      
      const response = await api.put('/auth/profile', submitData);
      updateUser(response.data);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const savedPosts = posts.filter(p => user?.savedPosts?.includes(p._id));

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <div className="glass-card rounded-2xl p-6 sticky top-24">
            <div className="flex flex-col items-center mb-6">
              <div 
                className="w-24 h-24 rounded-full bg-surface-dark border-2 border-primary-500 mb-4 relative overflow-hidden group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {/* Profile Image Display */}
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <User size={40} />
                  </div>
                )}
                
                {/* Upload Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  {uploadingImage ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <Camera size={24} />
                  )}
                </div>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

              <h2 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-indigo-400 bg-clip-text text-transparent">
                {user?.username}
              </h2>
              <span className={`text-xs px-2 py-1 rounded-full mt-2 border ${user?.role === 'admin' ? 'bg-primary-900/30 border-primary-500 text-primary-400' : 'bg-gray-800 border-gray-600 text-gray-400'}`}>
                {user?.role?.toUpperCase() || 'VIEWER'}
              </span>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
              >
                Account Settings
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeTab === 'saved' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
              >
                Saved Posts ({user?.savedPosts?.length || 0})
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-8 rounded-2xl shadow-xl"
            >
              <h2 className="text-3xl font-bold mb-6 border-b border-gray-800 pb-4">Account Settings</h2>
              
              {error && <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded mb-6">{error}</div>}
              {success && <div className="bg-green-500/20 border border-green-500 text-green-100 p-3 rounded mb-6">{success}</div>}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center"><User size={16} className="mr-2" />Username</label>
                  <input
                    type="text"
                    {...register('username', { required: 'Username is required' })}
                    className="w-full bg-surface-dark/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center"><Mail size={16} className="mr-2" />Email</label>
                  <input
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    className="w-full bg-surface-dark/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center"><Lock size={16} className="mr-2" />New Password</label>
                  <input
                    type="password"
                    {...register('password')}
                    placeholder="Leave blank to keep current password"
                    className="w-full bg-surface-dark/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading || uploadingImage}
                    className="bg-primary-600 hover:bg-primary-500 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50 flex items-center"
                  >
                    {loading && <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>}
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === 'saved' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-white">Your Saved Posts</h2>
              {savedPosts.length === 0 ? (
                <div className="glass-card p-12 rounded-2xl text-center text-gray-400">
                  You haven't saved any posts yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedPosts.map((post, index) => (
                    <PostCard key={post._id} post={post} index={index} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
