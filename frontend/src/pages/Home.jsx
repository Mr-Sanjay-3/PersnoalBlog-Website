import React, { useEffect, useState, useMemo } from 'react';
import usePostStore from '../store/usePostStore';
import useAuthStore from '../store/useAuthStore';
import PostCard from '../components/post/PostCard';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';

const Home = () => {
  const { posts, loading, error, fetchPosts } = usePostStore();
  const { user } = useAuthStore();

  const [sortBy, setSortBy] = useState('newest'); // newest, oldest
  const [filterUser, setFilterUser] = useState('all'); // all, mine

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Filter by user
    if (filterUser === 'mine' && user) {
      result = result.filter(p => p.author?._id === user._id);
    }

    // Sort by date
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [posts, sortBy, filterUser, user]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div></div>;
  }

  if (error) {
    return <div className="text-center text-red-400 mt-10">{error}</div>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  return (
    <div className="pb-16 mt-[-32px]">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full py-16 md:py-32 flex flex-col items-center justify-center text-center px-4"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="absolute top-20 w-72 h-72 bg-primary-500/20 rounded-full blur-[100px] -z-10"
        />
        <h1 className="text-4xl md:text-7xl font-extrabold mb-6 tracking-tight px-2">
          Welcome to the <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-primary-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            The Journey Within
          </span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed px-4">
          Step into a space filled with thoughts, experiences, and inspiration. Be part of the journey or begin your own.        </p>
      </motion.div>

      {/* Posts Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-gray-800 pb-4 gap-4">
          <h2 className="text-2xl md:text-3xl font-bold">Latest Reads</h2>

          {/* Filtering & Sorting Controls */}
          <div className="flex items-center space-x-3 text-sm">
            <Filter size={18} className="text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-surface-dark border border-gray-700 text-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-primary-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>

            {user && (
              <select
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="bg-surface-dark border border-gray-700 text-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-primary-500"
              >
                <option value="all">Every Author</option>
                <option value="mine">My Posts</option>
              </select>
            )}
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center text-gray-400 mt-10 glass-card p-12 rounded-2xl">No posts found matching your criteria.</div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
          >
            {filteredPosts.map((post, index) => (
              <PostCard key={post._id} post={post} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;
