
import { NextRequest } from "next/server";
import { prisma } from "../../client";
const POST = async (request: NextRequest) => {
    let { opcion } = await request.json() as { opcion: string };
    let eventos = await prisma.evento.findMany();
    if (opcion == 'activo') {
        eventos = eventos.filter(item => item.estado)
    }
    else if (opcion == 'concluido') {
        eventos = eventos.filter(item => !item.estado)
    }
    try {
        return Response.json(eventos);
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
        });
    }
}

export { POST };