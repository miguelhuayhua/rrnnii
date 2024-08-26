import { NextRequest } from "next/server";
import { prisma } from "../../client";
const POST = async (request: NextRequest) => {
    let { estado, id } = await request.json();
    try {

        await prisma.convenio.update({
            data: {
                estado
            },
            where: { id }
        });
        return Response.json({ error: false, mensaje: `Convenio ${estado ? 'Activado' : 'Desactivado'}` });
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al modificar estado'
        });
    }
}

export { POST };