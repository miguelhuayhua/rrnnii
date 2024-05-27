
import { NextRequest } from "next/server";
import { prisma } from "../../client";
const POST = async (request: NextRequest) => {
    let { opcion } = await request.json() as { opcion: string };
    let galerias = await prisma.galeria.findMany();
    if (opcion == 'activo') {
        galerias = galerias.filter(item => item.estado)
    }
    else if (opcion == 'concluido') {
        galerias = galerias.filter(item => !item.estado)
    }
    try {
        return Response.json(galerias);
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
        });
    }
}

export { POST };