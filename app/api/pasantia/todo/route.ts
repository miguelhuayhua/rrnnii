
import { NextRequest } from "next/server";
import { prisma } from "../../client";
const POST = async (request: NextRequest) => {
    let { opcion } = await request.json() as { opcion: string };
    let pasantias = await prisma.pasantia.findMany({ include: { Institucion: true } });
    if (opcion == 'activo') {
        pasantias = pasantias.filter(item => item.estado)
    }
    else if (opcion == 'concluido') {
        pasantias = pasantias.filter(item => !item.estado)
    }
    try {
        return Response.json(pasantias);
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
        });
    }
}

export { POST };