"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Search,
    Filter,
    ChevronLeft,
    GraduationCap,
    MapPin,
    DollarSign,
    Target,
    AlertCircle,
    CheckCircle2,
    Loader2,
    Heart,
    Lock,
    Info,
    Sparkles,
    Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { calculateMatchScore, getFitCategory } from "@/lib/matching-engine";
import UniversityAnalysisModal from "@/components/UniversityAnalysisModal";

export default function DiscoveryPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [universities, setUniversities] = useState<any[]>([]);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: "",
        country: "All",
        budget: 100000,
    });
    const [shortlistingId, setShortlistingId] = useState<string | null>(null);
    const [selectedUni, setSelectedUni] = useState<any>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            fetchData();
        }
    }, [status, router]);

    const fetchData = async () => {
        try {
            const [uRes, pRes] = await Promise.all([
                fetch("/api/universities"),
                fetch("/api/profile")
            ]);
            const uData = await uRes.json();
            const pData = await pRes.json();
            setUniversities(uData.universities);
            setProfile(pData.profile);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleShortlist = async (uniId: string) => {
        setShortlistingId(uniId);
        try {
            const res = await fetch("/api/shortlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ universityId: uniId }),
            });
            if (res.ok) {
                fetchData();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setShortlistingId(null);
        }
    };

    const filteredUniversities = universities.filter(u => {
        const matchesSearch = (u.name?.toLowerCase() || "").includes(filters.search.toLowerCase()) ||
            (u.location?.toLowerCase() || "").includes(filters.search.toLowerCase());
        const matchesCountry = filters.country === "All" || u.country === filters.country;
        const matchesBudget = u.tuitionMax <= filters.budget;
        return matchesSearch && matchesCountry && matchesBudget;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] selection:bg-indigo-100 selection:text-indigo-700">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push("/dashboard")}
                                className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-500 shadow-sm"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <h1 className="text-xl font-black text-slate-900 tracking-tight">Discovery <span className="text-indigo-600">Engine</span></h1>
                        </div>

                        <div className="flex flex-1 max-w-xl relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by name or city..."
                                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-slate-900 shadow-sm"
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <aside className="lg:col-span-1 space-y-6">
                        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
                            <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Filter className="w-4 h-4 text-indigo-600" /> Control Panel
                            </h3>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Country</label>
                                    <select
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                        value={filters.country}
                                        onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                                    >
                                        <option>All</option>
                                        <option>USA</option>
                                        <option>UK</option>
                                        <option>Canada</option>
                                        <option>Australia</option>
                                        <option>Germany</option>
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Max Budget</label>
                                        <span className="text-indigo-600 font-bold text-xs">${filters.budget.toLocaleString()}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="10000"
                                        max="100000"
                                        step="5000"
                                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                        value={filters.budget}
                                        onChange={(e) => setFilters({ ...filters, budget: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => setFilters({ search: "", country: "All", budget: 100000 })}
                                className="w-full mt-8 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 rounded-xl hover:bg-slate-50 hover:text-slate-600 transition-all"
                            >
                                Reset Configuration
                            </button>
                        </div>

                        {/* Profile Analysis Card */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-indigo-100">
                            <div className="relative z-10">
                                <Sparkles className="w-8 h-8 mb-4 text-indigo-400 animate-pulse" />
                                <h4 className="text-lg font-black mb-2 tracking-tight">Match Probability Active</h4>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium">Neural engine is recalculating fit scores based on your <span className="text-indigo-400">{profile?.gpa || '3.5+'} GPA</span> and <span className="text-indigo-400">${profile?.budgetMax?.toLocaleString() || 'Budget'}</span>.</p>
                            </div>
                            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-indigo-500/20 blur-[50px] rounded-full group-hover:scale-150 transition-transform duration-700" />
                        </div>
                    </aside>

                    {/* Results Grid */}
                    <div className="lg:col-span-3">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">{filteredUniversities.length} Institutions Found</h2>
                            <div className="flex gap-2">
                                <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-600">ALPHA SORT</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <AnimatePresence>
                                {filteredUniversities.map((uni) => {
                                    const matchScore = calculateMatchScore(profile, uni);
                                    const category = getFitCategory(matchScore);
                                    const isHighMatch = matchScore > 85;

                                    return (
                                        <motion.div
                                            key={uni.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            whileHover={{ y: -5 }}
                                            className={cn(
                                                "bg-white border rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden",
                                                isHighMatch
                                                    ? "border-indigo-400/30 ring-1 ring-indigo-400/20 shadow-[0_0_40px_rgba(129,140,248,0.1)]"
                                                    : "border-slate-200 hover:border-indigo-200"
                                            )}
                                        >
                                            {/* Match Score Indicator (Top Left) */}
                                            <div className={cn(
                                                "absolute top-0 left-0 w-2 h-full bg-slate-50 transition-all",
                                                isHighMatch ? "bg-indigo-600" : "group-hover:bg-indigo-600"
                                            )} />

                                            {isHighMatch && (
                                                <div className="absolute -top-3 -right-3 bg-indigo-600 text-white p-2 rounded-xl shadow-lg z-10 animate-bounce">
                                                    <Sparkles className="w-4 h-4" />
                                                </div>
                                            )}

                                            <div className="flex justify-between items-start mb-8">
                                                <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center group-hover:bg-indigo-50 transition-colors shadow-inner">
                                                    <GraduationCap className="w-8 h-8 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    {/* PROBABILITY PILL */}
                                                    <div className={cn(
                                                        "px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm border",
                                                        category === 'Safe' ? "bg-emerald-50 border-emerald-100 text-emerald-700" :
                                                            category === 'Reach' ? "bg-rose-50 border-rose-100 text-rose-700" :
                                                                "bg-indigo-50 border-indigo-100 text-indigo-700"
                                                    )}>
                                                        <Target className="w-4 h-4" />
                                                        <span className="text-xs font-black uppercase tracking-widest">{category} {matchScore}%</span>
                                                    </div>
                                                    <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-full uppercase tracking-wider">
                                                        {uni.country}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{uni.name}</h3>
                                                {uni.website && (
                                                    <a
                                                        href={uni.website.startsWith('http') ? uni.website : `https://${uni.website}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-1.5 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-100 hover:text-indigo-600 transition-all shadow-sm"
                                                        title="Visit Website"
                                                    >
                                                        <Globe className="w-4 h-4" />
                                                    </a>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 text-slate-400 text-xs font-bold uppercase tracking-wide mb-8">
                                                <MapPin className="w-3 h-3 text-indigo-400" /> {uni.location}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-8">
                                                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tuition Fee</p>
                                                    <p className="text-base font-black text-slate-700">${uni.tuitionMax.toLocaleString()}<span className="text-[10px] text-slate-400 ml-1">/YR</span></p>
                                                </div>
                                                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Acceptance</p>
                                                    <p className="text-base font-black text-slate-700">{uni.acceptanceRate}%</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleShortlist(uni.id)}
                                                    disabled={shortlistingId === uni.id}
                                                    className={cn(
                                                        "flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95",
                                                        uni.isShortlisted
                                                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100"
                                                            : "bg-slate-900 text-white hover:bg-indigo-600 shadow-xl shadow-slate-100"
                                                    )}
                                                >
                                                    {shortlistingId === uni.id ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                                        uni.isShortlisted ? <CheckCircle2 className="w-4 h-4" /> : <Heart className="w-4 h-4" />
                                                    )}
                                                    {uni.isShortlisted ? "Tracked" : "Track Uni"}
                                                </button>
                                                <button
                                                    onClick={() => setSelectedUni(uni)}
                                                    className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-100 shadow-sm active:scale-95"
                                                >
                                                    <Info className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </main>

            <UniversityAnalysisModal
                isOpen={!!selectedUni}
                onClose={() => setSelectedUni(null)}
                university={selectedUni}
                profile={profile}
            />
        </div>
    );
}
