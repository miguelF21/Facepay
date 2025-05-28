// Home.jsx
import React from 'react';
import biometric from '../assets/biometric.jpg'; // Asegúrate de que la ruta sea correcta

function Home() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-800 min-h-screen flex items-center justify-center p-6">
      <div className="absolute inset-0 z-0 opacity-20">
        <img src={biometric} alt="Biometric background" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto bg-white bg-opacity-90 rounded-lg p-10 shadow-2xl transform transition duration-500 hover:scale-105">
        <h1 className="text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tighter">
          Payface
        </h1>
        <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Automated attendance and payroll management <br className="hidden sm:inline" />
          through facial recognition
        </p>
        <div className="flex justify-center space-x-4">
          <button className="px-8 py-3 bg-blue-700 text-white font-bold rounded-full text-lg hover:bg-blue-800 transition duration-300 shadow-lg">
            Learn More
          </button>
          <button className="px-8 py-3 bg-gray-200 text-gray-800 font-bold rounded-full text-lg hover:bg-gray-300 transition duration-300 shadow-lg">
            Contact us
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;