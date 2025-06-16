import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUpload, FaGithub, FaEnvelope } from 'react-icons/fa';
import AlterEgo from '../../assets/myAt_aa.jpg';

const Home: React.FC = () => {
  const welcomeText = "Welcome to Amanuel's Portfolio";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <nav
        className="bg-white shadow-md p-4 sticky top-0 z-10 rounded-xl max-w-6xl w-full mx-auto"
        role="navigation"
      >
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Link
              to="/"
              className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg flex items-center text-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Go to Home"
            >
              <FaHome className="mr-2 h-4 w-4" />
              Home
            </Link>
            <Link
              to="/about"
              className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg flex items-center text-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Go to About"
            >
              About
            </Link>
            <Link
              to="/upload"
              className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg flex items-center text-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Go to Upload"
            >
              <FaUpload className="mr-2 h-4 w-4" />
              Upload
            </Link>
            <Link
              to="/contact"
              className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg flex items-center text-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Go to Contact"
            >
              Contact
            </Link>
          </div>
          <div>
            <img
              src={AlterEgo}
              alt="Profile picture of Amanuel"
              className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 hover:scale-105 transition-transform duration-200"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.jpg'; // Fallback image
              }}
            />
          </div>
        </div>
      </nav>
      <main className="flex-1 flex flex-col items-center justify-center py-12">
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text text-center"
          aria-label="Welcome message"
        >
          {welcomeText.split('').map((char, index) => (
            <span
              key={index}
              className="animate-letter-reveal inline-block"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>
      </main>
      <footer className="bg-white shadow-md py-4 rounded-t-lg max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4 text-gray-600 text-sm">
          <p>
            © {new Date().getFullYear()} Amanuel. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a
              href="https://github.com/amanuel-asmare"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors duration-200"
              aria-label="Visit Amanuel's GitHub profile"
            >
              <FaGithub className="h-5 w-5" />
            </a>
            <a
              href="mailto:amanuelasmare18@gmail.com"
              className="hover:text-blue-600 transition-colors duration-200"
              aria-label="Email Amanuel"
            >
              <FaEnvelope className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;