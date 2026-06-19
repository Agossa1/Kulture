"use client";

import React, { useState } from 'react';
import { FormField } from './form.types';

interface DynamicFormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void;
  submitLabel?: string;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({ 
  fields, 
  onSubmit, 
  submitLabel = "Envoyer" 
}) => {
  // 1. Initialisation dynamique de l'état
  const [formData, setFormData] = useState<Record<string, any>>(() => 
    fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
  );

  // 2. Gestion des modifications (typing)
  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 3. Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full text-left">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col space-y-1.5">
          {/* Label */}
          <label className="text-sm font-semibold text-gray-700">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>

          {/* Rendu dynamique */}
          {field.type === 'select' ? (
            <select
              value={formData[field.name] || ''} // Sécurité contre l'erreur "uncontrolled input"
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all text-gray-900"
            >
              <option value="">Sélectionnez une option</option>
              {field.options?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea
              value={formData[field.name] || ''} // Sécurité contre l'erreur "uncontrolled input"
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              rows={4}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400"
            />
          ) : (
            <input
              type={field.type}
              value={formData[field.name] || ''} // Sécurité contre l'erreur "uncontrolled input"
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400"
            />
          )}
        </div>
      ))}

      {/* Bouton de soumission */}
      <button 
        type="submit" 
        className="w-full bg-yellow-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 shadow-sm transition-all mt-2"
      >
        {submitLabel}
      </button>
    </form>
  );
};