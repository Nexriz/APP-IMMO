"use client";

import React, { useState } from 'react';

interface QuestionFormProps {
    annonceId: number;
}

export default function QuestionForm({ annonceId }: QuestionFormProps) {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' | '' }>({ text: '', type: '' });
    
    // NOTE: Dans la prochaine étape (Server Actions), cette fonction appellera une action serveur.
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsSubmitting(true);
        setMessage({ text: '', type: '' });

        // Ici, on simule l'appel à une Server Action pour poster la question
        await new Promise(resolve => setTimeout(resolve, 1500)); 

        setMessage({ text: 'Votre question a été soumise avec succès et sera visible après approbation.', type: 'success' });
        setContent('');
        setIsSubmitting(false);
    };

    return (
        <div className="mt-6 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Poser une question</h3>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    placeholder="Posez votre question sur cette propriété..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                    disabled={isSubmitting}
                />
                <button
                    type="submit"
                    className={`mt-3 px-6 py-2 rounded-lg font-semibold transition duration-150 ${
                        isSubmitting 
                            ? 'bg-indigo-300 cursor-not-allowed' 
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                    }`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer la question'}
                </button>
            </form>
            {message.text && (
                <p className={`mt-4 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </p>
            )}
        </div>
    );
}
