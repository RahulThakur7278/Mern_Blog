// --------------------
// 1. IMPORTS
// --------------------
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../utils/firebase';

// --------------------
// 2. LOGIN COMPONENT
// --------------------
const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  // --------------------
  // HANDLE FORM SUBMIT
  // --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Both email and password are required.');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/api/auth/login', formData);
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --------------------
  // HANDLE GOOGLE SIGN IN
  // --------------------
  const handleGoogleSignIn = async () => {
    setError('');
    try {
      setGoogleLoading(true);
      
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Call the same endpoint as register (it will log them in if they exist)
      const response = await api.post('/api/auth/google-signup', {
        email: result.user.email,
        name: result.user.displayName,
        role: 'user'
      });

      // Save token and redirect
      login(response.data.user, response.data.token);
      navigate('/dashboard');
      
    } catch (err) {
      console.error("Google Sign-In error:", err);
      setError(err.response?.data?.message || "Failed to authenticate with Google");
    } finally {
      setGoogleLoading(false);
    }
  };

  // --------------------
  // JSX RETURN
  // --------------------
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md">

        {/* Card header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight mb-2">
            Welcome back
          </h1>
          <p className="text-slate-500 text-sm">
            Sign in to your account to continue
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">

          {/* Error message */}
          {error && (
            <div className="mb-6 p-3 bg-rose-50 text-rose-600 text-sm rounded-lg border border-rose-200 animate-slide-down">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 transition-all duration-200 min-h-[44px] flex items-center justify-center"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
            
            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or continue with</span>
              </div>
            </div>

            {/* Google Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading || googleLoading}
              className="w-full py-3 px-4 bg-white text-slate-700 font-medium rounded-lg border border-slate-300 hover:bg-slate-50 active:scale-[0.98] transition-all duration-200 min-h-[44px] flex items-center justify-center gap-3"
            >
              {googleLoading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-slate-500" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                <>
                  <FcGoogle size={20} />
                  Sign in with Google
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center mt-6 text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors duration-200">
            Create one
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;