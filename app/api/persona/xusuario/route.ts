import { NextRequest } from "next/server";
import { prisma } from "../../client";
const POST = async (request: NextRequest) => {
    const { usuario } = await request.json();
    try {
        let persona = await prisma.persona.findFirst({
            where: { Usuario: { usuario } },
        });
        console.log(persona)
        return Response.json(persona);
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error'
        });
    }
}

export { POST };