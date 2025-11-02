"use client";

import React, { useState } from "react";

export default function AnswerForm({ questionId }: { questionId: number }) {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/questions/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, answer }),
      });

      if (!res.ok) throw new Error("Erreur");

      setMessage("Réponse enregistrée !");
      setAnswer("");
    } catch {
      setMessage("Erreur lors de l’envoi de la réponse.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 border-t pt-3">
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Votre réponse..."
        className="w-full p-2 border rounded"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
      >
        {loading ? "Envoi..." : "Répondre"}
      </button>
      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
    </form>
  );
}
