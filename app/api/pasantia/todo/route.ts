import { NextRequest } from "next/server";
import { prisma } from "../../client";
import { getToken } from "next-auth/jwt";
const POST = async (request: NextRequest) => {
    const token = await getToken({ secret: process.env.NEXTAUTH_SECRET as string, req: request });
    if (token?.name) {
        try {
            let pasantias = await prisma.pasantia.findMany({
                include: {
                    Institucion: true, PasantiaCarrera: {
                        include: { Carrera: true }
                    }
                }, orderBy: { id: 'desc' }
            });
            return Response.json(pasantias);
        } catch (error) {
            console.log(error)
            return Response.json({
                error: true,
            });
        }
    }
    else
        return Response.error();
}

export { POST };