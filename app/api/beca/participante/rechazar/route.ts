import { NextRequest } from "next/server";
import { prisma } from "../../../client";
import { getToken } from 'next-auth/jwt'
import { fileDomain } from "@/utils/globals";
import axios from "axios";
const POST = async (request: NextRequest) => {
    const token = await getToken({ secret: process.env.NEXTAUTH_SECRET as string, req: request });
    if (token?.name) {
        try {
            let { id } = await request.json();
            let participante = await prisma.participanteBeca.delete({
                where: { id }
            });
            await axios.post(fileDomain + '/delete', { path: participante.rupath },
                { headers: { 'path': participante.rupath } }
            );
            await axios.post(fileDomain + '/delete', { path: participante.cipath },
                { headers: { 'path': participante.cipath } }
            );
            return Response.json({ error: false, mensaje: `Participante eliminado` });
        } catch (error) {
            console.log(error)
            return Response.json({
                error: true,
                mensaje: 'Error al rechazar participante'
            });
        }
    }
    else {
        return Response.error();
    }

}

export { POST };