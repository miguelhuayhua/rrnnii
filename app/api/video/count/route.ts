
import { NextRequest } from "next/server";
import { prisma } from "../../client";
const POST = async (request: NextRequest) => {
    let { id } = await request.json();
    try {
        await prisma.video.update({ where: { id }, data: { conteo: { increment: 1 } } })
        return Response.json({ error: false });
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al modificar estado'
        });
    }
}

export { POST };