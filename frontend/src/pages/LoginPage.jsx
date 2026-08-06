import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { 
  ArrowRight, Loader2, ShieldCheck, Mail, Lock, User as UserIcon, 
  Sparkles, EyeOff, Key, Shield, Zap, FileText 
} from 'lucide-react';
import AIMascot from '../components/AIMascot';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('signin'); // 'signin' | 'signup'
  const [isLoading, setIsLoading] = useState(false);

  // Sign In State (Clean, no pre-filled dummy credentials)
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign Up State
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('analyst');

  const { login, register, loginAsGuest } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      addToast('Please enter your username/email and password', 'warning');
      return;
    }
    setIsLoading(true);
    try {
      await login(loginIdentifier.trim(), loginPassword);
      addToast('Welcome back to Mission Control!', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      addToast(err.message || 'Invalid username/email or password', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!regFullName.trim() || !regEmail.trim() || !regUsername.trim() || !regPassword) {
      addToast('Please fill out all required registration fields', 'warning');
      return;
    }
    setIsLoading(true);
    try {
      await register({
        username: regUsername.trim(),
        email: regEmail.trim(),
        fullName: regFullName.trim(),
        password: regPassword,
        role: regRole
      });
      addToast('Account created successfully! Welcome aboard.', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      addToast(err.message || 'Registration failed. Username or email may already be in use.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestEntry = async () => {
    setIsLoading(true);
    try {
      await loginAsGuest();
      addToast('Entered Private Guest Sandbox — Zero history or user data will be saved.', 'info');
      navigate(from, { replace: true });
    } catch (err) {
      addToast('Guest entry failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-[#0A0D16] relative overflow-hidden font-sans">
      {/* Ambient lighting backgrounds */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-pink-500/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[160px] pointer-events-none" />

      {/* WIDE SPLIT-SCREEN CARD CONTAINER */}
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 180 }}
        className="w-full max-w-5xl bg-slate-900/85 border border-white/15 rounded-[36px] shadow-[0_25px_90px_rgba(0,0,0,0.8)] backdrop-blur-3xl flex flex-col lg:flex-row overflow-hidden relative z-10 my-auto"
      >
        {/* LEFT COLUMN: BRANDING & VISUAL SHOWCASE */}
        <div className="lg:w-5/12 bg-gradient-to-br from-indigo-950/90 via-slate-900 to-purple-950/80 p-8 sm:p-10 lg:p-12 flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden min-h-[380px] lg:min-h-full">
          
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 font-extrabold text-[11px] text-cyan-300 tracking-widest uppercase bg-cyan-500/15 border border-cyan-400/40 px-3.5 py-1.5 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.25)]">
              <Zap size={13} className="text-cyan-400 animate-bounce" />
              <span>Autonomous RAG OS</span>
            </span>
          </div>

          <div className="my-8 lg:my-12 flex flex-col items-center justify-center relative z-10">
            <div className="relative flex items-center justify-center">
              <motion.div 
                animate={{ y: [-5, 5, -5] }} 
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} 
                className="absolute -top-4 -left-6 bg-slate-900/90 border border-indigo-500/40 px-3 py-1.5 rounded-xl text-[11px] font-extrabold text-indigo-300 shadow-xl backdrop-blur-md hidden sm:flex items-center gap-1.5 z-20"
              >
                <Shield size={12} className="text-indigo-400" />
                <span>Isolated Tenants</span>
              </motion.div>

              <motion.div 
                animate={{ y: [5, -5, 5] }} 
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} 
                className="absolute -bottom-2 -right-6 bg-slate-900/90 border border-pink-500/40 px-3 py-1.5 rounded-xl text-[11px] font-extrabold text-pink-300 shadow-xl backdrop-blur-md hidden sm:flex items-center gap-1.5 z-20"
              >
                <FileText size={12} className="text-pink-400" />
                <span>Vector Retrieval</span>
              </motion.div>

              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-[42px] bg-gradient-to-tr from-cyan-400 via-indigo-500 to-pink-500 p-1 shadow-[0_20px_60px_rgba(99,102,241,0.4)] transform hover:scale-105 transition-transform duration-500 flex items-center justify-center relative">
                <div className="w-full h-full bg-slate-950/95 rounded-[38px] flex items-center justify-center p-4">
                  <AIMascot size="xl" state={isLoading ? "thinking" : "happy"} />
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
              Supercharge Your Knowledge Core.
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-2.5 leading-relaxed font-medium opacity-90">
              Experience next-generation semantic synthesis with enterprise-grade persistence, verified source citations, and privacy guest isolation.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: SPACIOUS FORM PORTAL */}
        <div className="lg:w-7/12 p-6 sm:p-10 lg:p-12 bg-slate-950/80 flex flex-col justify-center relative z-10">
          
          {/* Header & Mode Toggle */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {activeTab === 'signin' ? 'Sign In to Portal' : 'Create an Account'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                {activeTab === 'signin' ? 'Enter your existing user credentials to log in' : 'Register your email/Gmail to create a new profile'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'signin' ? 'signup' : 'signin')}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 self-start sm:self-auto flex items-center gap-1.5 whitespace-nowrap shadow-sm"
            >
              <span>{activeTab === 'signin' ? 'Create Account' : 'Sign In instead'}</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* FORM AREA */}
          <AnimatePresence mode="wait">
            {activeTab === 'signin' ? (
              /* SIGN IN FORM (No pre-filled dummy credentials) */
              <motion.form
                key="signin-form"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleSignInSubmit}
                className="space-y-5"
              >
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-2 uppercase tracking-wider flex items-center gap-2">
                    <UserIcon size={14} className="text-cyan-400" />
                    <span>Username or Email</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-900/90 hover:bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-2xl px-4 py-3.5 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all font-medium shadow-inner"
                    placeholder="Enter your registered username or email"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-2 uppercase tracking-wider flex items-center gap-2">
                    <Lock size={14} className="text-cyan-400" />
                    <span>Password</span>
                  </label>
                  <input
                    type="password"
                    required
                    className="w-full bg-slate-900/90 hover:bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-2xl px-4 py-3.5 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all font-medium shadow-inner"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 via-indigo-500 to-pink-500 hover:from-cyan-400 hover:via-indigo-400 hover:to-pink-400 font-extrabold rounded-2xl shadow-[0_10px_35px_rgba(99,102,241,0.4)] text-white text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" />
                      <span>Authenticating Core...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Intelligence Core</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </motion.form>
            ) : (
              /* SPACIOUS SIGN UP FORM */
              <motion.form
                key="signup-form"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleSignUpSubmit}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                      <UserIcon size={13} className="text-indigo-400" /> Full Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-900/90 hover:bg-slate-900 border border-white/15 focus:border-indigo-400 rounded-2xl px-4 py-3 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/20 transition-all font-medium"
                      placeholder="e.g. Elena Rostova"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                      <Key size={13} className="text-indigo-400" /> Username
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-900/90 hover:bg-slate-900 border border-white/15 focus:border-indigo-400 rounded-2xl px-4 py-3 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/20 transition-all font-medium"
                      placeholder="e.g. elena_ai"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Email Address full-width */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail size={13} className="text-indigo-400" /> Email / Gmail Address
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full bg-slate-900/90 hover:bg-slate-900 border border-white/15 focus:border-indigo-400 rounded-2xl px-4 py-3 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/20 transition-all font-medium"
                    placeholder="e.g. you@gmail.com or you@company.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                {/* Password & Role Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                      <Lock size={13} className="text-indigo-400" /> Password
                    </label>
                    <input
                      type="password"
                      required
                      className="w-full bg-slate-900/90 hover:bg-slate-900 border border-white/15 focus:border-indigo-400 rounded-2xl px-4 py-3 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/20 transition-all font-medium"
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck size={13} className="text-indigo-400" /> Role Grant
                    </label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value)}
                      disabled={isLoading}
                      className="w-full bg-slate-900 border border-white/15 focus:border-indigo-400 rounded-2xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/20 transition-all font-bold cursor-pointer"
                    >
                      <option value="analyst">Analyst (Upload & Chat)</option>
                      <option value="admin">Admin (Full Control)</option>
                      <option value="viewer">Viewer (Read Only)</option>
                    </select>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-4 px-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 font-extrabold rounded-2xl shadow-[0_10px_35px_rgba(168,85,247,0.4)] text-white text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    <>
                      <span>Create Account & Continue</span>
                      <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Separator Line */}
          <div className="flex items-center my-7">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-4 text-slate-500 text-[11px] font-extrabold tracking-widest uppercase">
              Or anonymous access
            </span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          {/* GUEST SANDBOX ACCESS OPTION */}
          <div>
            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              type="button"
              onClick={handleGuestEntry}
              disabled={isLoading}
              className="w-full py-3.5 px-6 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-400/50 text-emerald-300 rounded-2xl font-bold transition-all flex items-center justify-center gap-2.5 text-xs uppercase tracking-wider shadow-sm group"
            >
              <EyeOff className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Continue as Guest (Private Sandbox)</span>
            </motion.button>
            <p className="text-[11px] text-center text-slate-500 font-medium mt-2.5 leading-relaxed">
              Guest mode operates inside an ephemeral session. No user data, documents, or chat history will ever be saved to the database.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
