import { NextRequest } from "next/server";
import { prisma } from "../../client";
import { getToken } from "next-auth/jwt";
const POST = async (request: NextRequest) => {
    const token = await getToken({ secret: process.env.NEXTAUTH_SECRET as string, req: request });
    if (token?.name) {
        try {
            let convenios = await prisma.convenio.findMany({
                include: { Institucion: true, ConvenioCarrera: true }, orderBy: {
                    createdAt: 'desc'
                }
            });

            return Response.json(convenios);
        }
        catch (error) {
            console.log(error)
            return Response.json({
                error: true,
                mensaje: 'Error al crear convenio'
            });
        }
    }

    else {
        return Response.error();

    }
}

export { POST };