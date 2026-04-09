import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Edit, Bookmark, Lock, KeyRound } from 'lucide-react';
import usePostStore from '../store/usePostStore';
import useAuthStore from '../store/useAuthStore';

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { post, loading, error, fetchPost, deletePost, toggleSavePost, unlockPost } = usePostStore();
  const { user, setSavedPosts } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [accessCode, setAccessCode] = useState('');
  const [unlockError, setUnlockError] = useState('');
  const [unlocking, setUnlocking] = useState(false);

  useEffect(() => {
    fetchPost(id);
  }, [id, fetchPost]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setIsDeleting(true);
      try {
        await deletePost(id);
        navigate('/');
      } catch (err) {
        setIsDeleting(false);
      }
    }
  };

  if (loading || !post) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div></div>;
  }

  if (error) {
    return <div className="text-center text-red-400 mt-10">{error}</div>;
  }

  const isAuthor = user && post.author._id === user._id;
  const isAdmin = user && user.role === 'admin';
  const isSaved = user?.savedPosts?.includes(post._id);

  const handleSave = async () => {
    if (!user) return alert("Please log in to save posts.");
    try {
      const response = await toggleSavePost(post._id);
      setSavedPosts(response.savedPosts);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnlock = async (e) => {
    e.preventDefault();
    setUnlocking(true);
    setUnlockError('');
    try {
      await unlockPost(post._id, accessCode);
    } catch (err) {
      setUnlockError('Invalid sequence.');
    } finally {
      setUnlocking(false);
    }
  };
  
  const isLocked = post.isPrivate && post.content === 'LOCKED';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="glass-card rounded-2xl overflow-hidden shadow-2xl">
        {!isLocked && post.mediaUrl && (
          <div className="w-full h-64 md:h-96 relative">
             {post.mediaUrl.endsWith('.mp4') ? (
              <video src={post.mediaUrl} className="w-full h-full object-cover" controls autoPlay loop />
             ) : (
              <img src={post.mediaUrl} alt={post.title} className="w-full h-full object-cover" />
             )}
          </div>
        )}
        
        <div className="p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              {post.isPrivate && <Lock size={32} className="inline mr-3 text-primary-500 -mt-2" />}
              {post.title}
            </h1>
            
            <div className="flex items-center space-x-3 flex-shrink-0">
              {user && (
                <button 
                  onClick={handleSave} 
                  className={`p-2 rounded-full transition-colors ${isSaved ? 'text-primary-400 bg-primary-400/10' : 'bg-surface-dark hover:bg-gray-700 text-gray-300'}`}
                  title={isSaved ? "Unsave Post" : "Save Post"}
                >
                  <Bookmark size={20} fill={isSaved ? 'currentColor' : 'none'} />
                </button>
              )}
              {isAuthor && isAdmin && (
                <>
                  <Link to={`/edit/${post._id}`} className="p-2 bg-surface-dark hover:bg-gray-700 rounded-full text-gray-300 transition-colors">
                    <Edit size={20} />
                  </Link>
                  <button 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="p-2 bg-surface-dark hover:bg-red-500/20 text-red-400 rounded-full transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={20} />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-400 mb-8 border-b border-gray-700 pb-4">
            <span className="font-medium text-primary-400 mr-2">{post.author?.username || 'Unknown'}</span>
            <span>• {new Date(post.createdAt).toLocaleDateString()}</span>
          </div>

          {isLocked ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 flex flex-col items-center text-center bg-gray-900/50 rounded-xl border border-gray-800"
            >
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.1)] border border-gray-700">
                <KeyRound size={40} className="text-primary-500" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-widest mb-2 font-mono">RESTRICTED ACCESS</h2>
              <p className="text-gray-400 mb-8 max-w-sm">This document is encrypted. Please provide the decryption key to proceed.</p>
              
              <form onSubmit={handleUnlock} className="flex flex-col items-center w-full max-w-sm">
                <input
                  type="password"
                  value={accessCode}
                  onChange={(e) => {
                    setAccessCode(e.target.value);
                    if (unlockError) setUnlockError('');
                  }}
                  placeholder="Enter Code..."
                  className={`w-full bg-black/80 border rounded-lg px-6 py-4 focus:outline-none transition-colors text-center font-mono tracking-[0.5em] text-xl mb-4 ${
                    unlockError 
                      ? 'border-red-500 focus:border-red-500 text-red-500' 
                      : 'border-gray-700 focus:border-primary-500 text-primary-400'
                  }`}
                />
                {unlockError && <p className="text-red-500 text-sm mb-4 font-mono font-bold animate-pulse">{unlockError}</p>}
                
                <button
                  type="submit"
                  disabled={unlocking || !accessCode}
                  className="w-full bg-primary-600/20 border border-primary-500/50 hover:bg-primary-600/40 text-primary-400 font-bold py-3 rounded-lg transition-colors disabled:opacity-50 tracking-widest uppercase"
                >
                  {unlocking ? 'Decrypting...' : 'Decrypt'}
                </button>
              </form>
            </motion.div>
          ) : (
            <div className="prose prose-invert max-w-none">
              {post.content.split('\n').map((paragraph, index) => (
                <p key={index} className="text-gray-300 mb-4 leading-relaxed whitespace-pre-wrap">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PostDetails;
