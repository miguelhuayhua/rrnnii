import { NextRequest } from "next/server";
import { prisma } from "../../client";
const POST = async (request: NextRequest) => {
    const { Participante, id } = await request.json()

    try {
        await prisma.participante.create({
            data: {
                actividadId: id,
                nombre_completo: Participante.nombre_completo,
                contacto: Participante.contacto
            }
        })
        return Response.json({ error: false, mensaje: `Participante agregado` });
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al modificar actividad'
        });
    }
}

export { POST };