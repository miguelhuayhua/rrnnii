import { NextRequest } from "next/server";
import { prisma } from "../../../client";
import { getToken } from 'next-auth/jwt'
const POST = async (request: NextRequest) => {
    const { Participante, id } = await request.json();
    const token = await getToken({ secret: process.env.NEXTAUTH_SECRET as string, req: request });
    if (token?.email) {
        try {
            await prisma.participanteBeca.create({
                data: {
                    becaId: id,
                    nombre_completo: Participante.nombre_completo,
                    contacto: Participante.contacto
                }
            })
            return Response.json({ error: false, mensaje: `Participante agregado` });
        } catch (error) {
            console.log(error)
            return Response.json({
                error: true,
                mensaje: 'Error al modificar actividad'
            });
        }
    }
    else {
        return Response.error();
    }

}

export { POST };