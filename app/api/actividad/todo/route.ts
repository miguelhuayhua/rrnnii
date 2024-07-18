
import { NextRequest } from "next/server";
import { prisma } from "../../client";
const POST = async (request: NextRequest) => {
    let { opcion } = await request.json() as { opcion: string };
    let actividades = await prisma.actividad.findMany();
    if (opcion == 'activo') {
        actividades = actividades.filter((item: any) => item.estado)
    }
    else if (opcion == 'concluido') {
        actividades = actividades.filter((item: any) => !item.estado)
    }
    try {
        return Response.json(actividades);
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al crear actividad'
        });
    }
}

export { POST };