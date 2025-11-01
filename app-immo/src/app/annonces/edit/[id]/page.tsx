'use client';
import { useSession } from "next-auth/react"


interface EditAnnoncePageProps {
  params: { id: string };
}

export default function EditPage({ params }: EditAnnoncePageProps){
    const { data: session, status } = useSession();

    const userRole = session?.user.role;
    const userId = session?.user.id;

}