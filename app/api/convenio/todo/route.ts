
import { NextRequest } from "next/server";
import { prisma } from "../../client";
const POST = async (request: NextRequest) => {
    let { opcion } = await request.json() as { opcion: string };
    let convenios = await prisma.convenio.findMany();
    if (opcion == 'activo') {
        convenios = convenios.filter(item => item.estado)
    }
    else if (opcion == 'concluido') {
        convenios = convenios.filter(item => !item.estado)
    }
    try {
        return Response.json(convenios);
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al crear convenio'
        });
    }
}

export { POST };