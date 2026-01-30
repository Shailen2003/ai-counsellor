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
    DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const stages = [
        { id: "building_profile", name: "Building Profile", icon: User },
        { id: "discovering_universities", name: "Discovering Universities", icon: Search },
        { id: "finalizing_universities", name: "Finalizing Universities", icon: Lock },
        { id: "preparing_applications", name: "Preparing Applications", icon: CheckCircle2 },
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

            if (json.profile && !json.profile.isComplete) {
                // Profile exists but not complete - might want to nudge
            }
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
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Sidebar / Nav */}
            <div className="flex">
                <aside className="w-64 h-screen sticky top-0 bg-white border-r border-slate-200 p-6 hidden lg:block">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white fill-current" />
                        </div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">AI Counsellor</span>
                    </div>

                    <nav className="space-y-2">
                        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-semibold transition-all">
                            <LayoutDashboard className="w-5 h-5" /> Dashboard
                        </Link>
                        <Link href="/counsellor" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-all">
                            <MessageSquare className="w-5 h-5" /> AI Counsellor
                        </Link>

                        <Link href="/discovery" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-all">
                            <Search className="w-5 h-5" /> Find Universities
                        </Link>
                        <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-all">
                            <User className="w-5 h-5" /> My Profile
                        </Link>
                    </nav>

                    <div className="absolute bottom-8 left-6 right-6">
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl font-medium transition-all"
                        >
                            <LogOut className="w-5 h-5" /> Logout
                        </button>
                    </div>
                </aside>

                <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
                    {/* Header */}
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Hello, {session?.user?.name}! 👋</h1>
                            <p className="text-slate-500 font-medium">Welcome back to your admission control center.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            {!profile?.isComplete && (
                                <Link
                                    href="/onboarding"
                                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-100 transition-all flex items-center gap-2"
                                >
                                    <AlertCircle className="w-5 h-5" /> Finish Onboarding
                                </Link>
                            )}
                            <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all relative">
                                <Clock className="w-5 h-5 text-slate-600" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
                            </button>
                        </div>
                    </header>

                    {/* Progress Overview */}
                    <section className="mb-10">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-2 bg-white border border-slate-200 rounded-2xl shadow-sm">
                            {stages.map((stage, idx) => (
                                <div
                                    key={stage.id}
                                    className={cn(
                                        "flex items-center gap-3 p-4 rounded-xl transition-all",
                                        idx === currentStageIndex ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-[1.02]" : "text-slate-400"
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
                                        idx === currentStageIndex ? "bg-white/20" : "bg-slate-100"
                                    )}>
                                        {idx + 1}
                                    </div>
                                    <span className="font-bold text-sm">{stage.name}</span>
                                    {idx < currentStageIndex && <CheckCircle2 className="w-4 h-4 ml-auto text-emerald-400" />}
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column (2/3) */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* AI Recommendations Call to Action */}
                            {!profile?.isComplete ? (
                                <div className="bg-indigo-600 rounded-3xl p-8 relative overflow-hidden group">
                                    <div className="relative z-10">
                                        <h2 className="text-2xl font-bold text-white mb-4">Complete Your Profile</h2>
                                        <p className="text-indigo-100 mb-6 max-w-md">Our AI Counsellor needs your academic and budget details to recommend the best universities for you.</p>
                                        <Link href="/onboarding" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-slate-50 transition-all">
                                            Start Onboarding <ChevronRight className="w-5 h-5" />
                                        </Link>
                                    </div>
                                    <Zap className="absolute -right-10 -bottom-10 w-64 h-64 text-white/10 rotate-12 group-hover:scale-110 transition-transform" />
                                </div>
                            ) : (
                                <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                            <Trophy className="w-6 h-6 text-amber-500" /> My Shortlist
                                        </h2>
                                        <Link href="/discovery" className="text-indigo-600 font-bold text-sm hover:underline">View All</Link>
                                    </div>

                                    {shortlisted?.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {shortlisted.map((item: any) => (
                                                <div key={item.id} className="p-4 border border-slate-100 rounded-2xl hover:border-indigo-100 transition-all group">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center">
                                                            <GraduationCap className="w-6 h-6 text-slate-400" />
                                                        </div>
                                                        <div className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                                            {item.university.country}
                                                        </div>
                                                    </div>
                                                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{item.university.name}</h3>
                                                    <p className="text-slate-500 text-xs mb-4 line-clamp-1">{item.university.location}</p>
                                                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                                                        <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {item.university.acceptanceRate}%</span>
                                                        <span className="flex items-center gap-1">💰 ${item.university.tuition}/yr</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                            <Search className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                                            <p className="text-slate-500 font-medium mb-4">No universities shortlisted yet.</p>
                                            <Link href="/discovery" className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-indigo-600 hover:bg-slate-50 transition-all">
                                                Discover Now
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* To-Do Section */}
                            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                        <Target className="w-6 h-6 text-indigo-500" /> AI To-Do List
                                    </h2>
                                    <button className="p-2 hover:bg-slate-50 rounded-lg transition-all"><Plus className="w-5 h-5 text-slate-400" /></button>
                                </div>

                                {tasks?.length > 0 ? (
                                    <div className="space-y-4">
                                        {tasks.map((task: any) => (
                                            <div key={task.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all group">
                                                <button className={cn(
                                                    "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                                                    task.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-200 group-hover:border-indigo-300"
                                                )}>
                                                    {task.completed && <CheckCircle2 className="w-4 h-4" />}
                                                </button>
                                                <div className="flex-1">
                                                    <h4 className={cn("font-bold text-sm", task.completed ? "text-slate-400 line-through" : "text-slate-900")}>{task.title}</h4>
                                                    <p className="text-xs text-slate-400">{task.description}</p>
                                                </div>
                                                <div className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md uppercase">
                                                    {task.status}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10">
                                        <p className="text-slate-500 text-sm italic font-medium">As you progress, the AI will generate tasks for you.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column (1/3) */}
                        <div className="space-y-8">
                            {/* Profile Strength Card */}
                            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                                <h3 className="font-bold text-slate-900 mb-6">Profile Strength</h3>

                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-2">
                                            <span className="text-slate-500 uppercase tracking-wider">Academics</span>
                                            <span className={cn(
                                                "uppercase tracking-wider",
                                                profile?.academicStrength === "strong" ? "text-emerald-500" : profile?.academicStrength === "average" ? "text-amber-500" : "text-slate-400"
                                            )}>{profile?.academicStrength || "Not Rated"}</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: profile?.academicStrength === "strong" ? "90%" : profile?.academicStrength === "average" ? "60%" : "20%" }}
                                                className={cn(
                                                    "h-full rounded-full",
                                                    profile?.academicStrength === "strong" ? "bg-emerald-500" : profile?.academicStrength === "average" ? "bg-amber-500" : "bg-slate-300"
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-2">
                                            <span className="text-slate-500 uppercase tracking-wider">Exam Readiness</span>
                                            <span className={cn(
                                                "uppercase tracking-wider",
                                                profile?.ieltsStatus === "completed" ? "text-emerald-500" : "text-slate-400"
                                            )}>{profile?.ieltsStatus === "completed" ? "Ready" : "In Progress"}</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: profile?.ieltsStatus === "completed" ? "100%" : profile?.ieltsStatus === "in_progress" ? "50%" : "10%" }}
                                                className={cn(
                                                    "h-full rounded-full",
                                                    profile?.ieltsStatus === "completed" ? "bg-emerald-500" : "bg-indigo-400"
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-2">
                                            <span className="text-slate-500 uppercase tracking-wider">SOP Status</span>
                                            <span className={cn(
                                                "uppercase tracking-wider text-slate-400"
                                            )}>{profile?.sopStatus?.replace('_', ' ') || "Not Started"}</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: profile?.sopStatus === "ready" ? "100%" : profile?.sopStatus === "draft" ? "60%" : "10%" }}
                                                className="h-full bg-pink-400 rounded-full"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                        <AlertCircle className="w-3 h-3 inline mr-1 text-slate-400" />
                                        Complete your GRE and finalize your SOP to boost your application strength by a estimated 35%.
                                    </p>
                                </div>
                            </div>

                            {/* Profile Details Minimal */}
                            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                                <h3 className="font-bold text-slate-900 mb-6">Profile Details</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                                            <GraduationCap className="w-4 h-4 text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Intended Degree</p>
                                            <p className="text-sm font-bold text-slate-700">{profile?.intendedDegree || "—"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                                            <MapPin className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preferences</p>
                                            <p className="text-sm font-bold text-slate-700">{profile?.preferredCountries?.join(', ') || "—"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                                            <DollarSign className="w-4 h-4 text-amber-600" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Budget p.a.</p>
                                            <p className="text-sm font-bold text-slate-700">${profile?.budgetMin?.toLocaleString()} - ${profile?.budgetMax?.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    href="/onboarding"
                                    className="block mt-6 text-center py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all"
                                >
                                    Edit Profile
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
