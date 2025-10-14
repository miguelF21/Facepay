import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import FacePayLogo from '../assets/FacePay.png';
import '../index.css';

export default function LandingPage() {
  const { loginWithRedirect, logout, isAuthenticated, isLoading, user } = useAuth0();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 sm:w-48 sm:h-48 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-32 h-32 sm:w-48 sm:h-48 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col landing-main-container">
        
        {/* Header */}
        <header className="px-4 sm:px-6 lg:px-8 pt-4 pb-2">
          <div className={`max-w-6xl mx-auto text-center transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="flex justify-center mb-2">
              <img 
                src={FacePayLogo} 
                alt="FacePay Logo" 
                className="logo-tiny w-auto hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h1 className="text-sm sm:text-base font-bold text-gray-900 mb-0">
              Welcome to <span className="text-blue-600">FacePay</span>
            </h1>
            <p className="text-xxs sm:text-xs text-gray-600 mb-0">
              Attendance Control System Based on Facial Recognition
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-6xl mx-auto flex flex-col items-center">

            {/* Feature Cards */}
            <div className={`w-full max-w-5xl transition-all duration-1000 delay-400  ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center items-start">
                
                {/* Card 1 */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-white/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-white/90 text-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xs font-bold text-gray-900 mb-1">Facial Recognition</h3>
                  <p className="text-xxs text-gray-600">
                    Advanced AI-powered face detection and identification technology
                  </p>
                </div>

                {/* Card 2 */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-white/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-white/90 text-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-xs font-bold text-gray-900 mb-1">Secure Access</h3>
                  <p className="text-xxs text-gray-600">
                    Bank-level security protocols and advanced data encryption
                  </p>
                </div>

                {/* Card 3 */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-white/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-white/90 text-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xs font-bold text-gray-900 mb-1">Real-time Tracking</h3>
                  <p className="text-xxs text-gray-600">
                    Instant attendance logging and comprehensive reporting
                  </p>
                </div>
              </div>
            </div>

            {/* Authentication Section */}
            <div className="flex justify-center auth-card">
              {!isLoading && (
                <div className={`w-full max-w-sm transition-all duration-1000 delay-600 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                  {isAuthenticated ? (
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50">
                      <div className="text-center mb-10">
                        <div className="w-14 h-14 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <h2 className="text-sm font-bold text-gray-900 mb-1">
                          Welcome back, {user?.name}!
                        </h2>
                        <p className="text-xs text-gray-600">
                          Ready to access your attendance control panel?
                        </p>
                      </div>
                      <div className="space-y-4">
                        <button
                          onClick={() => navigate("/dashboard")}
                          className="w-full px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                          Access Control Panel
                        </button>
                        <button
                          onClick={() => logout({ returnTo: window.location.origin })}
                          className="w-full px-3 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50 flex flex-col justify-center items-center min-h-[160px] ">
                  <div className="text-center mb-5">
                    <h2 className="text-base font-bold text-gray-900 mb-2">
                      Get Started
                    </h2>
                    <p className="text-xs text-gray-600">
                      Sign in to access your facial recognition attendance system
                    </p>
                  </div>
                  <button
                    onClick={() => loginWithRedirect()}
                    className="w-full px-3 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 "
                  >
                    Sign In to Continue
                  </button>
                  <p className="text-xxs text-gray-500 mt-3 text-center">
                    Secure authentication powered by facial recognition technology
                  </p>
                </div>

                  )}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center space-x-2 text-gray-400">
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
              <span className="text-xxs">Facepay Technology</span>
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
