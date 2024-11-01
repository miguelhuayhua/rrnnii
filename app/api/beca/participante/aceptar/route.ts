import { NextRequest } from "next/server";
import { prisma } from "../../../client";
import { getToken } from 'next-auth/jwt'
const POST = async (request: NextRequest) => {
    const token = await getToken({ secret: process.env.NEXTAUTH_SECRET as string, req: request });
    if (token?.name) {
        try {
            let { id } = await request.json();
            console.log(id)
            await prisma.participanteBeca.update({
                where: { id }, data: { aceptado: true }
            });
            return Response.json({ error: false, mensaje: `Participante aceptado` });
        } catch (error) {
            console.log(error)
            return Response.json({
                error: true,
                mensaje: 'Error al aceptar participante'
            });
        }
    }
    else {
        return Response.error();
    }

}

export { POST };