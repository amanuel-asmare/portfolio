import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Amu from '../../assets/amu.jpg';

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white max-w-4xl w-full mx-auto p-4 rounded-xl shadow-md sticky top-0 z-10 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-2 py-1"
          aria-label="Go back to previous page"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <h1 className="text-xl font-semibold text-gray-800">About Me</h1>
        <div className="w-20"></div> {/* Spacer for alignment */}
      </header>
      <section
        className="flex items-center justify-center py-12"
        aria-labelledby="about-heading"
      >
        <div className="grid grid-cols-2 md:grid-cols-2 gap-8 max-w-4xl w-full px-4 sm:px-6 lg:px-8">
          <article className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 sm:p-10 hover:shadow-xl transition-shadow duration-300">
            <h2 id="about-heading" className="text-3xl sm:text-4xl font-bold gradient-text mb-6">
              About Me
            </h2>
            <div className="space-y-4">
              <p
                className="animate-text-fade-in text-gray-800 text-base sm:text-lg md:text-xl font-medium leading-relaxed tracking-tight"
                style={{ animationDelay: '0s' }}
              >
                My name is <span className="font-semibold text-blue-600">Amanuel</span>. I am an undergraduate <span className="font-semibold text-blue-600">Computer Science</span> student at North Wollo Woldia University.
              </p>
              <p
                className="animate-text-fade-in text-gray-800 text-base sm:text-lg md:text-xl font-medium leading-relaxed tracking-tight"
                style={{ animationDelay: '0.2s' }}
              >
                I am a passionate programmer skilled in <span className="font-semibold text-blue-600">JavaScript, HTML, CSS, React, Node.js, and MongoDB</span>. I enjoy building responsive web applications and continuously improving my development skills.
              </p>
              <p
                className="animate-text-fade-in text-gray-800 text-base sm:text-lg md:text-xl font-medium leading-relaxed tracking-tight"
                style={{ animationDelay: '0.4s' }}
              >
                This portfolio showcases some of the projects I have worked on during my academic journey.
              </p>
            </div>
          </article>
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <img
              src={Amu}
              alt="Portrait of Amanuel"
              className="w-full h-100 sm:h-64 md:h-80 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.jpg'; // Fallback image
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;