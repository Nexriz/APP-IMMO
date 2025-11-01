import 'dotenv/config';

import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main(){
    const hashedPasswordUser = await bcrypt.hash("123456789", 10);
    const CompteUser = await prisma.user.create({
        data : {
            name : "Bob",
            email : "user@example.com",
            password : hashedPasswordUser,
            role : "USER"
        }
    });

    const hashedPasswordAgent = await bcrypt.hash("789456123", 10);
    const CompteAgent = await prisma.user.create({
        data : {
            name : "Alice",
            email : "agent@example.com",
            password : hashedPasswordAgent,
            role : "AGENT"
        }
    });

    const hashedPasswordAdmin = await bcrypt.hash("7894561230", 10);
    const CompteAdmin = await prisma.user.create({
        data : {
            name : "Anna",
            email : "admin@example.com",
            password : hashedPasswordAdmin,
            role : "ADMIN"
        }
    });

      const annonce = await prisma.annonce.create({
        data: {
          titre : "Maison Lyon",
          type : "LOCATION",
          description : "Belle maison au centre de Lyon",
          prix : 400000,
          statutBien : "DISPONIBLE",
          userId : CompteAgent.id
        },
      });

      const annonce2 = await prisma.annonce.create({
        data: {
          titre : "Maison Paris",
          type : "LOCATION",
          description : "Belle maison au centre de Paris",
          prix : 800000,
          statutBien : "DISPONIBLE",
          userId : CompteAgent.id
        },
      });

      const annonce3 = await prisma.annonce.create({
        data: {
          titre : "Appartement au Havre",
          type : "VENTE",
          description : "Appartement au havre à louer",
          prix : 400,
          statutBien : "DISPONIBLE",
          userId : CompteAgent.id
        },
      });
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })