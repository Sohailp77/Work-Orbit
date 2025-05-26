// src/pages/Landing.tsx
import { Link } from 'react-router-dom';
import landingif from '../assets/Team.gif';

export function Landing() {
  return (
    <div className="min-h-screen bg-white text-white flex items-center justify-center px-6">
      <div className="max-w-2xl text-center space-y-6">
        <img
          src={landingif} // Make sure the path matches your `public` folder
          alt="Teamwork animation"
          className="w-64 md:w-80 mx-auto"
        />
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-700">
          Welcome to <span className="text-green-400">Work orbit</span>
        </h1>
        <p className="text-sm md:text-xl text-gray-800">
          Empowering teams with <span className="text-green-500">task</span> and <span className="text-green-500">reminder</span> management for seamless productivity.
        </p>


        {/* Optional animated tagline placeholder */}
        <div className="text-base md:text-lg text-gray-400 italic mb-4">
          "Where productivity meets synergy."
        </div>




        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="px-6 py-3 bg-green-600 hover:bg-green-800 text-white rounded-lg font-semibold transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 border border-green-400 hover:bg-green-500 hover:text-white text-green-300 rounded-lg font-semibold transition"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
