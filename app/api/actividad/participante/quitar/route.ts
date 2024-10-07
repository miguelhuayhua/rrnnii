import { prisma } from "@/app/api/client";
import { NextRequest } from "next/server";
const POST = async (request: NextRequest) => {
    const { id } = await request.json()

    try {
        let participante = await prisma.participante.delete({
            where: { id }
        })
        return Response.json({ error: false, mensaje: `Participante ${participante.nombre_completo} eliminado` });
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al modificar actividad'
        });
    }
}

export { POST };