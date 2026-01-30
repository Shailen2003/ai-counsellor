"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Target,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    GraduationCap,
    DollarSign,
    MapPin,
    Zap,
    Globe
} from "lucide-react";
import { calculateMatchScore, getFitCategory } from "@/lib/matching-engine";
import { cn } from "@/lib/utils";

interface UniversityAnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
    university: any;
    profile: any;
}

export default function UniversityAnalysisModal({ isOpen, onClose, university, profile }: UniversityAnalysisModalProps) {
    if (!university) return null;

    const score = calculateMatchScore(profile, university);
    const category = getFitCategory(score);

    const matchBreakdown = [
        {
            label: "Academic Alignment",
            value: profile?.gpa ? `${profile.gpa} / ${university.minGPA}` : "Pending",
            status: profile?.gpa >= university.minGPA ? "Optimal" : "Gap Detected",
            score: profile?.gpa >= university.minGPA ? 100 : 40,
            icon: GraduationCap
        },
        {
            label: "Financial Viability",
            value: `$${university.tuitionMax.toLocaleString()}`,
            status: profile?.budgetMax >= university.tuitionMax ? "Covered" : "Budget Lock",
            score: profile?.budgetMax >= university.tuitionMax ? 100 : 30,
            icon: DollarSign
        },
        {
            label: "Admission Gravity",
            value: `${university.acceptanceRate}%`,
            status: university.acceptanceRate < 15 ? "High Resistance" : "Target Range",
            score: 100 - university.acceptanceRate,
            icon: Target
        }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-[3rem] shadow-2xl overflow-y-auto border border-slate-200 custom-scrollbar"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-8 right-8 p-2 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all z-10"
                        >
                            <X className="w-5 h-5 text-slate-400" />
                        </button>

                        <div className="p-10 lg:p-12">
                            {/* Header */}
                            <div className="mb-10">
                                <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-4 inline-block">Admission Intelligence</span>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">{university.name}</h2>
                                <p className="text-slate-400 font-bold text-sm flex items-center gap-2"><MapPin className="w-4 h-4 text-indigo-400" /> {university.location}</p>
                            </div>

                            {/* Probability Engine */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                <div className="md:col-span-2 bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl">
                                    <div className="relative z-10">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Neural Match Index</p>
                                        <div className="flex items-end gap-3 mb-6">
                                            <span className="text-6xl font-black leading-none">{score}%</span>
                                            <span className={cn(
                                                "px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest mb-1 shadow-sm",
                                                category === "Safe" ? "bg-emerald-500" : category === "Reach" ? "bg-rose-500" : "bg-indigo-500"
                                            )}>{category}</span>
                                        </div>
                                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${score}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className="h-full bg-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.8)]"
                                            />
                                        </div>
                                    </div>
                                    <TrendingUp className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5 -rotate-12" />
                                </div>

                                <div className="bg-indigo-50 rounded-[2rem] p-8 flex flex-col justify-center border border-indigo-100">
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Strategy</p>
                                    <p className="text-sm font-black text-slate-900 leading-snug">
                                        {score > 80 ? "Priority Target: High ROI potential." :
                                            score > 50 ? "Balanced Play: Requires strong SOP." :
                                                "Reach Asset: Focus on research papers."}
                                    </p>
                                </div>
                            </div>

                            {/* Factor Breakdown */}
                            <div className="space-y-6 mb-12">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Fit Factor Analysis</h3>
                                {matchBreakdown.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-6 p-2 rounded-2xl hover:bg-slate-50 transition-all">
                                        <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 shadow-sm">
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-end mb-2">
                                                <h4 className="text-sm font-black text-slate-900">{item.label}</h4>
                                                <span className="text-[10px] font-black text-slate-400">{item.value}</span>
                                            </div>
                                            <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${item.score}%` }}
                                                    className={cn(
                                                        "h-full rounded-full",
                                                        item.score > 80 ? "bg-emerald-400" : item.score > 30 ? "bg-amber-400" : "bg-rose-400"
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "min-w-[80px] text-right text-[10px] font-black uppercase tracking-widest",
                                            item.score > 80 ? "text-emerald-600" : item.score > 30 ? "text-amber-600" : "text-rose-600"
                                        )}>
                                            {item.status}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Action Block */}
                            <div className="flex gap-4">
                                <button className="flex-1 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 transition-all active:scale-95 flex items-center justify-center gap-2">
                                    <Zap className="w-4 h-4 fill-current" /> Lock Selection
                                </button>
                                {university.website && (
                                    <a
                                        href={university.website.startsWith('http') ? university.website : `https://${university.website}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 py-5 bg-white text-slate-900 border border-slate-200 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-sm hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-2 text-center"
                                    >
                                        Visit Website
                                    </a>
                                )}
                                <button
                                    onClick={onClose}
                                    className="px-8 py-5 bg-slate-50 text-slate-400 border border-slate-100 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-95"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
