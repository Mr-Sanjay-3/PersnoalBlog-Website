import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import api from '../utils/api';
import { motion } from 'framer-motion';

const Register = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setCredentials } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/register', {
        username: data.username,
        email: data.email,
        password: data.password
      });
      const { token, ...userData } = response.data;
      setCredentials(userData, token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const password = watch('password');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full mx-auto mt-20 px-4 sm:px-0"
    >
      <div className="glass-card p-6 sm:p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Create an Account</h2>
        
        {error && <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded mb-6">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
            <input
              type="text"
              {...register('username', { required: 'Username is required', minLength: { value: 3, message: 'Username must be at least 3 characters' } })}
              className="w-full bg-surface-dark/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500 transition-colors"
              placeholder="johndoe"
            />
            {errors.username && <span className="text-red-400 text-sm mt-1">{errors.username.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })}
              className="w-full bg-surface-dark/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500 transition-colors"
              placeholder="you@example.com"
            />
            {errors.email && <span className="text-red-400 text-sm mt-1">{errors.email.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
              className="w-full bg-surface-dark/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500 transition-colors"
              placeholder="••••••••"
            />
            {errors.password && <span className="text-red-400 text-sm mt-1">{errors.password.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
            <input
              type="password"
              {...register('confirmPassword', { 
                required: 'Please confirm password',
                validate: value => value === password || 'Passwords do not match'
              })}
              className="w-full bg-surface-dark/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500 transition-colors"
              placeholder="••••••••"
            />
            {errors.confirmPassword && <span className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-500 text-white font-medium py-2 rounded-lg transition-colors mt-6 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 hover:text-primary-300 transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Register;
