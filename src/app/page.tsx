"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Sparkles, GraduationCap, Target, CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";



export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-[#f8fafc] selection:bg-indigo-100 selection:text-indigo-700 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <Sparkles className="w-6 h-6 text-white fill-current" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">AI Counsellor</span>
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <Link
                href="/dashboard"
                className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 active:scale-95"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-bold transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all active:scale-95"
                >
                  Join Now
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <section className="relative pt-48 pb-32 overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/hero-bg.png"
              alt="University Campus"
              className="w-full h-full object-cover opacity-20 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#f8fafc] via-transparent to-[#f8fafc]" />
          </div>

          <div className="container mx-auto px-6 text-center max-w-5xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50/80 backdrop-blur-md border border-indigo-100 rounded-full mb-8 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-indigo-700 font-bold text-xs uppercase tracking-widest">
                The smartest way to study abroad
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]"
            >
              Your Global Future, <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient">
                Guided by AI.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto font-medium leading-relaxed"
            >
              Personalized university recommendations, step-by-step roadmaps, and real-time guidance from the world's most capable AI counselling agent.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {session ? (
                <Link
                  href="/dashboard"
                  className="group px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-indigo-200 transition-all flex items-center gap-2"
                >
                  Go to My Dashboard <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="group px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-indigo-200 transition-all flex items-center gap-2"
                  >
                    Start Your Journey <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/login"
                    className="px-10 py-5 bg-white/80 backdrop-blur-md text-slate-900 rounded-2xl font-black text-lg border-2 border-slate-200 hover:border-indigo-400 hover:text-indigo-600 transition-all"
                  >
                    I Have an Account
                  </Link>
                </>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-20 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafc] to-transparent z-10 bottom-0 h-40" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white/40 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-xl">
                {[
                  { label: "Universities", value: "20,000+" },
                  { label: "Countries", value: "15+" },
                  { label: "AI Matches", value: "100%" },
                  { label: "Success Rate", value: "98%" },
                ].map((stat, i) => (
                  <div key={i} className="p-8 text-center border-r last:border-0 border-slate-100/50">
                    <p className="text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Minimalist */}
        <section className="relative container mx-auto px-6 py-32">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl opacity-10 pointer-events-none">
            <img src="/images/features-bg.png" alt="Abstract Background" className="w-full h-full object-contain animate-pulse-slow" />
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative z-10">
            {[
              { title: "Smart Matching", desc: "Our AI analyzes 50+ data points to find your perfect university fit.", icon: Target, color: "bg-indigo-50 border-indigo-100 text-indigo-600 shadow-indigo-100" },
              { title: "Living Roadmap", desc: "A dynamic task list that updates as you progress through your journey.", icon: CheckCircle2, color: "bg-emerald-50 border-emerald-100 text-emerald-600 shadow-emerald-100" },
              { title: "Document Genius", desc: "Get real-time feedback on your SOPs, LORs, and essays.", icon: GraduationCap, color: "bg-purple-50 border-purple-100 text-purple-600 shadow-purple-100" },
            ].map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="space-y-6 group p-8 rounded-[2rem] bg-white/50 backdrop-blur-sm border border-slate-100 hover:border-indigo-200 hover:bg-white hover:shadow-2xl transition-all"
              >
                <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center transition-all group-hover:scale-110 shadow-lg", f.color)}>
                  <f.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">{f.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="container mx-auto px-6 pb-20">
          <div className="group bg-slate-900 rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
            {/* Background Image */}
            <div className="absolute inset-0 opacity-20 transition-transform duration-700 group-hover:scale-110">
              <img src="/images/cta-bg.png" alt="Success Celebration" className="w-full h-full object-cover" />
            </div>
            {/* Overlay Gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-slate-900 to-purple-900/50" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-6xl font-black mb-8 leading-tight"
              >
                Ready to start your <br /> global adventure?
              </motion.h2>
              <Link
                href="/signup"
                className="inline-flex px-12 py-5 bg-white text-slate-900 rounded-2xl font-black text-xl hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 shadow-xl"
              >
                Join Now for Free
              </Link>
            </div>
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/30 blur-[100px] rounded-full" />
            <div className="absolute -left-20 -top-20 w-80 h-80 bg-purple-500/30 blur-[100px] rounded-full" />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="text-lg font-black text-slate-900 tracking-tight">AI Counsellor</span>
          </div>
          <p className="text-slate-400 font-bold text-sm">© 2026 AI Counsellor. Build Your Future.</p>
          <div className="flex gap-8 text-slate-400 font-bold text-sm">
            <Link href="#" className="hover:text-slate-900 transition-all">Privacy</Link>
            <Link href="#" className="hover:text-slate-900 transition-all">Terms</Link>
            <Link href="#" className="hover:text-slate-900 transition-all">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

