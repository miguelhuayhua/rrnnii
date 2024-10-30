import { NextRequest } from "next/server";
import { prisma } from "../../client";
import axios from "axios";
import { fileDomain } from "@/utils/globals";
import { getToken } from "next-auth/jwt";
const POST = async (request: NextRequest) => {
    const token = await getToken({ secret: process.env.NEXTAUTH_SECRET as string, req: request });
    if (token?.name) {
        try {
            const { contacto, email, ubicacion } = await request.json();
            await prisma.unidad.update({
                where: { id: 'rrnnii' },
                data: {
                    contacto,
                    email,
                    ubicacion
                }
            })
            return Response.json({ error: false, mensaje: `Institución modificada con éxito` });
        } catch (error) {
            console.log(error)
            return Response.json({
                error: true,
                mensaje: 'Error al modificar unidad'
            });
        }
    }
    else {
        return Response.error();
    }
}

export { POST };