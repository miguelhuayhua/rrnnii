import { NextRequest } from "next/server";
import { prisma } from "../../client";
const POST = async (request: NextRequest) => {
    const Persona = await request.json();
    try {
        await prisma.persona.update({
            data: Persona,
            where: { ci: Persona.ci }
        });
        return Response.json({ error: false, mensaje: `Personal modificado con éxito` });

    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al modificar personal'
        });
    }
}

export { POST };