import { NextRequest } from "next/server";
import { prisma } from "../../client";
const POST = async (request: NextRequest) => {


    try {
        const { carrera, tipo } = await request.json();
        console.log(carrera, tipo)
        let convenios = await prisma.convenio.findMany({
            include: { Institucion: true },
            where: {
                tipo,
                ConvenioCarrera: { every: { carreraId: carrera } }
            }
        });

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