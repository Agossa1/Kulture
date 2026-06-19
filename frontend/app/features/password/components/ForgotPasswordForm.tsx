"use client"
import { DynamicForm } from "@/app/components/ui/forms/dynamic.form";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from '../../../store/index';
import { forgotPassword } from "../services/password.thunk";
import { resetPasswordState } from "../services/password.slices";
import { selectPasswordCurrentStep, selectPasswordError, selectPasswordLoading } from "../services/password.selectors";

export const ForgotPasswordForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    
    // 1. Récupération des états globaux depuis Redux
    const currentStep = useSelector(selectPasswordCurrentStep);
    const isLoading = useSelector(selectPasswordLoading);
    const reduxError = useSelector(selectPasswordError);

    // 2. Nettoyage de l'état Redux quand on quitte le composant
    useEffect(() => {
        return () => {
            dispatch(resetPasswordState());
        };
    }, [dispatch]);

    const forgotPasswordFields = [
        { name: "email", label: "Email", type: "email", placeholder: "Entrez votre adresse email", required: true },
    ];

    // 3. Soumission via notre Thunk Redux
    const handleSubmit = async (data: Record<string, any>) => {
        dispatch(forgotPassword({ email: data.email }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
            {/** Bouton retour */}
            <a href="/login" className="absolute top-6 left-6 sm:top-10 sm:left-10 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition">
                <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour
            </a>

            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded shadow-md">
                <div className="text-center mt-6">
                    <h2 className="text-3xl font-extrabold text-gray-900">Mot de passe oublié</h2>
                    <p className="mt-2 text-sm text-gray-600">Entrez votre email pour recevoir un code de réinitialisation.</p>

                    {/* 4. Affichage des erreurs gérées par Redux */}
                    {reduxError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4 mt-4 text-sm">
                            {reduxError}
                        </div>
                    )}
                    
                    {/* 5. Utilisation de la propriété magique currentStep du Slice */}
                    {currentStep === 'forgot_sent' ? (
                        <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm border border-green-200 text-center space-y-3 mt-4">
                            <p className="font-semibold">✅ Code envoyé !</p>
                            <p>Si cet email existe dans notre base de données, un code de validation vous a été envoyé.</p>
                            <a href="/verify-password-otp" className="block w-full bg-blue-600 text-white p-2 rounded-lg font-medium hover:bg-blue-700 transition text-center">
                                Saisir le code OTP
                            </a>
                        </div>
                    ) : (
                        <div className="mt-8">
                            <DynamicForm 
                                fields={forgotPasswordFields} 
                                onSubmit={handleSubmit} 
                                submitLabel={isLoading ? "Envoi en cours..." : "Envoyer le code"} 
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};