"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ChevronLeft,
    Award,
    TrendingUp,
    Sparkles,
    CheckCircle2,
    DollarSign,
    MapPin,
    FileText,
    Globe,
    Compass,
    LayoutDashboard,
    User,
    Search,
    BookOpen,
    Filter,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function ScholarshipsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [scholarships, setScholarships] = useState<any[]>([]);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            fetchData();
        }
    }, [status, router]);

    const fetchData = async () => {
        try {
            const [sRes, pRes] = await Promise.all([
                fetch("/api/scholarships"),
                fetch("/api/profile")
            ]);
            const sData = await sRes.json();
            const pData = await pRes.json();
            setScholarships(sData.scholarships);
            setProfile(pData.profile);
        } catch (error) {
            console.error("Failed to fetch scholarship data:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredScholarships = scholarships.filter(schol => {
        const matchesSearch = schol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            schol.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
            schol.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === "all" || schol.type === filterType;
        return matchesSearch && matchesFilter;
    });

    if (status === "loading" || loading) {
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
                            className="flex items-center gap-4 px-5 py-4 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all font-bold text-sm"
                        >
                            <FileText className="w-5 h-5 text-slate-400" /> SOP Analyzer Lab
                        </Link>
                        <Link
                            href="/scholarships"
                            className="flex items-center gap-4 px-5 py-4 bg-indigo-50 border border-indigo-100/50 text-indigo-600 rounded-2xl transition-all font-black text-sm shadow-sm"
                        >
                            <Award className="w-5 h-5 text-indigo-600" /> Scholarships
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
                    
                    {/* Upper layout */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push("/dashboard")}
                                className="p-2 hover:bg-white rounded-xl transition-all text-slate-500 shadow-sm border border-slate-100 bg-white lg:hidden"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-full font-black text-[10px] uppercase tracking-wider mb-2 inline-block">Personalized Matching Active</span>
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Scholarship <span className="text-indigo-600">Recommender</span></h1>
                            </div>
                        </div>

                        {/* Search field */}
                        <div className="relative w-full md:max-w-xs group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by name or country..."
                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-xs font-bold text-slate-900 shadow-sm placeholder:text-slate-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Student Statistics Header */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
                        <div className="relative z-10 flex flex-col justify-center">
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Evaluating Profile</p>
                            <h3 className="text-xl font-black tracking-tight">{session?.user?.name || "Student"}</h3>
                            <p className="text-xs text-slate-400 leading-relaxed font-semibold mt-1">Match scores calculated dynamically against eligibility thresholds.</p>
                        </div>
                        <div className="relative z-10 p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Target Country & GPA</p>
                                <p className="text-sm font-black mt-0.5">{profile?.preferredCountries?.join(", ") || "Global"} — GPA {profile?.gpa || "N/A"}</p>
                            </div>
                        </div>
                        <div className="relative z-10 p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Financial Context</p>
                                <p className="text-sm font-black mt-0.5 uppercase">{profile?.fundingPlan?.replace('-', ' ') || "Self-Funded"}</p>
                            </div>
                        </div>
                        <TrendingUp className="absolute -right-10 -bottom-10 w-40 h-40 text-white/5 -rotate-12" />
                    </div>

                    {/* Filter categories tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                        {[
                            { label: "All Fits", id: "all" },
                            { label: "Global Programs", id: "global" },
                            { label: "Merit-Based", id: "merit" },
                            { label: "Need-Based", id: "need-based" }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setFilterType(tab.id)}
                                className={cn(
                                    "px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer",
                                    filterType === tab.id
                                        ? "bg-slate-900 text-white shadow-lg"
                                        : "bg-white text-slate-500 hover:text-slate-900 border border-slate-200/60"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Scholarships Grid List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <AnimatePresence>
                            {filteredScholarships.map((schol) => {
                                const isHighMatch = schol.matchScore >= 80;

                                return (
                                    <motion.div
                                        key={schol.id}
                                        layout
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileHover={{ y: -4 }}
                                        className={cn(
                                            "bg-white border rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden flex flex-col justify-between min-h-[360px]",
                                            isHighMatch
                                                ? "border-indigo-400/30 ring-1 ring-indigo-400/20 shadow-[0_0_40px_rgba(129,140,248,0.06)]"
                                                : "border-slate-200/80 hover:border-indigo-200"
                                        )}
                                    >
                                        <div className="space-y-6">
                                            {/* Header badge & Match Score */}
                                            <div className="flex justify-between items-start">
                                                <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-black uppercase text-slate-500 tracking-wider">
                                                    {schol.type}
                                                </div>
                                                <div className={cn(
                                                    "px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border text-[10px] font-black uppercase tracking-wider",
                                                    isHighMatch ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-indigo-50 border-indigo-100 text-indigo-700"
                                                )}>
                                                    <Sparkles className="w-3.5 h-3.5" />
                                                    <span>{schol.matchScore}% Match</span>
                                                </div>
                                            </div>

                                            {/* Scholarship Details */}
                                            <div>
                                                <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight mb-2">{schol.name}</h3>
                                                <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-wider">
                                                    <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-indigo-400" /> {schol.country}</div>
                                                    <span>•</span>
                                                    <div className="flex items-center gap-1"><DollarSign className="w-3 h-3 text-emerald-400" /> ${schol.amount.toLocaleString()} USD</div>
                                                </div>
                                            </div>

                                            <p className="text-xs text-slate-500 leading-relaxed font-semibold line-clamp-3">{schol.description}</p>

                                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Requirement Thresholds</p>
                                                <p className="text-xs text-slate-700 font-bold leading-normal">{schol.eligibility}</p>
                                            </div>
                                        </div>

                                        {schol.website && (
                                            <a
                                                href={schol.website.startsWith('http') ? schol.website : `https://${schol.website}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full mt-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-wider text-center flex items-center justify-center gap-2 hover:bg-indigo-600 shadow-lg shadow-slate-100 transition-all active:scale-95"
                                            >
                                                <Globe className="w-3.5 h-3.5" /> Access Portal
                                            </a>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {filteredScholarships.length === 0 && (
                        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-12 text-center text-slate-400 shadow-sm">
                            <Award className="w-12 h-12 text-slate-200 mx-auto mb-4 animate-bounce" />
                            <h3 className="text-base font-black text-slate-800 tracking-tight mb-1">No Matching Scholarships</h3>
                            <p className="text-xs text-slate-400 font-medium">Try resetting your filters or adjusting your target search term.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
