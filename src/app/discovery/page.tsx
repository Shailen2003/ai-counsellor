"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
    Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
                // Refresh data or update local state
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
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push("/dashboard")}
                                className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-500"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <h1 className="text-xl font-bold text-slate-900">Discover Universities</h1>
                        </div>

                        <div className="flex flex-1 max-w-xl relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name or city..."
                                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-slate-900"
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
                    <aside className="lg:col-span-1 space-y-8">
                        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Filter className="w-4 h-4 text-indigo-600" /> Filters
                            </h3>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Country</label>
                                    <select
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
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
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Max Budget (${filters.budget.toLocaleString()})</label>
                                    <input
                                        type="range"
                                        min="10000"
                                        max="100000"
                                        step="5000"
                                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                        value={filters.budget}
                                        onChange={(e) => setFilters({ ...filters, budget: parseInt(e.target.value) })}
                                    />
                                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                                        <span>$10k</span>
                                        <span>$100k+</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setFilters({ search: "", country: "All", budget: 100000 })}
                                className="w-full mt-8 py-3 text-xs font-bold text-indigo-600 border border-indigo-100 rounded-xl hover:bg-indigo-50 transition-all"
                            >
                                Reset Filters
                            </button>
                        </div>

                        {/* Profile Match Info */}
                        <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-100">
                            <GraduationCap className="w-8 h-8 mb-4 text-indigo-200" />
                            <h4 className="font-bold mb-2">Smart Match Active</h4>
                            <p className="text-xs text-indigo-100 leading-relaxed">We are automatically highlighting universities that match your {profile?.major} background and ${profile?.budgetMax} budget.</p>
                        </div>
                    </aside>

                    {/* Results Grid */}
                    <div className="lg:col-span-3">
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-sm font-bold text-slate-500">{filteredUniversities.length} Universities Found</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AnimatePresence>
                                {filteredUniversities.map((uni) => (
                                    <motion.div
                                        key={uni.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                                                <GraduationCap className="w-8 h-8 text-slate-400 group-hover:text-indigo-600" />
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                                    {uni.country}
                                                </span>
                                                {uni.acceptanceRate < 15 && (
                                                    <span className="px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3" /> Competitive
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{uni.name}</h3>
                                        <div className="flex items-center gap-1 text-slate-500 text-xs mb-6">
                                            <MapPin className="w-3 h-3" /> {uni.location}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                            <div className="p-3 bg-slate-50 rounded-2xl">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Tuition/Yr</p>
                                                <p className="text-sm font-bold text-slate-700">${uni.tuitionMax.toLocaleString()}</p>
                                            </div>
                                            <div className="p-3 bg-slate-50 rounded-2xl">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Acceptance</p>
                                                <p className="text-sm font-bold text-slate-700">{uni.acceptanceRate}%</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleShortlist(uni.id)}
                                                disabled={shortlistingId === uni.id}
                                                className={cn(
                                                    "flex-1 py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2",
                                                    uni.isShortlisted
                                                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                                        : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100"
                                                )}
                                            >
                                                {shortlistingId === uni.id ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                                    uni.isShortlisted ? <CheckCircle2 className="w-4 h-4" /> : <Heart className="w-4 h-4" />
                                                )}
                                                {uni.isShortlisted ? "Shortlisted" : "Shortlist"}
                                            </button>
                                            <button className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-100 hover:text-slate-600 transition-all">
                                                <Info className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
