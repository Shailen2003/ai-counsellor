"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ChevronLeft,
    User,
    GraduationCap,
    MapPin,
    DollarSign,
    FileText,
    Trophy,
    Settings,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            fetchProfile();
        }
    }, [status]);

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/profile");
            const data = await res.json();
            setProfile(data.profile);
        } catch (error) {
            console.error("Failed to fetch profile:", error);
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

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-12">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-10">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="p-2 hover:bg-white rounded-xl transition-all text-slate-500 shadow-sm"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Profile</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar Area */}
                    <div className="space-y-6">
                        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 text-center shadow-sm">
                            <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-100">
                                <User className="w-12 h-12 text-white" />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 mb-1">{session?.user?.name}</h2>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-6">{session?.user?.email}</p>

                            <Link
                                href="/onboarding"
                                className="block w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-md shadow-slate-200"
                            >
                                Edit Profile
                            </Link>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
                            <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-6">Profile Strength</h3>
                            <div className="space-y-4">
                                {[
                                    { label: "Academics", value: profile?.academicStrength || "Basic", color: "bg-indigo-500" },
                                    { label: "Exams", value: profile?.examStrength || "Basic", color: "bg-emerald-500" },
                                    { label: "SOP", value: profile?.sopStrength || "Basic", color: "bg-pink-500" },
                                ].map((s, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                                            <span className="text-slate-400">{s.label}</span>
                                            <span className="text-slate-900">{s.value}</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={cn("h-full rounded-full transition-all duration-1000", s.color)}
                                                style={{ width: s.value === 'strong' ? '90%' : s.value === 'average' ? '60%' : '25%' }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Details Grid */}
                        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
                            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                <FileText className="w-6 h-6 text-indigo-600" /> Academic Background
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Current Education</p>
                                    <p className="font-bold text-slate-900">{profile?.educationLevel || "Not provided"}</p>
                                    <p className="text-sm text-slate-500">{profile?.degree}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Major / Subject</p>
                                    <p className="font-bold text-slate-900">{profile?.major || "Not provided"}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Graduation Year</p>
                                    <p className="font-bold text-slate-900">{profile?.graduationYear || "—"}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">GPA / Score</p>
                                    <p className="font-bold text-slate-900">{profile?.gpa || "—"}</p>
                                </div>
                            </div>

                            <hr className="my-10 border-slate-100" />

                            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                <Target className="w-6 h-6 text-emerald-600" /> Study Goals
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Intended Degree</p>
                                    <p className="font-bold text-slate-900">{profile?.intendedDegree || "Not set"}</p>
                                    <p className="text-sm text-slate-500">{profile?.fieldOfStudy}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Target Intake</p>
                                    <p className="font-bold text-slate-900">{profile?.targetIntakeYear || "—"}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Country Preferences</p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {profile?.preferredCountries?.map((c: string) => (
                                            <span key={c} className="px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold text-slate-600">
                                                {c}
                                            </span>
                                        )) || <span className="text-slate-400 italic font-medium">No countries selected</span>}
                                    </div>
                                </div>
                            </div>

                            <hr className="my-10 border-slate-100" />

                            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                <DollarSign className="w-6 h-6 text-amber-500" /> Budget & Funding
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Annual Budget Range</p>
                                    <p className="font-bold text-slate-900">${profile?.budgetMin?.toLocaleString()} - ${profile?.budgetMax?.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Funding Method</p>
                                    <p className="font-bold text-slate-900 uppercase text-xs tracking-wider">{profile?.fundingPlan?.replace('-', ' ')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Re-using styles from dashboard and onboarding for consistency
function Target({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
        </svg>
    );
}
