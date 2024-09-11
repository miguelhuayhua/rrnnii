import { prisma } from "../../client";
const POST = async (request: Request) => {
    try {
        let { tipo, orden, skip, id } = await request.json();
        let actividades = await prisma.actividad.findMany({
            where: {
                estado: true, tipo: tipo || undefined,
                id: { not: id || undefined }
            },
            skip: skip || undefined,

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