import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const secret = process.env.AUTH_SECRET;


export async function middleware(request : NextRequest){
    const token = await getToken({req: request, secret : secret}); //Récupération du token

    //URL possibles pour tout utilisateur (même non connecté)
    if(!request.nextUrl.pathname.startsWith('/annonces/new') && !request.nextUrl.pathname.startsWith('/annonces/edit')){
        return NextResponse.next();
    }

    //Vérification si l'utilisateur est bien connecté
    if(!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    };

    //Vérification d'accès à l'url destinée seulement aux AGENT et ADMIN
    if((request.nextUrl.pathname.startsWith('/annonces/new')) && token.role !== "AGENT" && token.role !== "ADMIN"){
        return NextResponse.redirect(new URL('/', request.url));
    };

    if(request.nextUrl.pathname.startsWith('/annonces/edit') && token.role !== "AGENT" && token.role !== "ADMIN"){
        return NextResponse.redirect(new URL('/', request.url));
    };

    return NextResponse.next();
}

export const config = {
    matcher : [
        '/annonces/:path*',
    ],
};