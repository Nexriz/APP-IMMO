import {prisma} from "@/lib/prisma"; // Chemin relatif vers src/lib/prisma
import ImageGallery from "@/components/ImageGallery"; // Chemin relatif vers src/components/ImageGallery
import QuestionForm from "@/components/QuestionForm"; // Chemin relatif vers src/components/QuestionForm
import AnswerForm from "@/components/AnswerForm"; // Chemin relatif vers src/components/ReponseForm
import DeleteButton from "@/components/DeleteButton"; // Chemin relatif vers src/components/DeleteButton
import { TypeBien } from '@prisma/client'; // Import des enums
import { auth } from "@/auth"; // vient de ton fichier src/auth.ts

interface AnnonceDetailPageProps {
    params: { id: string };
}

export default async function AnnonceDetailPage({ params }: AnnonceDetailPageProps) {
    const session = await auth();
    const annonceId = parseInt(params.id);

    if (isNaN(annonceId)) {
        return <div className="text-center py-20 text-red-500">ID d'annonce invalide.</div>;
    };

    try {
        const annonce = await prisma.annonce.findUnique({
            where: { id: annonceId },
            include: { 
                photo: true, // Photos
                question: {
                    include: { 
                        user: { 
                            select: { 
                                name: true 
                        } 
                    } 
                }
                }, // Questions avec nom utilisateur
                user: { 
                    select: { 
                        name: true 
                    } 
                } // Agent
            },
        });

        if (!annonce) {
            return <div className="text-center py-20 text-gray-600">Cette annonce n'existe pas.</div>;
        };

        const isLocation = annonce.type === TypeBien.LOCATION;

        {/*//Filtrage des questions selon le rôle du user*/}
        let questionsFiltrees = annonce.question;

        if (session?.user.role === "USER") {
        // L'utilisateur normal ne voit que ses propres questions
        questionsFiltrees = annonce.question.filter(
            (q) => q.userId === session?.user.id
        );
        } else if (session?.user.role === "AGENT") {
            // L’agent ne voit que les questions des annonces qu’il gère
            if (annonce.userId !== session?.user.id) {
                questionsFiltrees = []; // pas son annonce → aucune question affichée
            };
        };

        return (
            <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                
                {/* 1. Titre et Statut */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                            {annonce.titre}
                        </h1>
                        <div className="flex items-center gap-3 mt-3">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-white shadow-sm ${isLocation ? 'bg-blue-600' : 'bg-emerald-500'}`}>
                                {isLocation ? 'À Louer' : 'À Vendre'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. Galerie d'images */}
                <div className="rounded-3xl overflow-hidden shadow-2xl mb-12 border-4 border-white">
                    <ImageGallery 
                        photos={annonce.photo}
                        titreAnnonce={annonce.titre} 
                    />
                </div>

               <div className="flex flex-col lg:flex-row gap-12 mt-10">
                    
                    {/* 3. Colonne Gauche : Détails & Questions */}
                    <div className="lg:w-2/3 space-y-12">
                        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-4xl font-black text-blue-600">
                                    {annonce.prix.toLocaleString('fr-FR')} €
                                    {isLocation && <span className="text-lg text-slate-400 font-normal"> /mois</span>}
                                </h2>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
                                    Description
                                </h3>
                                <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
                                    {annonce.description}
                                </p>
                            </div>
                        </section>

                        {/* 4. Section Questions/Réponses Style "Messages" */}
                        <section className="space-y-6">
                            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                Questions & Réponses
                                <span className="bg-slate-200 text-slate-700 text-sm px-3 py-1 rounded-full">{questionsFiltrees.length}</span>
                            </h3>

                            <div className="space-y-6">
                                {questionsFiltrees.map((q) => (
                                    <div key={q.id} className="group relative">
                                        {/* Bulle Question */}
                                        <div className="bg-white p-6 rounded-2xl rounded-bl-none shadow-sm border border-slate-100 mb-2">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-bold text-blue-600 uppercase tracking-tighter">Question de {q.user?.name}</span>
                                                {(session?.user?.role === "ADMIN" || session?.user?.id === annonce.userId) && (
                                                    <DeleteButton questionId={q.id} type="question" />
                                                )}
                                            </div>
                                            <p className="text-slate-800 font-medium text-lg">{q.content}</p>
                                        </div>

                                        {/* Bulle Réponse */}
                                        <div className="ml-8">
                                            {q.answer ? (
                                                <div className="bg-blue-50 p-5 rounded-2xl rounded-tl-none border border-blue-100 relative">
                                                    <div className="flex justify-between items-start">
                                                        <p className="text-slate-700 leading-relaxed">
                                                            <span className="font-bold text-blue-800">Réponse de l'agent :</span> {q.answer}
                                                        </p>
                                                        {(session?.user?.role === "ADMIN" || session?.user?.id === annonce.userId) && (
                                                            <DeleteButton questionId={q.id} type="answer" />
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm italic">
                                                    En attente d'une réponse...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {session?.user?.role === "USER" && (
                                <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-lg">
                                    <h4 className="text-xl font-bold mb-4">Une question sur ce bien ?</h4>
                                    <QuestionForm annonceId={annonce.id} />
                                </div>
                            )}
                        </section>
                    </div>
                    
                    {/* 5. Sidebar Droite : Infos & Contact */}
                    <aside className="lg:w-1/3 space-y-6">
                        <div className="sticky top-8 space-y-6">
                            <div className="p-8 bg-slate-900 rounded-3xl shadow-xl text-white">
                                <h3 className="text-xl font-bold mb-6 border-b border-slate-700 pb-4">Informations clés</h3>
                                <div className="space-y-6">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Statut</span>
                                        <span className="font-bold text-emerald-400">{annonce.statutBien}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Type</span>
                                        <span className="font-bold">{annonce.type}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Disponible le</span>
                                        <span className="font-bold">{annonce.dateDispo.toLocaleDateString('fr-FR')}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
                                <h4 className="text-slate-400 text-xs font-bold uppercase mb-2">Agent responsable</h4>
                                <p className="text-xl font-black text-slate-900">{annonce.user.name || 'Agent Pro'}</p>
                            </div>
                        </div>
                    </aside>

                </div>
            </div>
    )
    } catch (error) {
        console.error("Erreur lors du chargement du détail de l'annonce:", error);
        return (
            <div className="text-center py-20 text-red-600">
                Impossible de charger l'annonce.
            </div>
        );
    };
};
