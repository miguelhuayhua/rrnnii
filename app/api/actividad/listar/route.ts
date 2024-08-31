import { prisma } from "../../client";
const POST = async (request: Request) => {
    try {
        let { tipo, orden, skip } = await request.json();
        let actividades = await prisma.actividad.findMany({
            where: { estado: true, tipo: tipo || undefined },
            skip: skip || undefined
        });
        return Response.json(actividades);
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
        });
    }
}

export { POST };