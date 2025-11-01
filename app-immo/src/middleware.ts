import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const secret = process.env.AUTH_SECRET;


export async function middleware(request : NextRequest){
    const token = await getToken({req: request, secret : secret}); //Récupération du token

    if(!request.nextUrl.pathname.startsWith('/annonces/new') && !request.nextUrl.pathname.startsWith('/annonces/edit')){
        return NextResponse.next();
    }

    if(!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    };

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