"use client"
import { DynamicForm } from "@/app/components/ui/forms/dynamic.form";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/app/store";
import { selectError, selectIsLoading } from "../services/auth.selectors";
import { registerUser } from "../services/auth.thunk";
import { useRouter } from "next/navigation"; 
 



export const RegisterForm: React.FC =() => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const isLoading = useSelector(selectIsLoading);
    const reduxError = useSelector(selectError);
    const router = useRouter();
    const [localError, setLocalError] = useState<string | null>(null);
 


    // 1. Configuration des champs du formulaire d'inscription
    const registerFields = [
        {name:"fullName", label:"Nom complet", type:"text", placeholder:"Entrez votre nom complet", required:true},
        {name:"email", label:"Email", type:"email", placeholder:"Entrez votre adresse email", required:true},
        {name:"phone", label:"Téléphone", type:"tel", placeholder:"Entrez votre numéro de téléphone", required:true},
        {name:"password", label:"Mot de passe", type:"password", placeholder:"Créez un mot de passe sécurisé", required:true},
        {name:"confirmPassword", label:"Confirmez le mot de passe", type:"password", placeholder:"Confirmez votre mot de passe", required:true},
    ]

const handleRegisterSubmit = async(data: Record<string, any>) => {
    setErrorMessage(null); // Réinitialise les messages d'erreur/succès

    // Validation côté client
    if(data.password !== data.confirmPassword) {
        setErrorMessage("Les mots de passe ne correspondent pas.");
        return;
    }
    if(data.password.length < 6) {
        setErrorMessage("Le mot de passe doit contenir au moins 6 caractères.");
        return;
    }
    try {
       const nameParts = data.fullName.split(" ");
       const firstName = nameParts[0];
       const lastName = nameParts.slice(1).join(" ") || " "; // Évite le vide pour SQL

       const resultAction = await dispatch(
        registerUser({
            firstName,
            lastName,
            email: data.email,
            phone:data.phone,
            password: data.password,
        })
       );

       if(registerUser.fulfilled.match(resultAction)){
        const userId = resultAction.payload.id || resultAction.payload?.user?.id
        setSuccessMessage("Inscription réussie ! Vous pouvez maintenant verifier votre compte")
        router.push(`/verify-account?userId=${userId}`)
       }
    } catch (error: any) {
      setErrorMessage(error.message || "Impossible de joindre le serveur.");
    }
}

const activeErrorMessage = reduxError || localError || errorMessage;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
            {/** Bouton retour */}
            <a href="/" className="absolute top-6 left-6 sm:top-10 sm:left-10 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition">
                <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Retour
            </a>

            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded">
                {/** En-tête */}

                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Créer un compte</h2>
                   <p className="mt-2 text-sm text-gray-600">Rejoignez kulture dès maintenant</p>

                   {/** Message d'états ( erreur ou succès) */}
                   {activeErrorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">{activeErrorMessage}</div>
                   )}

                    {successMessage ? (
                        <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm border border-green-200 text-center space-y-3">
                            <p className="font-semibold">🎉 Inscription réussie !</p>
                            <p>Vous pouvez maintenant vous connecter à votre espace.</p>
                            <a href="/login" className="block w-full bg-green-600 text-white p-2 rounded-lg font-medium hover:bg-green-700 transition">
                            Aller à la page de connexion
                            </a>
                        </div>
                   ):(
                    <div className="mt-8">
                        <DynamicForm 
                           fields ={registerFields}
                           onSubmit={handleRegisterSubmit} // Fonction à définir pour gérer l'inscription
                           submitLabel={isLoading ? "En cours..." : "S'inscrire"}
                        />
                    </div>
                   )}

                   {/* Pied de page */}
                   {!successMessage && (
                        <>
                            <div className="mt-6 flex items-center justify-between">
                                <span className="w-1/5 border-b border-gray-300 lg:w-1/4"></span>
                                <span className="text-xs text-center text-gray-500 uppercase font-semibold tracking-wide">Ou s'inscrire avec</span>
                                <span className="w-1/5 border-b border-gray-300 lg:w-1/4"></span>
                            </div>

                            <div className="flex gap-4 mt-6">
                                <button type="button" className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition shadow-sm">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                                    Google
                                </button>
                                <button type="button" className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition shadow-sm">
                                    <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                    Facebook
                                </button>
                            </div>

                            <div className="mt-8 text-center text-sm text-gray-600">
                                Déjà un compte ?{' '}
                                <a href="/login" className="font-semibold text-yellow-600 hover:text-yellow-500 transition">
                                    Connectez-vous
                                </a>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}