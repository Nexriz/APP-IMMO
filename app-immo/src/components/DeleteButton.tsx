"use client";

import { useState } from "react";

interface DeleteButtonProps {
  questionId: number;
  type: "question" | "answer";
  label?: string;
}

export default function DeleteButton({ questionId, type, label }: DeleteButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Supprimer cette ${type === "question" ? "question" : "réponse"} ?`)) return;

    setLoading(true);
    try {
      const endpoint = type === "question" ? "/api/questions/delete" : "/api/answers/delete";
      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId }),
      });

      if (!res.ok) throw new Error();
      window.location.reload();
    } catch {
      alert("Erreur lors de la suppression.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      title={`Supprimer ${type}`}
      className={`text-red-500 hover:text-red-700 ${type === "question" ? "absolute top-2 right-2" : "ml-3"}`}
    >
      {loading ? "..." : label || "supprimer 🗑️"}
    </button>
  );
}
