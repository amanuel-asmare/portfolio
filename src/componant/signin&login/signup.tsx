import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaKey } from 'react-icons/fa';
import axios from 'axios';

interface Errors {
  name?: string;
  email?: string;
  password?: string;
}

interface SignInProps {
  switchToLogin: () => void;
}

const SignIn: React.FC<SignInProps> = ({ switchToLogin }) => {
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [errors, setErrors] = useState<Errors>({});
  const [apiError, setApiError] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email';
    }
    if (!password.trim()) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    if (validateForm()) {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/signin`, { name, email, password }); // Fixed API route
        setName('');
        setEmail('');
        setPassword('');
        setErrors({});
        alert('Sign up successful! Please log in.');
        switchToLogin();
      } catch (error: any) {
        console.error('Sign up error:', error.response || error); // Added error logging
        setApiError(error.response?.data?.message || 'Failed to sign up');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        {apiError && <p className="text-red-500 text-center mb-4">{apiError}</p>}
        <form onSubmit={addUser} className="space-y-6">
          <div className="flex items-center space-x-3">
            <FaUser className="text-gray-600" />
            <div className="flex-1">
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <FaEnvelope className="text-gray-600" />
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <FaKey className="text-gray-600" />
            <div className="flex-1">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : ''}`}
              />
              {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
          <p className="text-center text-sm">
            Already have an account?{' '}
            <button 
              type="button" 
              onClick={switchToLogin} 
              className="text-blue-500 hover:underline"
            >
              Log In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;