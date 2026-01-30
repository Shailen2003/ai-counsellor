"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    BookOpen,
    Target,
    Wallet,
    FileText,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
    { title: "Academics", icon: BookOpen },
    { title: "Goals", icon: Target },
    { title: "Budget", icon: Wallet },
    { title: "Readiness", icon: FileText },
];

export default function OnboardingPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        // Academics
        educationLevel: "Bachelor's",
        degree: "",
        major: "",
        graduationYear: new Date().getFullYear().toString(),
        gpa: "",
        // Goals
        intendedDegree: "Master's",
        fieldOfStudy: "",
        targetIntakeYear: (new Date().getFullYear() + 1).toString(),
        preferredCountries: [] as string[],
        // Budget
        budgetMin: "10000",
        budgetMax: "50000",
        fundingPlan: "self-funded",
        // Exams
        ieltsStatus: "not_started",
        ieltsScore: "",
        greStatus: "not_started",
        greScore: "",
        sopStatus: "not_started",
    });

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    const handleCountryToggle = (country: string) => {
        setFormData(prev => ({
            ...prev,
            preferredCountries: prev.preferredCountries.includes(country)
                ? prev.preferredCountries.filter(c => c !== country)
                : [...prev.preferredCountries, country]
        }));
    };

    const nextStep = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            const res = await fetch("/api/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to save profile");
            }

            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
            setIsSubmitting(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Current Education Level</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-slate-900 bg-white"
                                    value={formData.educationLevel}
                                    onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                                >
                                    <option>High School</option>
                                    <option>Bachelor's</option>
                                    <option>Master's</option>
                                    <option>Doctorate</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Graduation Year</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-slate-900 bg-white"
                                    value={formData.graduationYear}
                                    onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Degree/Certificate Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. B.Tech in Computer Science"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-slate-900 bg-white placeholder:text-slate-400"
                                    value={formData.degree}
                                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Major/Subject</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Computer Science"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-slate-900 bg-white placeholder:text-slate-400"
                                    value={formData.major}
                                    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">GPA / Percentage (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 3.8 or 85%"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-slate-900 bg-white placeholder:text-slate-400"
                                    value={formData.gpa}
                                    onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                                />
                            </div>
                        </div>
                    </motion.div>
                );
            case 1:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Intended Degree</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-slate-900 bg-white"
                                    value={formData.intendedDegree}
                                    onChange={(e) => setFormData({ ...formData, intendedDegree: e.target.value })}
                                >
                                    <option>Bachelor's</option>
                                    <option>Master's</option>
                                    <option>MBA</option>
                                    <option>PhD</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Field of Study</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Data Science"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-slate-900 bg-white placeholder:text-slate-400"
                                    value={formData.fieldOfStudy}
                                    onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Target Intake Year</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-slate-900 bg-white"
                                    value={formData.targetIntakeYear}
                                    onChange={(e) => setFormData({ ...formData, targetIntakeYear: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700">Preferred Countries</label>
                            <div className="flex flex-wrap gap-3">
                                {["USA", "UK", "Canada", "Australia", "Germany", "France", "Ireland"].map(country => (
                                    <button
                                        key={country}
                                        onClick={() => handleCountryToggle(country)}
                                        className={cn(
                                            "px-4 py-2 rounded-full border transition-all text-sm font-medium",
                                            formData.preferredCountries.includes(country)
                                                ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200"
                                                : "bg-white border-gray-200 text-gray-600 hover:border-indigo-300"
                                        )}
                                    >
                                        {country}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Min Annual Budget ($)</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-slate-900 bg-white"
                                    value={formData.budgetMin}
                                    onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Max Annual Budget ($)</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-slate-900 bg-white"
                                    value={formData.budgetMax}
                                    onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700">Funding Plan</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { id: "self-funded", label: "Self-Funded" },
                                    { id: "scholarship", label: "Scholarship" },
                                    { id: "loan", label: "Education Loan" },
                                ].map(plan => (
                                    <button
                                        key={plan.id}
                                        onClick={() => setFormData({ ...formData, fundingPlan: plan.id })}
                                        className={cn(
                                            "px-4 py-4 rounded-xl border text-center transition-all",
                                            formData.fundingPlan === plan.id
                                                ? "bg-indigo-50 border-indigo-600 text-indigo-700 ring-1 ring-indigo-600"
                                                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                                        )}
                                    >
                                        {plan.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        {/* IELTS/TOEFL Section */}
                        <div className="space-y-4 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                            <div className="flex items-center gap-3 mb-2">
                                <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                                <h3 className="font-semibold text-gray-900">English Proficiency (IELTS/TOEFL)</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <select
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 bg-white"
                                    value={formData.ieltsStatus}
                                    onChange={(e) => setFormData({ ...formData, ieltsStatus: e.target.value })}
                                >
                                    <option value="not_started">Not Started</option>
                                    <option value="in_progress">Preparation in Progress</option>
                                    <option value="completed">Completed / Have Results</option>
                                </select>
                                {formData.ieltsStatus === "completed" && (
                                    <input
                                        type="text"
                                        placeholder="Overall Band Score"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 bg-white placeholder:text-slate-400"
                                        value={formData.ieltsScore}
                                        onChange={(e) => setFormData({ ...formData, ieltsScore: e.target.value })}
                                    />
                                )}
                            </div>
                        </div>

                        {/* GRE/GMAT Section */}
                        <div className="space-y-4 p-6 bg-purple-50/50 rounded-2xl border border-purple-100">
                            <div className="flex items-center gap-3 mb-2">
                                <CheckCircle2 className="w-5 h-5 text-purple-600" />
                                <h3 className="font-semibold text-gray-900">Standardized Test (GRE/GMAT)</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <select
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 bg-white"
                                    value={formData.greStatus}
                                    onChange={(e) => setFormData({ ...formData, greStatus: e.target.value })}
                                >
                                    <option value="not_started">Not Started</option>
                                    <option value="in_progress">Preparation in Progress</option>
                                    <option value="completed">Completed / Have Results</option>
                                    <option value="not_required">Not Required</option>
                                </select>
                                {formData.greStatus === "completed" && (
                                    <input
                                        type="number"
                                        placeholder="Total Score"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 bg-white placeholder:text-slate-400"
                                        value={formData.greScore}
                                        onChange={(e) => setFormData({ ...formData, greScore: e.target.value })}
                                    />
                                )}
                            </div>
                        </div>

                        {/* SOP Section */}
                        <div className="space-y-4 p-6 bg-pink-50/50 rounded-2xl border border-pink-100">
                            <div className="flex items-center gap-3 mb-2">
                                <CheckCircle2 className="w-5 h-5 text-pink-600" />
                                <h3 className="font-semibold text-gray-900">Statement of Purpose (SOP)</h3>
                            </div>
                            <select
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 outline-none text-slate-900 bg-white"
                                value={formData.sopStatus}
                                onChange={(e) => setFormData({ ...formData, sopStatus: e.target.value })}
                            >
                                <option value="not_started">Not Started</option>
                                <option value="draft">Draft in Progress</option>
                                <option value="ready">Ready / Completed</option>
                            </select>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-6 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        Build Your Decision Profile
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Your data powers the AI Counsellor's logic. Be as accurate as possible for the best results.
                    </p>
                </div>

                {/* Progress bar */}
                <div className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        {STEPS.map((step, idx) => (
                            <div key={idx} className="flex flex-col items-center relative z-10">
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300",
                                    idx <= currentStep
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                                        : "bg-white text-gray-400 border border-gray-200"
                                )}>
                                    <step.icon className="w-6 h-6" />
                                </div>
                                <span className={cn(
                                    "text-xs font-semibold mt-3 transition-all",
                                    idx <= currentStep ? "text-indigo-600" : "text-gray-400"
                                )}>
                                    {step.title}
                                </span>
                            </div>
                        ))}
                        <div className="absolute h-1 bg-gray-200 rounded-full w-[calc(100%-4rem)] mx-8 -mt-6 -z-0" />
                        <motion.div
                            className="absolute h-1 bg-indigo-600 rounded-full mx-8 -mt-6 -z-0"
                            initial={false}
                            animate={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                            transition={{ duration: 0.5 }}
                            style={{ maxWidth: "calc(100% - 4rem)" }}
                        />
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-indigo-100/50 p-8 md:p-12 border border-white/20">
                    <AnimatePresence mode="wait">
                        {renderStep()}
                    </AnimatePresence>

                    {error && (
                        <div className="mt-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div className="mt-12 flex justify-between items-center">
                        <button
                            onClick={prevStep}
                            disabled={currentStep === 0}
                            className={cn(
                                "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all",
                                currentStep === 0
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "text-gray-600 hover:bg-gray-100"
                            )}
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Back
                        </button>

                        <div className="flex gap-4">
                            {currentStep === STEPS.length - 1 ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-indigo-200 transition-all scale-105 active:scale-95 disabled:opacity-70"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Setup"}
                                    {!isSubmitting && <CheckCircle2 className="w-5 h-5" />}
                                </button>
                            ) : (
                                <button
                                    onClick={nextStep}
                                    className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95"
                                >
                                    Continue
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
