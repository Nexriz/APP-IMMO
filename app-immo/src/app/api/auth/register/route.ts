
import { prisma } from "@/lib/prisma";
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const {name, email, password } = await request.json();

        if(!email || !password){
            return NextResponse.json({error : "Donnée manquante"}, {status : 400});
        };

        if( await prisma.user.findUnique({ where : {email : email} })) {
            return NextResponse.json({error : "Cet email est déja utilisée"}, {status : 409});
        }

        const HashPassword = await bcrypt.hash(password , 10);

        const user = await prisma.user.create({
            data : {
                name : name,
                email : email,
                password : HashPassword
            }
        });

        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({user : userWithoutPassword}, { status : 201});

    } catch (err) {
        return NextResponse.json({error : "Problème lors de l'inscription"}, {status : 500});
    }
}