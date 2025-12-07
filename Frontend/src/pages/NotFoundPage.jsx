import React from 'react';
import { Home, Frown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * A responsive 404 Not Found page component styled with Tailwind CSS.
 * It features a large, visually appealing error code, a friendly message,
 * and a clear call-to-action to return to the home page.
 */
const NotFoundPage = () => {
  // 1. Hook MUST be called inside the function component body
  const navigate = useNavigate();

  const handleGoHome = () => {
    // 2. Use the navigate function to redirect to the home path
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full text-center bg-white shadow-2xl rounded-xl p-8 sm:p-12 transition-all duration-300 transform hover:scale-[1.01]">
        
        {/* Large Error Code */}
        <h1 className="text-9xl font-extrabold text-orange-500 mb-4 tracking-tight">
          404
        </h1>

        {/* Icon and Main Message */}
        <div className="flex justify-center items-center mb-6">
          <Frown className="w-10 h-10 text-gray-500 mr-3" />
          <h2 className="text-3xl font-bold text-gray-800">
            Page Not Found
          </h2>
        </div>

        {/* Detailed Explanation */}
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Oops! It seems the page you were looking for doesn't exist or has been moved. 
          Don't worry, even the best websites misplace a link now and then.
        </p>

        {/* Action Button */}
        <button
          onClick={handleGoHome} // Call the navigation function
          className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-orange-600 hover:bg-orange-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-300 focus:ring-offset-2"
        >
          <Home className="w-5 h-5 mr-2" />
          Go Back Home
        </button>

        {/* Footer/Suggestion Text */}
        <p className="mt-8 text-sm text-gray-400">
          If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;