"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ChevronLeft,
    FileText,
    TrendingUp,
    Sparkles,
    CheckCircle2,
    AlertTriangle,
    Zap,
    GraduationCap,
    Lightbulb,
    Target,
    Compass,
    Award,
    LayoutDashboard,
    User,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function SOPAnalyzerPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [sopText, setSopText] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    const handleAnalyze = async () => {
        if (!sopText.trim() || sopText.trim().length < 50) {
            setError("Please enter a valid Statement of Purpose (minimum 50 characters).");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await fetch("/api/sop-analyzer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sopText }),
            });

            const data = await res.json();
            if (res.ok) {
                setResult(data.analysis);
            } else {
                throw new Error(data.error || "Failed to analyze SOP.");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            {/* Sidebar Navigation */}
            <aside className="w-80 bg-white border-r border-slate-200 hidden lg:flex flex-col p-8 sticky top-0 h-screen justify-between shadow-sm">
                <div className="space-y-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-100">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-black text-slate-900 tracking-tight text-lg">ALPHA <span className="text-indigo-600">AI</span></span>
                    </div>

                    <nav className="space-y-2">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-4 px-5 py-4 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all font-bold text-sm"
                        >
                            <LayoutDashboard className="w-5 h-5 text-slate-400" /> Dashboard Console
                        </Link>
                        <Link
                            href="/discovery"
                            className="flex items-center gap-4 px-5 py-4 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all font-bold text-sm"
                        >
                            <Compass className="w-5 h-5 text-slate-400" /> Discovery Engine
                        </Link>
                        <Link
                            href="/counsellor"
                            className="flex items-center gap-4 px-5 py-4 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all font-bold text-sm"
                        >
                            <Sparkles className="w-5 h-5 text-slate-400" /> AI Counsellor
                        </Link>
                        <Link
                            href="/sop-analyzer"
                            className="flex items-center gap-4 px-5 py-4 bg-indigo-50 border border-indigo-100/50 text-indigo-600 rounded-2xl transition-all font-black text-sm shadow-sm"
                        >
                            <FileText className="w-5 h-5 text-indigo-600" /> SOP Analyzer Lab
                        </Link>
                        <Link
                            href="/scholarships"
                            className="flex items-center gap-4 px-5 py-4 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all font-bold text-sm"
                        >
                            <Award className="w-5 h-5 text-slate-400" /> Scholarships
                        </Link>
                        <Link
                            href="/profile"
                            className="flex items-center gap-4 px-5 py-4 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all font-bold text-sm"
                        >
                            <User className="w-5 h-5 text-slate-400" /> My Profile
                        </Link>
                    </nav>
                </div>

                <div className="p-5 bg-slate-900 text-white rounded-[2rem] relative overflow-hidden group shadow-lg">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">PRO MEMBERSHIP</p>
                    <p className="text-xs text-slate-400 font-bold mb-3">Get unlimited access to elite universities.</p>
                    <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 transition-all font-black text-[10px] tracking-wider uppercase rounded-xl">Upgrade Console</button>
                    <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-indigo-500/10 rounded-full blur-[20px]" />
                </div>
            </aside>

            {/* Main Workspace Area */}
            <main className="flex-1 min-h-screen overflow-y-auto px-6 py-10 lg:p-12">
                <div className="max-w-5xl mx-auto space-y-10">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="p-2 hover:bg-white rounded-xl transition-all text-slate-500 shadow-sm border border-slate-100 bg-white lg:hidden"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-full font-black text-[10px] uppercase tracking-wider mb-2 inline-block">AI Evaluation Suite</span>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Statement of Purpose <span className="text-indigo-600">Lab</span></h1>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Editor Sidebar */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex flex-col gap-6">
                                <div>
                                    <h2 className="text-lg font-black text-slate-900 tracking-tight mb-1">Paste SOP Draft</h2>
                                    <p className="text-xs text-slate-400 font-medium">Input your essay text below. Make sure it contains academic background details and target motivations.</p>
                                </div>

                                <textarea
                                    className="w-full h-96 p-6 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium text-slate-800 leading-relaxed resize-none custom-scrollbar"
                                    placeholder="Start copying and pasting your Statement of Purpose (SOP) here..."
                                    value={sopText}
                                    onChange={(e) => setSopText(e.target.value)}
                                />

                                {error && (
                                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                                        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                        <p className="text-xs font-bold text-red-700 leading-snug">{error}</p>
                                    </div>
                                )}

                                <button
                                    onClick={handleAnalyze}
                                    disabled={loading || !sopText.trim()}
                                    className={cn(
                                        "w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95",
                                        loading 
                                            ? "bg-slate-100 text-slate-400 border border-slate-200"
                                            : "bg-slate-900 hover:bg-indigo-600 text-white shadow-xl shadow-slate-100 cursor-pointer"
                                    )}
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
                                    {loading ? "Analyzing Essay..." : "Trigger AI Critique"}
                                </button>
                            </div>
                        </div>

                        {/* Analysis Output Section */}
                        <div className="lg:col-span-1 space-y-6">
                            <AnimatePresence mode="wait">
                                {loading && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-slate-900 rounded-[2.5rem] p-10 text-center text-white flex flex-col items-center justify-center h-full min-h-[480px] shadow-2xl relative overflow-hidden"
                                    >
                                        <div className="relative z-10 space-y-6">
                                            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                                                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-400 animate-spin" />
                                                <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black tracking-tight mb-2">Analyzing Gravity</h3>
                                                <p className="text-xs text-slate-400 leading-relaxed font-medium">Gemini is checking structure, syntax alignment, goal accuracy, and locked university alignment...</p>
                                            </div>
                                        </div>
                                        <div className="absolute -right-20 -bottom-20 w-48 h-48 bg-indigo-500/10 rounded-full blur-[60px]" />
                                    </motion.div>
                                )}

                                {!loading && !result && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white border border-slate-200 rounded-[2.5rem] p-8 text-center text-slate-500 flex flex-col items-center justify-center h-full min-h-[480px] shadow-sm"
                                    >
                                        <FileText className="w-12 h-12 text-slate-300 mb-4 animate-bounce" />
                                        <h3 className="text-base font-black text-slate-800 tracking-tight mb-1">Awaiting Transmission</h3>
                                        <p className="text-xs text-slate-400 leading-relaxed max-w-xs font-medium">Paste your draft and trigger the evaluation suite to calculate your match accuracy and structural grades.</p>
                                    </motion.div>
                                )}

                                {!loading && result && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-6"
                                    >
                                        {/* Score Bento Card */}
                                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
                                            <div className="relative z-10 flex flex-col gap-6">
                                                <div>
                                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Overall SOP Score</p>
                                                    <div className="flex items-end gap-2">
                                                        <span className="text-6xl font-black leading-none">{result.score}%</span>
                                                        <span className="px-2 py-0.5 bg-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest mb-1">
                                                            {result.score >= 80 ? "STRONG" : result.score >= 55 ? "COMPETITIVE" : "WEAK"}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${result.score}%` }}
                                                        transition={{ duration: 1, ease: "easeOut" }}
                                                        className="h-full bg-indigo-400"
                                                    />
                                                </div>

                                                <p className="text-xs text-slate-400 leading-relaxed font-medium">{result.summary}</p>
                                            </div>
                                            <TrendingUp className="absolute -right-6 -bottom-6 w-24 h-24 text-white/5 -rotate-12" />
                                        </div>

                                        {/* Ratings Widget */}
                                        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm space-y-4">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Structural Grades</h4>
                                            
                                            {[
                                                { label: "Academic Alignment", value: result.academicAlignment },
                                                { label: "Structure & Flow", value: result.structureRating },
                                                { label: "Goal Clarity", value: result.clarityOfGoals }
                                            ].map((r, i) => (
                                                <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                                                    <span className="text-xs font-bold text-slate-700">{r.label}</span>
                                                    <span className={cn(
                                                        "text-[9px] font-black uppercase px-2 py-0.5 rounded-md",
                                                        r.value === "optimal" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                                        r.value === "average" ? "bg-indigo-50 text-indigo-600 border border-indigo-100" :
                                                        "bg-red-50 text-red-600 border border-red-100"
                                                    )}>{r.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Lower Results details */}
                    {!loading && result && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        >
                            {/* Strengths & Gaps */}
                            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm space-y-6">
                                <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Essay Strengths
                                </h3>
                                <ul className="space-y-3">
                                    {result.strengths.map((str: string, i: number) => (
                                        <li key={i} className="text-xs text-slate-600 font-medium flex gap-3 items-start">
                                            <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">{i+1}</span>
                                            <span className="leading-relaxed">{str}</span>
                                        </li>
                                    ))}
                                </ul>

                                <hr className="border-slate-100" />

                                <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-amber-500" /> Found Gaps
                                </h3>
                                <ul className="space-y-3">
                                    {result.gaps.map((gap: string, i: number) => (
                                        <li key={i} className="text-xs text-slate-600 font-medium flex gap-3 items-start">
                                            <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">{i+1}</span>
                                            <span className="leading-relaxed">{gap}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Recommendations & Tasks */}
                            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm space-y-6">
                                <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                                    <Lightbulb className="w-5 h-5 text-indigo-600 animate-pulse" /> AI Recommendations
                                </h3>
                                <ul className="space-y-3">
                                    {result.recommendations.map((rec: string, i: number) => (
                                        <li key={i} className="text-xs text-slate-600 font-semibold flex gap-3 items-start bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                            <span className="w-5 h-5 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">{i+1}</span>
                                            <span className="leading-relaxed">{rec}</span>
                                        </li>
                                    ))}
                                </ul>

                                {result.tasks && result.tasks.length > 0 && (
                                    <>
                                        <hr className="border-slate-100" />
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Strategic Tasks Generated in Dashboard</h3>
                                        <div className="space-y-3">
                                            {result.tasks.map((task: any, i: number) => (
                                                <div key={i} className="p-4 bg-indigo-50/50 border border-indigo-100/50 rounded-2xl flex gap-3 items-start">
                                                    <Zap className="w-4 h-4 text-indigo-600 shrink-0 mt-1 animate-bounce" />
                                                    <div>
                                                        <h5 className="text-xs font-black text-slate-800">{task.title}</h5>
                                                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-0.5">{task.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
}
