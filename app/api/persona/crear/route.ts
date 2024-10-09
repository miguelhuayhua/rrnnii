import { NextRequest } from "next/server";
import { prisma } from "../../client";
const POST = async (request: NextRequest) => {
    let Persona = await request.json();
    try {
        await prisma.persona.create({
            data: Persona
        });
        return Response.json({ error: false, mensaje: `Persona creado con éxito` });
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al agregar personal'
        });
    }
}

export { POST };