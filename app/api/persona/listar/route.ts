
import { NextRequest } from "next/server";
import { prisma } from "../../client";
const POST = async (request: NextRequest) => {
    try {
        let jefe = await prisma.persona.findFirst({
            where: {
                cargo: 'jefe',
                estado: true
            },
            orderBy: {
                id: 'desc'
            }
        });
        let tecnico = await prisma.persona.findFirst({
            where: {
                cargo: 'tecnico',
                estado: true
            },
            orderBy: {
                id: 'desc'
            }
        });
        let secretario = await prisma.persona.findFirst({
            where: {
                cargo: 'secretario',
                estado: true
            },
            orderBy: {
                id: 'desc'
            }
        });
        return Response.json([jefe, tecnico, secretario]);
    } catch (error) {
        console.log(error)
        return Response.json([]);
    }
}

export { POST };