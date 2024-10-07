import { NextRequest } from "next/server";
import { prisma } from "../../client";
const POST = async (request: NextRequest) => {
    let { estado, ci } = await request.json();
    try {
        await prisma.persona.update({
            data: { estado },
            where: { ci }
        });
        return Response.json({ error: false, mensaje: `Personal ${estado ? 'Activado' : 'Desactivado'}` });
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al modificar estado'
        });
    }
}

export { POST };