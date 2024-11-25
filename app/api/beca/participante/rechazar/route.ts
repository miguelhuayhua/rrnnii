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
            let archivos = await prisma.archivo.findMany({ where: { participanteBecaid: id } });
            archivos.map(async value => {
                await axios.post(fileDomain + '/delete', {
                }, {
                    headers: {
                        path: value.ruta
                    }
                });
            });
            await prisma.archivo.deleteMany({
                where: { participanteBecaid: id }
            });
            await prisma.participanteBeca.delete({ where: { id } });
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