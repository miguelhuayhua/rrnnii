import { NextRequest } from "next/server";
import { prisma } from "../../client";
const POST = async (request: NextRequest) => {
    const { personaCi } = await request.json();
    try {
        let usuario = await prisma.usuario.findFirst({
            where: { personaCi },
            select: {
                avatar: true,
                rol: true,
                usuario: true
            }
        });
        return Response.json(usuario);
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al modificar personal'
        });
    }
}

export { POST };