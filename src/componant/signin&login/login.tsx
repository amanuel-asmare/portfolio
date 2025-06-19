import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaKey } from 'react-icons/fa';
import axios from 'axios';

interface Errors {
  name?: string;
  password?: string;
}

interface LoginProps {
  switchToSignIn: () => void;
}

const Login: React.FC<LoginProps> = ({ switchToSignIn }) => {
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<Errors>({});
  const [apiError, setApiError] = useState<string>('');
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!password.trim()) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    if (validateForm()) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/api/login`, { name, password });
        setName('');
        setPassword('');
        setErrors({});
        alert('Login successful!');
        console.log('User logged in:', response.data);
        navigate('/home');
      } catch (error: any) {
        setApiError(error.response?.data?.message || 'Failed to log in');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>
        {apiError && <p className="text-red-500 text-center mb-4">{apiError}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
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
            Log In
          </button>
          <p className="text-center text-sm">
            Don't have an account?{' '}
            <button 
              type="button" 
              onClick={switchToSignIn} 
              className="text-blue-500 hover:underline"
            >
              Sign Up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;