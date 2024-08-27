import { NextRequest } from "next/server";
import { prisma } from "../../client";
const POST = async () => {
    let convenios = await prisma.convenio.findMany({
        include: { Institucion: true, ConvenioCarrera: true }, orderBy: {
            createdAt: 'desc'
        }
    });
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