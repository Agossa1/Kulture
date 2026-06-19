"use client"
import { DynamicForm } from "@/app/components/ui/forms/dynamic.form";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store/index";
import { resetPassword } from "../services/password.thunk";
import { selectPasswordEmail, selectPasswordOtp, selectPasswordLoading, selectPasswordError, selectPasswordCurrentStep, selectPasswordMessage } from "../services/password.selectors";
import { useRouter } from "next/navigation";

export const ResetPasswordForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const reduxEmail = useSelector(selectPasswordEmail);
    const reduxOtp = useSelector(selectPasswordOtp);
    const isLoading = useSelector(selectPasswordLoading);
    const reduxError = useSelector(selectPasswordError);
    const currentStep = useSelector(selectPasswordCurrentStep);
    const reduxMessage = useSelector(selectPasswordMessage);

    const [localError, setLocalError] = useState<string | null>(null);

    // Redirection automatique après succès
    useEffect(() => {
        if (currentStep === 'reset_success') {
            // Redirige vers la page de login après 2 secondes pour laisser le temps de lire le message
            const timer = setTimeout(() => {
                router.push('/login');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [currentStep, router]);

    const fields = [
        { name: "password", label: "Nouveau mot de passe", type: "password", placeholder: "Créez un nouveau mot de passe sécurisé", required: true },
        { name: "confirmPassword", label: "Confirmez le mot de passe", type: "password", placeholder: "Confirmez votre nouveau mot de passe", required: true },
    ];

    const handleSubmit = async (data: Record<string, any>) => {
        setLocalError(null);

        // Sécurité si l'utilisateur arrive ici en tapant directement l'URL
        if (!reduxEmail || !reduxOtp) {
            router.push('/forgot-password');
            return;
        }

        // Validation locale
        if (data.password !== data.confirmPassword) {
            setLocalError("Les mots de passe ne correspondent pas.");
            return;
        }
        if (data.password.length < 6) {
            setLocalError("Le mot de passe doit contenir au moins 6 caractères.");
            return;
        }

        // Appel Redux
        dispatch(resetPassword({ email: reduxEmail, otp: reduxOtp, newPassword: data.password }));
    }

    const activeError = localError || reduxError;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
            {/** Bouton retour */}
            <a href="/login" className="absolute top-6 left-6 sm:top-10 sm:left-10 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition">
                <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Annuler
            </a>

            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded shadow-md">
                <div className="text-center mt-6">
                    <h2 className="text-3xl font-extrabold text-gray-900">Nouveau mot de passe</h2>
                    <p className="mt-2 text-sm text-gray-600">Veuillez choisir un nouveau mot de passe pour votre compte.</p>

                    {activeError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4 mt-4 text-sm">{activeError}</div>}
                    
                    {currentStep === 'reset_success' ? (
                        <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm border border-green-200 text-center space-y-3 mt-4">
                            <p className="font-semibold">✅ Mot de passe modifié !</p>
                            <p>{reduxMessage || "Votre mot de passe a été réinitialisé avec succès !"}</p>
                            <a href="/login" className="block w-full bg-blue-600 text-white p-2 rounded-lg font-medium hover:bg-blue-700 transition">
                                Retour à la connexion
                            </a>
                        </div>
                    ) : (
                        <div className="mt-8">
                            <DynamicForm fields={fields} onSubmit={handleSubmit} submitLabel={isLoading ? "Enregistrement..." : "Enregistrer le mot de passe"} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
