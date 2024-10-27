import { NextRequest } from "next/server";
import { prisma } from "../../client";
import { getToken } from "next-auth/jwt";
const POST = async (request: NextRequest) => {
    const token = await getToken({ secret: process.env.NEXTAUTH_SECRET as string, req: request });
    if (token?.name) {
        try {
            await prisma.acciones.create({ data: { tabla: 'persona', Usuario: { connect: { usuario: token.name } }, tipo: 'crear' } });
            let Persona = await request.json();
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
    else {
        return Response.error();
    }
}

export { POST };