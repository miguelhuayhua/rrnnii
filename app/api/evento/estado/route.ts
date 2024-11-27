import { NextRequest } from "next/server";
import { prisma } from "../../client";
import { getToken } from "next-auth/jwt";
const POST = async (request: NextRequest) => {
    const token = await getToken({ secret: process.env.NEXTAUTH_SECRET as string, req: request });
    if (token?.name) {
        try {
            let { estado, id } = await request.json();

            await prisma.evento.update({
                data: {
                    estado
                },
                where: { id }
            });
            return Response.json({ error: false, mensaje: `Evento ${estado ? 'Activado' : 'Desactivado'}` });
        } catch (error) {
            console.log(error)
            return Response.json({
                error: true,
                mensaje: 'Error al modificar estado'
            });
        }
    }
    else return Response.error();
}

export { POST };