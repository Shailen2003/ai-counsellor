"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
    Send,
    Bot,
    User as UserIcon,
    Loader2,
    ChevronLeft,
    Sparkles,
    Briefcase,
    GraduationCap,
    Info,
    CheckCircle2,
    Lock as LockIcon,
    PlusCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    role: "user" | "assistant";
    content: string;
    actions?: any[];
}

export default function CounsellorPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "Hello! I'm your AI Counsellor. I've analyzed your profile and I'm ready to help you find the best universities. What would you like to discuss today? We can look at university recommendations, your profile strengths, or next steps."
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage,
                    history: messages
                }),
            });

            if (!res.ok) throw new Error("Failed to get response");

            const data = await res.json();
            setMessages(prev => [...prev, {
                role: "assistant",
                content: data.message,
                actions: data.actions
            }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: "assistant", content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment." }]);
        } finally {
            setIsLoading(false);
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
        <div className="min-h-screen bg-[#f8fafc] flex flex-col h-screen overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-500"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="font-bold text-slate-900 flex items-center gap-2">
                            AI Counsellor <Sparkles className="w-4 h-4 text-indigo-500 fill-current" />
                        </h1>
                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Always Online • Stage: Discovering Universities</p>
                    </div>
                </div>
                <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-slate-400" />
                        </div>
                    ))}
                </div>
            </header>

            {/* Chat Area */}
            <main className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 custom-scrollbar">
                <div className="max-w-4xl mx-auto space-y-8">
                    <AnimatePresence initial={false}>
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                    "flex gap-4 md:gap-6",
                                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                                    msg.role === "assistant"
                                        ? "bg-indigo-600 text-white"
                                        : "bg-white text-slate-400 border border-slate-200"
                                )}>
                                    {msg.role === "assistant" ? <Bot className="w-6 h-6" /> : <UserIcon className="w-6 h-6" />}
                                </div>

                                <div className={cn(
                                    "max-w-[85%] md:max-w-[75%] space-y-4",
                                    msg.role === "user" ? "text-right" : "text-left"
                                )}>
                                    <div className={cn(
                                        "inline-block p-4 md:p-6 rounded-3xl shadow-sm text-sm md:text-base leading-relaxed",
                                        msg.role === "assistant"
                                            ? "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
                                            : "bg-indigo-600 text-white rounded-tr-none font-medium"
                                    )}>
                                        {msg.content}
                                    </div>

                                    {/* Action Results */}
                                    {msg.actions && msg.actions.length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            {msg.actions.map((action, aidx) => (
                                                <div key={aidx} className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
                                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                                    <div>
                                                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Action Completed</p>
                                                        <p className="text-xs font-bold text-slate-700">
                                                            {action.action === 'shortlist_university' && 'University Shortlisted'}
                                                            {action.action === 'create_task' && 'Task Created'}
                                                            {action.action === 'lock_university' && 'University Locked'}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {isLoading && (
                        <div className="flex gap-4 md:gap-6">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                                <Bot className="w-6 h-6" />
                            </div>
                            <div className="bg-white border border-slate-100 p-4 md:p-6 rounded-3xl rounded-tl-none flex items-center gap-2">
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* Input Area */}
            <footer className="bg-white border-t border-slate-200 p-6 shrink-0 shadow-2xl shadow-indigo-100">
                <div className="max-w-4xl mx-auto flex gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Ask about recommendations, SOP advice, or next steps..."
                            className="w-full pl-6 pr-14 py-4 md:py-5 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm md:text-base text-slate-900 placeholder:text-slate-400"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 hidden md:block">ENTER TO SEND</span>
                        </div>
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="w-14 md:w-16 h-14 md:h-16 bg-indigo-600 text-white rounded-3xl flex items-center justify-center hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all disabled:opacity-50 disabled:shadow-none"
                    >
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                    </button>
                </div>
                <div className="max-w-4xl mx-auto mt-4 px-6">
                    <p className="text-[10px] text-center text-slate-400 font-medium">The AI Counsellor can shortlist universities and create tasks directly for you. Try saying "Shortlist Harvard for me".</p>
                </div>
            </footer>
        </div>
    );
}
