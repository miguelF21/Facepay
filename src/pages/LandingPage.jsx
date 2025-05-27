import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const { loginWithRedirect, logout, isAuthenticated, isLoading, user } = useAuth0();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white px-4">
      <h1 className="text-4xl font-bold mb-2 text-center">Welcome to Facepay</h1>
      <p className="text-lg mb-8 text-center">Facial Recognition Based Attendance Control System</p>

      {!isLoading && (
        <div className="flex flex-col gap-4 items-center">
          {isAuthenticated ? (
            <>
              <div className="bg-blue-100 text-blue-700 px-6 py-3 rounded-full font-semibold">Welcome back, {user.name}!</div>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => logout({ returnTo: window.location.origin })}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => loginWithRedirect()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>
          )}
        </div>
      )}
    </div>
  );
}
