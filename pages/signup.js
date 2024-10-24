import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { AlertCircle, Mail, Lock, UserCheck } from 'lucide-react';

const CustomAlert = ({ children }) => (
  <div className="flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
    <span>{children}</span>
  </div>
);

const CGIImage = () => (
  <div className="w-full h-36 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg overflow-hidden relative">
    <div className="absolute inset-0 flex items-center justify-center gap-2">
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center animate-pulse">
        <UserCheck className="w-12 h-12 text-blue-500" />
      </div>
    </div>
    <div className="absolute  bottom-4 left-4 right-4 text-white text-center text-lg font-semibold">
      Join Our Learning Community
    </div>
  </div>
);

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password || !role) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long and contain at least one uppercase letter and one number.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      if (res.ok) {
        setOtpSent(true);
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'An error occurred during signup');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    try {
      const res = await fetch('/api/auth/verifyOtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      if (res.ok) {
        router.push(role === 'teacher' ? '/teacher-dashboard' : '/dashboard');
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'OTP verification failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const validatePassword = (password) => {
    const passwordCriteria = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordCriteria.test(password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          {otpSent ? 'Verify OTP' : 'Sign Up'}
        </h2>
        <CGIImage />
        {error && <CustomAlert>{error}</CustomAlert>}
        {!otpSent ? (
          <form onSubmit={handleSignup} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium text-gray-700">Role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="otp" className="text-sm font-medium text-gray-700">OTP</label>
              <input
                id="otp"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Verify OTP
            </button>
          </form>
        )}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account? <a href="/login" className="text-blue-600 hover:underline font-medium">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
}