import Link from "next/link";
import React from "react";
import { LuArrowRight } from "react-icons/lu";

export default function CtaSection() {
    return (
        <section className="w-full bg-white">
            <div className="relative w-full overflow-hidden bg-gray-900 py-16 sm:py-24 lg:py-32 text-center">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/20 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/20 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl"></div>
                
                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <span className="inline-block text-yellow-500 text-sm font-semibold tracking-wider uppercase mb-4">
                            Rejoignez Kulture
                        </span>
                        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight">
                            Prêt à vivre la culture <br className="hidden sm:block"/>autrement ?
                        </h2>
                        <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
                            Créez un compte gratuitement en 30 secondes. Accédez à des milliers d'événements, soutenez les artistes locaux et bien plus encore.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-gray-900 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20">
                                Créer mon compte gratuitement
                                <LuArrowRight className="w-5 h-5" />
                            </Link>
                            <Link href="/login" className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white border border-white/20 rounded-full hover:bg-white/10 transition-all">
                                Me connecter
                            </Link>
                        </div>
                    </div>
                </div>
        </section>
    );
}
