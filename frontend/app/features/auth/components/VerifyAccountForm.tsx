"use client";

import { DynamicForm } from "@/app/components/ui/forms/dynamic.form";
import { AppDispatch } from "@/app/store";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation"; // 💡 Pour récupérer le userId de l'URL
import { selectError, selectIsLoading } from "../services/auth.selectors";
import { verifyAccount } from "../services/auth.thunk";

export const VerifyAccountForm: React.FC = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    
    const dispatch = useDispatch<AppDispatch>();
    const searchParams = useSearchParams();
    
    // 💡 On récupère le paramètre ?userId=... depuis l'URL
    const userId = searchParams.get("userId");
    
    const isLoading = useSelector(selectIsLoading);
    const reduxError = useSelector(selectError);

    const fields = [
        { name: "otp", label: "Code de vérification", type: "text", placeholder: "Entrez le code reçu par email", required: true },
    ];

    const handleSubmit = async (data: Record<string, any>) => {
        setErrorMessage(null);

        if (!data.otp || data.otp.length !== 6 || !/^\d+$/.test(data.otp)) {
            setErrorMessage("Le code doit contenir exactement 6 chiffres.");
            return;
        }

        // 💡 Sécurité : Si l'ID est absent de l'URL, on bloque pour éviter le crash backend
        if (!userId) {
            setErrorMessage("Identifiant utilisateur manquant dans l'URL (userId).");
            return;
        }
        
        try {
            await dispatch(
                verifyAccount({
                    userId: userId, // ✅ Transmis au Thunk
                    code: data.otp, // ✅ Renommé en "code" pour plaire au backend
                })
            ).unwrap();

            setSuccessMessage("Compte vérifié avec succès !");
            
        } catch (error: any) {
            setErrorMessage(error || "Code invalide ou expiré.");
        }
    };

    const displayError = errorMessage || reduxError;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
            <a href="/login" className="absolute top-6 left-6 sm:top-10 sm:left-10 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition">
                <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour
            </a>

            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded shadow-md">
                <div className="text-center mt-6">
                    <h2 className="text-3xl font-extrabold text-gray-900">Vérification de compte</h2>
                    <p className="mt-2 text-sm text-gray-600">Entrez le code à 6 chiffres envoyé à votre adresse email.</p>

                    {displayError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4 mt-4 text-sm text-center">
                            {displayError}
                        </div>
                    )}
                    
                    {successMessage ? (
                        <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm border border-green-200 text-center space-y-3 mt-4">
                            <p className="font-semibold">✅ Vérification réussie !</p>
                            <p>{successMessage}</p>
                            <a href="/login" className="block w-full bg-green-600 text-white p-2 rounded-lg font-medium hover:bg-green-700 transition">
                                Se connecter
                            </a>
                        </div>
                    ) : (
                        <div className="mt-8">
                            <DynamicForm 
                                fields={fields} 
                                onSubmit={handleSubmit} 
                                submitLabel={isLoading ? "Vérification..." : "Vérifier le compte"} 
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};