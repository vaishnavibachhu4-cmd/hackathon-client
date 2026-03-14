import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Shield, Users, Gavel, ArrowRight, Code2, Zap, Globe, Lock, BarChart3, Trophy } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  const features = [
    { icon: <Users size={22} className="text-emerald-400" />, title: 'Team Enrollment', desc: 'Register teams with up to 5 members across multiple categories' },
    { icon: <Code2 size={22} className="text-blue-400" />, title: 'Project Submission', desc: 'Submit projects with files, GitHub links, and demo videos' },
    { icon: <Gavel size={22} className="text-amber-400" />, title: 'Jury Evaluation', desc: 'Structured scoring across 5 dimensions with detailed feedback' },
    { icon: <Trophy size={22} className="text-violet-400" />, title: 'Results & Rankings', desc: 'Automated leaderboard with winner declaration and announcements' },
    { icon: <Shield size={22} className="text-red-400" />, title: 'Secure Auth', desc: 'JWT-based authentication with role-based access control' },
    { icon: <BarChart3 size={22} className="text-cyan-400" />, title: 'Analytics Dashboard', desc: 'Real-time statistics and insights for administrators' },
  ];

  const categories = ['AI/ML', 'Web Development', 'Mobile App', 'IoT', 'Cybersecurity', 'Blockchain'];

  return (
    <div className="min-h-screen text-white">
      {/* Nav */}
      <nav className="border-b border-blue-900/20 backdrop-blur-md sticky top-0 z-40 bg-blue-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                <Award size={20} className="text-white" />
              </div>
              <div>
                <span className="font-bold text-white text-lg">HackArena</span>
                <span className="text-blue-500/60 text-xs ml-2 hidden sm:inline">Management System</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => navigate('/login')} className="px-5 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all shadow-lg shadow-blue-900/20 font-medium">
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-indigo-900/20" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/30 border border-blue-700/30 text-blue-300 text-sm font-medium mb-6 backdrop-blur-md">
              <Zap size={14} className="text-blue-400" />
              <span>Complete Hackathon Management Platform</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
              <span className="text-white">Manage Your</span>{' '}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Hackathon
              </span>
              <br />
              <span className="text-white">Like Never Before</span>
            </h1>
            <p className="text-gray-400 text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              A comprehensive platform for team enrollment, project submission, jury evaluation, and results management — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/register/participant')}
                className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-50 hover:to-indigo-500 text-white rounded-xl font-bold transition-all shadow-xl shadow-blue-900/40 scale-100 hover:scale-[1.02] active:scale-95"
              >
                Register as Participant
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate('/results')}
                className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all border border-gray-700"
              >
                <Trophy size={18} />
                View Results
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-blue-800/20 bg-blue-900/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Categories', value: '6+', icon: '🏷️' },
              { label: 'Max Team Size', value: '5', icon: '👥' },
              { label: 'Evaluation Criteria', value: '5', icon: '📊' },
              { label: 'Max Score', value: '50', icon: '🏆' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Everything You Need</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Powerful features designed for seamless hackathon management</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-blue-950/30 backdrop-blur-md border border-blue-800/30 rounded-xl p-6 hover:border-blue-700/50 transition-all group"
            >
              <div className="w-11 h-11 bg-gray-800 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-blue-900/10 border-y border-blue-800/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-4">Project Categories</h2>
            <p className="text-gray-400">Submit projects across 6 exciting technology domains</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat, i) => (
              <span key={cat} className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all
                ${
                  i === 0 ? 'bg-blue-900/30 border-blue-700/50 text-blue-300' :
                  i === 1 ? 'bg-indigo-900/30 border-indigo-700/50 text-indigo-300' :
                  i === 2 ? 'bg-emerald-900/30 border-emerald-700/50 text-emerald-300' :
                  i === 3 ? 'bg-amber-900/30 border-amber-700/50 text-amber-300' :
                  i === 4 ? 'bg-red-900/30 border-red-700/50 text-red-300' :
                  'bg-cyan-900/30 border-cyan-700/50 text-cyan-300'
                }`}>
                {cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Login Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Get Started</h2>
          <p className="text-gray-400">Choose your role to access the platform</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              role: 'Participant',
              desc: 'Register your team, submit projects, and track your progress',
              icon: <Users size={28} className="text-emerald-400" />,
              color: 'from-emerald-600 to-teal-600',
              loginPath: '/login',
              registerPath: '/register/participant',
              bg: 'bg-emerald-900/20 border-emerald-800/50',
            },
            {
              role: 'Admin',
              desc: 'Manage registrations, assign projects, and declare winners',
              icon: <Shield size={28} className="text-blue-400" />,
              color: 'from-blue-600 to-indigo-600',
              loginPath: '/login',
              registerPath: null,
              bg: 'bg-blue-900/20 border-blue-800/50',
            },
            {
              role: 'Jury Member',
              desc: 'Evaluate assigned projects and provide detailed feedback',
              icon: <Gavel size={28} className="text-amber-400" />,
              color: 'from-amber-600 to-orange-600',
              loginPath: '/login',
              registerPath: '/register/jury',
              bg: 'bg-amber-900/20 border-amber-800/50',
            },
          ].map((card) => (
            <div key={card.role} className={`bg-blue-950/40 backdrop-blur-xl border ${card.bg} rounded-2xl p-6 flex flex-col hover:scale-[1.01] transition-transform`}>
              <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center mb-5">
                {card.icon}
              </div>
              <h3 className="text-white font-bold text-xl mb-2">{card.role}</h3>
              <p className="text-gray-400 text-sm mb-6 flex-1">{card.desc}</p>
              <div className="space-y-2">
                <button
                  onClick={() => navigate(card.loginPath)}
                  className={`w-full py-2.5 rounded-xl bg-gradient-to-r ${card.color} text-white font-medium text-sm transition-all hover:opacity-90`}
                >
                  Login as {card.role}
                </button>
                {card.registerPath && (
                  <button
                    onClick={() => navigate(card.registerPath!)}
                    className="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium text-sm transition-all border border-gray-700"
                  >
                    Register Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Award size={18} className="text-blue-400" />
            <span className="text-white font-semibold">HackArena</span>
          </div>
          <p className="text-gray-500 text-sm">Hackathon Team Enrollment, Project Submission & Jury Evaluation System</p>
          <p className="text-gray-600 text-xs mt-2">Admin credentials: admin@hackathon.com / Admin@123</p>
        </div>
      </footer>
    </div>
  );
}
