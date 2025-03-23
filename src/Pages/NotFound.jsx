import { FileQuestion, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-gray-100 flex items-center justify-center px-4 overflow-hidden">
      <div className="max-w-lg w-full text-center relative z-10">
        {/* 3D-like Icon with Hover Animation */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-indigo-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <FileQuestion 
            className="h-32 w-32 text-indigo-600 mx-auto transform transition-transform duration-500 hover:scale-110 hover:rotate-6" 
            style={{ filter: "drop-shadow(0 10px 20px rgba(99, 102, 241, 0.4))" }}
          />
        </div>

        {/* 3D Text Effect */}
        <h1 className="text-8xl font-extrabold text-gray-900 mb-6 tracking-tight" 
            style={{ 
              textShadow: "0 4px 12px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1)" 
            }}>
          404
        </h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 transform transition-all duration-300 hover:scale-105">
          Page Not Found
        </h2>

        {/* Enhanced Description */}
        <p className="text-gray-600 mb-10 max-w-md mx-auto leading-relaxed">
          Oops! It looks like the page you’re searching for has vanished into the digital ether—or maybe it’s just hiding behind a cosmic coffee mug.
        </p>

        {/* Buttons with 3D Effects */}
        <div className="space-y-6">
          <div>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-full shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              Go To Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-300 rounded-full opacity-10 animate-blob"></div>
        <div className="absolute bottom-10 -right-10 w-96 h-96 bg-indigo-300 rounded-full opacity-10 animate-blob animation-delay-2000"></div>
      </div>
    </div>
  );
}

export default NotFound;