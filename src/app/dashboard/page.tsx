"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
    LayoutDashboard,
    MessageSquare,
    Search,
    Lock,
    CheckCircle2,
    Clock,
    AlertCircle,
    User,
    LogOut,
    Plus,
    Trophy,
    Target,
    Zap,
    Loader2,
    ChevronRight,
    GraduationCap,
    MapPin,
    DollarSign,
    Sparkles,
    TrendingUp,
    Calendar,
    ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { calculateMatchScore, getFitCategory } from "@/lib/matching-engine";
import UniversityAnalysisModal from "@/components/UniversityAnalysisModal";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedUni, setSelectedUni] = useState<any>(null);

    const stages = [
        { id: "building_profile", name: "Profile", icon: User },
        { id: "discovering_universities", name: "Discovery", icon: Search },
        { id: "finalizing_universities", name: "Selection", icon: Lock },
        { id: "preparing_applications", name: "Apply", icon: CheckCircle2 },
    ];

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            fetchDashboardData();
        }
    }, [status, router]);

    const fetchDashboardData = async () => {
        try {
            const res = await fetch("/api/dashboard");
            const json = await res.json();
            setData(json);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    const { profile, tasks, shortlisted, locked } = data || {};
    const currentStageIndex = stages.findIndex(s => s.id === (profile?.currentStage || "building_profile"));

    return (
        <div className="min-h-screen bg-[#f8fafc] flex overflow-hidden">
            {/* Sidebar / Nav */}
            <aside className="w-24 lg:w-64 h-screen sticky top-0 bg-white border-r border-slate-200 p-6 flex flex-col items-center lg:items-start transition-all">
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                        <Sparkles className="w-6 h-6 text-white fill-current" />
                    </div>
                    <span className="text-xl font-black text-slate-900 tracking-tight hidden lg:block">AI Command</span>
                </div>

                <nav className="space-y-3 w-full">
                    {[
                        { href: "/dashboard", icon: LayoutDashboard, label: "Console", active: true },
                        { href: "/counsellor", icon: MessageSquare, label: "AI Advisor" },
                        { href: "/discovery", icon: Search, label: "Engine" },
                        { href: "/profile", icon: User, label: "Identity" },
                    ].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-4 rounded-2xl font-bold transition-all text-sm group",
                                item.active
                                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100"
                                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", item.active ? "text-white" : "group-hover:text-indigo-600")} />
                            <span className="hidden lg:block">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto w-full">
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex items-center gap-3 px-4 py-4 w-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl font-bold transition-all text-sm group"
                    >
                        <LogOut className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                        <span className="hidden lg:block">Shutdown</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto px-6 lg:px-12 py-10">
                {/* Modern Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 mb-2"
                        >
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">System Online • {profile?.major || "User"}</span>
                        </motion.div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Command Center<span className="text-indigo-600">.</span></h1>
                    </div>

                    <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex -space-x-2 mr-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase">A{i}</div>
                            ))}
                        </div>
                        <div className="h-8 w-[1px] bg-slate-100 mx-1" />
                        <button className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-all shadow-lg active:scale-95">
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* THE BENTO GRID */}
                <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-[120px]">

                    {/* 1. STAGE PROGRESS (Wide Top) */}
                    <div className="md:col-span-6 lg:col-span-8 row-span-1 bg-white border border-slate-200 rounded-[2.5rem] p-2 flex items-center shadow-sm">
                        {stages.map((stage, idx) => (
                            <div key={stage.id} className="flex-1 flex flex-col items-center justify-center relative">
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all z-10 shadow-sm border",
                                    idx <= currentStageIndex ? "bg-indigo-600 text-white border-indigo-500" : "bg-slate-50 text-slate-300 border-slate-100"
                                )}>
                                    {idx < currentStageIndex ? <CheckCircle2 className="w-5 h-5" /> : <stage.icon className="w-5 h-5" />}
                                </div>
                                <span className={cn(
                                    "text-[9px] font-black uppercase tracking-widest mt-2",
                                    idx <= currentStageIndex ? "text-slate-900" : "text-slate-300"
                                )}>{stage.name}</span>
                                {idx < stages.length - 1 && (
                                    <div className={cn(
                                        "absolute left-1/2 top-5 w-full h-[2px] -z-0",
                                        idx < currentStageIndex ? "bg-indigo-200" : "bg-slate-50"
                                    )} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* 2. MATCH ANALYTICS (Square Top) */}
                    <div className="md:col-span-6 lg:col-span-4 row-span-2 bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                        <div className="relative z-10 h-full flex flex-col">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-indigo-400" /> Match Index
                            </h3>
                            <div className="mt-auto">
                                <p className="text-5xl font-black mb-1">87<span className="text-indigo-400">%</span></p>
                                <p className="text-xs font-medium text-slate-400 leading-relaxed mb-6">Your profile strength is <span className="text-indigo-400 font-bold">Optimal</span> for Top 50 global universities matching your budget.</p>
                                <div className="flex gap-2">
                                    <div className="h-1 flex-1 bg-indigo-500/30 rounded-full overflow-hidden">
                                        <div className="h-full w-[87%] bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.5)]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Sparkles className="absolute -right-10 -top-10 w-48 h-48 text-white/5 opacity-10 rotate-12" />
                    </div>

                    {/* 3. SHORTLIST RADAR (Large Vertical) */}
                    <div className="md:col-span-6 lg:col-span-5 row-span-4 bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm flex flex-col">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Radar</h2>
                            <Link href="/discovery" className="p-3 bg-slate-50 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                                <ArrowUpRight className="w-5 h-5" />
                            </Link>
                        </div>

                        <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            {shortlisted?.length > 0 ? (
                                shortlisted.map((item: any) => {
                                    const score = calculateMatchScore(profile, item.university);
                                    const cat = getFitCategory(score);
                                    return (
                                        <div
                                            key={item.id}
                                            onClick={() => setSelectedUni(item.university)}
                                            className="flex items-center gap-5 p-5 bg-slate-50/50 rounded-3xl border border-transparent hover:border-indigo-100 hover:bg-white transition-all group cursor-pointer"
                                        >
                                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                <GraduationCap className="w-7 h-7 text-slate-400 group-hover:text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-black text-slate-900 leading-none mb-1 text-sm group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{item.university.name}</h4>
                                                <p className="text-[10px] font-bold text-slate-400 tracking-wider flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.university.location}</p>
                                            </div>
                                            <div className={cn(
                                                "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest",
                                                cat === "Safe" ? "bg-emerald-50 text-emerald-600" : cat === "Reach" ? "bg-rose-50 text-rose-600" : "bg-indigo-50 text-indigo-600"
                                            )}>
                                                {score}%
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center pb-10">
                                    <Search className="w-12 h-12 text-slate-200 mb-4" />
                                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No Active Signals</p>
                                </div>
                            )}
                        </div>
                        <button onClick={() => router.push('/discovery')} className="mt-8 py-5 w-full bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">Engage Discovery</button>
                    </div>

                    {/* 4. AI TO-DO (Dynamic Square) */}
                    <div className="md:col-span-6 lg:col-span-7 row-span-3 bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <Zap className="w-5 h-5 text-indigo-500" /> Strategic Path
                            </h3>
                            <button className="text-[10px] font-black text-slate-400 hover:text-indigo-600 transition-colors tracking-[0.2em]">VIEW ALL TASKS</button>
                        </div>

                        <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
                            {tasks?.length > 0 ? (
                                tasks.map((task: any) => (
                                    <div key={task.id} className="group flex items-start gap-4 p-5 hover:bg-indigo-50/50 rounded-3xl transition-all border border-transparent hover:border-indigo-100">
                                        <div className={cn(
                                            "w-6 h-6 rounded-lg border-2 mt-0.5 flex items-center justify-center transition-all",
                                            task.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-200 group-hover:border-indigo-400"
                                        )}>
                                            {task.completed && <CheckCircle2 className="w-4 h-4" />}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className={cn("font-black text-sm tracking-tight mb-1", task.completed ? "text-slate-400 line-through" : "text-slate-900")}>{task.title}</h4>
                                            <p className="text-xs text-slate-400 font-medium leading-relaxed">{task.description}</p>
                                        </div>
                                        <div className="text-[9px] font-black text-slate-400 bg-slate-100 px-3 py-1.5 rounded-xl uppercase tracking-widest h-fit">
                                            {task.priority || "Normal"}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-400 font-medium italic text-center text-sm py-10">AI is computing your next strategic moves...</p>
                            )}
                        </div>
                    </div>

                    {/* 5. ADMISSION TIMELINE (Narrow Horizontal) */}
                    <div className="md:col-span-6 lg:col-span-7 row-span-1 bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm flex items-center gap-6 overflow-hidden">
                        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl shadow-inner">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Target Intake</p>
                            <p className="text-sm font-black text-slate-900">Fall 2026 Admissions Open in 45 Days</p>
                        </div>
                        <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden hidden md:block">
                            <div className="h-full w-[65%] bg-emerald-500" />
                        </div>
                    </div>

                    {/* 6. IDENTITY SUMMARY (Small Vertical) - Replaces Profile Strength */}
                    <div className="md:col-span-6 lg:col-span-3 row-span-2 bg-indigo-50 border border-indigo-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between">
                        <div>
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">Current Asset</p>
                            <h4 className="text-lg font-black text-slate-900 leading-tight mb-2 capitalize">{profile?.academicStrength || "Standard"} Profile</h4>
                            <p className="text-[10px] font-bold text-indigo-600 leading-relaxed uppercase tracking-wider">GPA: {profile?.gpa || "N/A"} • {profile?.ieltsScore ? `IELTS ${profile.ieltsScore}` : 'Exam Status: Pending'}</p>
                        </div>
                        <Link href="/profile" className="mt-4 flex items-center justify-between text-indigo-600 group">
                            <span className="text-xs font-black uppercase tracking-widest">Upgrade Profile</span>
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Link>
                    </div>

                    {/* 7. QUICK STAT (Tiny) */}
                    <div className="md:col-span-3 lg:col-span-3 row-span-1 bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm flex items-center gap-4">
                        <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Budget</p>
                            <p className="text-sm font-black text-slate-900">{profile?.budgetMax ? `$${profile.budgetMax / 1000}k` : "—"}</p>
                        </div>
                    </div>

                    {/* 8. QUICK STAT 2 (Tiny) */}
                    <div className="md:col-span-3 lg:col-span-3 row-span-1 bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm flex items-center gap-4">
                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                            <Lock className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Locked</p>
                            <p className="text-sm font-black text-slate-900">{locked?.length || 0} UNI</p>
                        </div>
                    </div>

                    {/* 9. DOCUMENT READINESS (New - 6 cols, 2 rows) */}
                    <div className="md:col-span-6 lg:col-span-6 row-span-2 bg-white border border-slate-200 rounded-[3rem] p-8 shadow-sm">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-indigo-500" /> Document Assets
                        </h3>
                        <div className="space-y-6">
                            {[
                                { name: "Statement of Purpose", status: profile?.sopStatus || "not_started", progress: profile?.sopStatus === "ready" ? 100 : profile?.sopStatus === "draft" ? 60 : 10 },
                                { name: "Recommendation Letters", status: "In Progress", progress: 45 },
                                { name: "Financial Transcripts", status: "Ready", progress: 100 },
                            ].map((doc, i) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">{doc.name}</span>
                                        <span className="text-[10px] font-bold text-indigo-600">{doc.status.replace('_', ' ')}</span>
                                    </div>
                                    <div className="h-1 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${doc.progress}%` }}
                                            className={cn(
                                                "h-full rounded-full transition-all",
                                                doc.progress === 100 ? "bg-emerald-400" : "bg-indigo-400"
                                            )}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 10. ADMISSION CLOCK (Decorative - 6 cols, 2 rows) */}
                    <div className="md:col-span-6 lg:col-span-6 row-span-2 bg-indigo-600 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl">
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">System Clock</h3>
                            <div>
                                <p className="text-4xl font-black mb-1">08:45:12</p>
                                <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">Time to Decision • 2026 Season</p>
                            </div>
                        </div>
                        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 blur-[40px] rounded-full" />
                    </div>

                </div>
            </main>

            <UniversityAnalysisModal
                isOpen={!!selectedUni}
                onClose={() => setSelectedUni(null)}
                university={selectedUni}
                profile={profile}
            />

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </div>
    );
}
