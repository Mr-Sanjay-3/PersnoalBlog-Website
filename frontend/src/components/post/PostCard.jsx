import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Image as ImageIcon, Bookmark, Lock } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import usePostStore from '../../store/usePostStore';

const PostCard = ({ post, index }) => {
  const { user, setSavedPosts } = useAuthStore();
  const { toggleSavePost } = usePostStore();

  const isSaved = user?.savedPosts?.includes(post._id);

  const handleSave = async (e) => {
    e.preventDefault(); // Prevent navigating to post
    if (!user) return alert("Please log in to save posts.");
    try {
      const response = await toggleSavePost(post._id);
      setSavedPosts(response.savedPosts);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="glass-card rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 transform hover:-translate-y-1"
    >
      <Link to={`/post/${post._id}`} className="block">
        <div className="h-28 sm:h-48 w-full bg-surface-dark relative">
          {post.isPrivate && post.content === 'LOCKED' ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 bg-gray-900/80">
              <Lock size={32} className="text-primary-500 mb-2 opacity-80" />
              <span className="text-[10px] text-primary-500 font-bold uppercase tracking-widest opacity-80">Encrypted</span>
            </div>
          ) : post.mediaUrl ? (
             post.mediaUrl.endsWith('.mp4') ? (
              <video src={post.mediaUrl} className="w-full h-full object-cover" muted loop autoPlay />
             ) : (
              <img src={post.mediaUrl} alt={post.title} className="w-full h-full object-cover" />
             )
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              <ImageIcon size={48} />
            </div>
          )}
        </div>
        <div className="p-3 sm:p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-1 sm:mb-2 gap-2">
            <h3 className="text-sm sm:text-lg font-bold text-white line-clamp-2">
              {post.isPrivate && <Lock size={14} className="inline mr-1.5 text-primary-500 mb-0.5" />}
              {post.title}
            </h3>
            {user && (
              <button 
                onClick={handleSave} 
                className={`flex-shrink-0 p-1 sm:p-1.5 rounded-full transition-colors ${isSaved ? 'text-primary-400 bg-primary-400/10' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
              >
                <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} className="sm:w-5 sm:h-5" />
              </button>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-4 line-clamp-2 sm:line-clamp-3">
            {post.isPrivate && post.content === 'LOCKED' ? (
              <span className="italic text-primary-400/80">This post is encrypted. Click to unlock.</span>
            ) : (
              post.content
            )}
          </p>
          <div className="mt-auto flex items-center justify-between text-[10px] sm:text-sm text-gray-500">
            <span>By {post.author?.username || 'Unknown'}</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PostCard;
