
import { NextRequest } from "next/server";
import { prisma } from "../../client";
const POST = async (request: NextRequest) => {
    let { opcion } = await request.json() as { opcion: string };
    let institucions = await prisma.institucion.findMany();
    if (opcion == 'activo') {
        institucions = institucions.filter(item => item.estado)
    }
    else if (opcion == 'concluido') {
        institucions = institucions.filter(item => !item.estado)
    }
    try {
        return Response.json(institucions);
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
        });
    }
}

export { POST };