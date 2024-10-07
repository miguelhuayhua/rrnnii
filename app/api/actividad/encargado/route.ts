import { NextRequest } from "next/server";
import { prisma } from "../../client";
const POST = async (request: NextRequest) => {
    const { encargado, id } = await request.json()

    try {
        await prisma.actividad.update({
            data: { encargado },
            where: { id }
        });
        return Response.json({ error: false, mensaje: `Encargado modificado con éxito` });
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al modificar actividad'
        });
    }
}

export { POST };