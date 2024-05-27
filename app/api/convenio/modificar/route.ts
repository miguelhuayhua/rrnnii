
import { NextRequest } from "next/server";
import { prisma } from "../../client";
import { Convenio } from "@prisma/client";

const POST = async (request: NextRequest) => {
    let {
        titulo,
        descripcion,
        finalizacion,
        institucion,
        logo,
        tipo,
        id
    } = await request.json() as Convenio;
    console.log(institucion)
    try {
        await prisma.convenio.update({
            data: {
                titulo,
                descripcion,
                finalizacion,
                institucion,
                logo,
                tipo,
                pdf: ''
            },
            where: { id }
        });
        return Response.json({ error: false, mensaje: `Convenio modificado con éxito` });
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al crear convenio'
        });
    }
}

export { POST };