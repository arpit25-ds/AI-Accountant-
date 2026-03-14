import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, CheckCircle2, Library, BookOpen, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-sky-100 selection:text-sky-900">
      {/* Navigation */}
      <nav className="h-20 border-b border-zinc-100 px-6 lg:px-12 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-200">
            <Library className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900">LibraryLedger <span className="text-sky-600 italic">AI</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
          <a href="#features" className="hover:text-sky-600 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-sky-600 transition-colors">Pricing</a>
          <a href="#blog" className="hover:text-sky-600 transition-colors">Blog</a>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-sm font-semibold text-zinc-700 hover:text-zinc-900 px-4 py-2">Log in</button>
          <Link to="/dashboard" className="bg-sky-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-sky-700 transition-all shadow-lg shadow-sky-200">
            Sign up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 lg:px-12 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h1 className="text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-zinc-900">
              Automate Your <br />
              <span className="text-sky-600">Digital Library</span> <br />
              Finances with AI.
            </h1>
            <p className="text-xl text-zinc-500 max-w-lg leading-relaxed">
              AI accounting software designed for digital libraries, 
              handling complex licensing, physical assets, and 
              automated receipt auditing with 100% accuracy.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/dashboard" className="bg-sky-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-sky-700 transition-all shadow-xl shadow-sky-200 flex items-center gap-2 group">
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="flex items-center gap-3 px-8 py-4 rounded-full text-lg font-semibold text-zinc-700 hover:bg-zinc-50 transition-all">
                <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center text-sky-600">
                  <Play className="w-5 h-5 fill-current" />
                </div>
                Watch Demo
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Illustration Placeholder - Using a stylized composition of icons and shapes */}
            <div className="relative aspect-square bg-sky-50 rounded-[4rem] flex items-center justify-center overflow-hidden border border-sky-100 shadow-2xl shadow-sky-100">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-400/10 to-transparent" />
              
              {/* Animated Floating Elements */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-3xl shadow-xl flex items-center justify-center border border-sky-50"
              >
                <BookOpen className="w-12 h-12 text-sky-500" />
              </motion.div>

              <motion.div 
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-white rounded-3xl shadow-xl flex flex-col p-6 border border-sky-50"
              >
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-zinc-100 rounded-full" />
                  <div className="h-2 w-2/3 bg-zinc-100 rounded-full" />
                </div>
              </motion.div>

              <div className="w-64 h-64 bg-sky-600 rounded-full blur-[100px] opacity-20 absolute -z-10" />
              
              {/* Central Robot/AI Icon */}
              <div className="w-48 h-48 bg-white rounded-full shadow-2xl flex items-center justify-center border border-sky-50 relative z-10">
                <div className="w-32 h-32 bg-sky-600 rounded-full flex items-center justify-center text-white">
                  <ShieldCheck className="w-16 h-16" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Finances at a Glance Section */}
      <section className="py-24 bg-zinc-50 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-zinc-900 mb-4">Your Finances at a Glance</h2>
            <p className="text-zinc-500">Real-time monitoring of your library's digital and physical assets.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Mini Chart Card 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-100">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-lg">Download Stats</h3>
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-zinc-300 rounded-full" />
                  <div className="w-1 h-1 bg-zinc-300 rounded-full" />
                  <div className="w-1 h-1 bg-zinc-300 rounded-full" />
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="w-40 h-40 rounded-full border-[16px] border-sky-100 border-t-sky-500 border-r-emerald-400 relative flex items-center justify-center">
                  <span className="text-2xl font-bold">78%</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-sky-500 rounded-full" />
                    <span className="text-sm text-zinc-600">Digital Books (42%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full" />
                    <span className="text-sm text-zinc-600">Audiobooks (36%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-zinc-200 rounded-full" />
                    <span className="text-sm text-zinc-600">Others (22%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mini Chart Card 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-100">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-lg">Money Spent</h3>
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-zinc-300 rounded-full" />
                  <div className="w-1 h-1 bg-zinc-300 rounded-full" />
                  <div className="w-1 h-1 bg-zinc-300 rounded-full" />
                </div>
              </div>
              <div className="flex items-end gap-3 h-40">
                {[40, 70, 45, 90, 65, 80].map((h, i) => (
                  <div key={i} className="flex-1 bg-sky-100 rounded-t-lg relative group">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="absolute bottom-0 left-0 right-0 bg-sky-500 rounded-t-lg group-hover:bg-sky-600 transition-colors"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-xs text-zinc-400 font-medium uppercase tracking-wider">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Features */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold">Automated Auditing</h4>
            <p className="text-zinc-500 leading-relaxed">Our AI Librarian Accountant processes receipts instantly with 100% accuracy, categorizing every expense.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold">Real-time Insights</h4>
            <p className="text-zinc-500 leading-relaxed">Monitor your library's financial health with interactive dashboards and predictive spending analysis.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold">Secure & Compliant</h4>
            <p className="text-zinc-500 leading-relaxed">Enterprise-grade security ensuring your library's financial data is always protected and compliant.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-100 px-6 lg:px-12 text-center text-zinc-400 text-sm">
        <p>© 2026 LibraryLedger AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
