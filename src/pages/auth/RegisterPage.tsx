import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Gavel, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { db, generateId, hashPassword } from '../../lib/db';
import type { User } from '../../lib/types';

export default function RegisterPage() {
  const { role = 'participant' } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    college: '', phone: '', organization: '', expertiseArea: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const isJury = role === 'jury';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    const existing = db.getUserByEmail(formData.email.toLowerCase());
    if (existing) {
      setError('An account with this email already exists');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const user: User = {
      id: generateId(),
      name: formData.name.trim(),
      email: formData.email.toLowerCase().trim(),
      password: hashPassword(formData.password),
      role: isJury ? 'jury' : 'participant',
      approvalStatus: 'pending',
      college: formData.college,
      phone: formData.phone,
      organization: formData.organization,
      expertiseArea: formData.expertiseArea,
      createdAt: new Date().toISOString(),
    };
    db.addUser(user);
    setLoading(false);
    setSuccess(true);
  };

  const config = isJury ? {
    title: 'Jury Member Registration',
    color: 'from-amber-500 to-orange-600',
    icon: <Gavel size={24} className="text-white" />,
  } : {
    title: 'Participant Registration',
    color: 'from-emerald-500 to-teal-600',
    icon: <Users size={24} className="text-white" />,
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-emerald-400" />
          </div>
          <h2 className="text-white text-xl font-bold mb-2">Registration Submitted!</h2>
          <p className="text-gray-400 text-sm mb-6">
            Your account is pending admin approval. You'll be able to login once approved.
          </p>
          <button onClick={() => navigate(`/login/${role}`)}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium">
            Go to Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 text-sm">
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className={`bg-gradient-to-r ${config.color} p-6`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">{config.icon}</div>
              <div>
                <h1 className="text-white font-bold text-xl">{config.title}</h1>
                <p className="text-white/70 text-sm">Create your account to get started</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3 text-red-300 text-sm">{error}</div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name *</label>
                <input name="name" value={formData.name} onChange={handleChange} required
                  placeholder="John Doe"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address *</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} required
                  placeholder="john@example.com"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20" />
              </div>

              {isJury ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Organization *</label>
                    <input name="organization" value={formData.organization} onChange={handleChange} required
                      placeholder="Company / University"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Expertise Area *</label>
                    <input name="expertiseArea" value={formData.expertiseArea} onChange={handleChange} required
                      placeholder="e.g. AI/ML, Web Dev"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20" />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">College / Organization *</label>
                    <input name="college" value={formData.college} onChange={handleChange} required
                      placeholder="MIT, Stanford, etc."
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone Number *</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} required
                      placeholder="+1 234 567 8900"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20" />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Password *</label>
                <div className="relative">
                  <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} required
                    placeholder="Min 6 characters"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 pr-10 py-2.5 text-white placeholder-gray-500 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm Password *</label>
                <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required
                  placeholder="Repeat password"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-semibold transition-all bg-gradient-to-r ${config.color} hover:opacity-90 disabled:opacity-60 mt-2`}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <button type="button" onClick={() => navigate(`/login/${role}`)} className="text-violet-400 hover:text-violet-300 font-medium">
                Sign in
              </button>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
