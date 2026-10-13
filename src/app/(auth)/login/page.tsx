"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, ArrowLeft, ShieldCheck } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            if (!email || !password) {
                throw new Error("يرجى إدخال البريد الإلكتروني وكلمة المرور.");
            }

            // محاكاة الاتصال بخادم للتحقق من البيانات (Mock)
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // توجيه تجريبي إلى لوحة التحكم عبر useRouter
            router.push("/dashboard");

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("بيانات الدخول غير صحيحة، يرجى المحاولة مرة أخرى.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
            {/* تأثيرات الخلفية العصرية */}
            <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10">
                {/* الترويسة والشعار */}
                <div className="text-center mb-10">
                    <div className="mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/20 mb-5">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                        ذكاء الأعمال AI
                    </h1>
                    <p className="text-slate-500 text-sm font-medium">
                        سجل دخولك للوصول إلى تحليلات المنصة وتقاريرها
                    </p>
                </div>

                {/* كارد نموذج الدخول */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white p-8 sm:p-10">
                    <form onSubmit={handleLogin} className="space-y-6">

                        {/* رسالة الخطأ */}
                        {error && (
                            <div className="bg-red-50 border-r-4 border-red-500 p-4 rounded-xl flex items-start animate-fade-in">
                                <span className="text-sm font-semibold text-red-700">{error}</span>
                            </div>
                        )}

                        {/* البريد الإلكتروني */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">البريد الإلكتروني</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pr-12 pl-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                    placeholder="admin@company.com"
                                    required
                                    dir="ltr"
                                />
                            </div>
                        </div>

                        {/* كلمة المرور */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-slate-700">كلمة المرور</label>
                                <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                                    نسيت كلمة المرور؟
                                </a>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pr-12 pl-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                    placeholder="••••••••"
                                    required
                                    dir="ltr"
                                />
                            </div>
                        </div>

                        {/* زر تسجيل الدخول */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed group mt-2 cursor-pointer"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                                    جاري التحقق...
                                </>
                            ) : (
                                <>
                                    تسجيل الدخول
                                    <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* رابط إنشاء حساب */}
                <div className="mt-8 text-center text-sm font-medium text-slate-500">
                    ليس لديك حساب في المنصة؟{" "}
                    <a href="#" className="font-bold text-blue-600 hover:text-blue-800 transition-colors">
                        إنشاء حساب جديد
                    </a>
                </div>
            </div>
        </div>
    );
}
