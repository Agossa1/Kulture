"use client"
import { DynamicForm } from "@/app/components/ui/forms/dynamic.form";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store/index";
import { verifyOtp } from "../services/password.thunk";
import { selectPasswordEmail, selectPasswordLoading, selectPasswordError, selectPasswordCurrentStep, selectPasswordMessage } from "../services/password.selectors";
import { useRouter } from "next/navigation";

export const VerifyPasswordOtpForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    
    const reduxEmail = useSelector(selectPasswordEmail);
    const isLoading = useSelector(selectPasswordLoading);
    const reduxError = useSelector(selectPasswordError);
    const currentStep = useSelector(selectPasswordCurrentStep);
    const reduxMessage = useSelector(selectPasswordMessage);

    // On utilise l'email stocké dans Redux (pas de saisie manuelle requise)
    const fields = [
        { name: "otp", label: "Code de vérification", type: "text", placeholder: "Entrez le code reçu par email", required: true },
    ];

    const handleSubmit = async (data: Record<string, any>) => {
        if (!reduxEmail) {
            // Si l'email a été perdu (ex: refresh de la page), on redirige vers le début
            router.push('/reset-password');
            return;
        }
        dispatch(verifyOtp({ email: reduxEmail, code: data.otp }));
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
            {/** Bouton retour */}
            <a href="/forgot-password" className="absolute top-6 left-6 sm:top-10 sm:left-10 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition">
                <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Retour
            </a>

            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded shadow-md">
                <div className="text-center mt-6">
                    <h2 className="text-3xl font-extrabold text-gray-900">Vérification du code</h2>
                    <p className="mt-2 text-sm text-gray-600">Saisissez le code que vous avez reçu pour confirmer votre demande.</p>

                    {reduxError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4 mt-4 text-sm">{reduxError}</div>}
                    
                    {currentStep === 'otp_verified' ? (
                        <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm border border-green-200 text-center space-y-3 mt-4">
                            <p className="font-semibold">✅ Code validé !</p>
                            <p>{reduxMessage || "Vous pouvez maintenant réinitialiser votre mot de passe."}</p>
                            <a href="/reset-password" className="block w-full bg-blue-600 text-white p-2 rounded-lg font-medium hover:bg-blue-700 transition">
                                Réinitialiser le mot de passe
                            </a>
                        </div>
                    ) : (
                        <div className="mt-8">
                            <DynamicForm fields={fields} onSubmit={handleSubmit} submitLabel={isLoading ? "Vérification..." : "Vérifier"} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
