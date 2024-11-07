import { NextRequest } from "next/server";
import { prisma } from "../../client";
import { getToken } from "next-auth/jwt";
const POST = async (request: NextRequest) => {
    const token = await getToken({ secret: process.env.NEXTAUTH_SECRET as string, req: request });
    if (token?.name) {
        try {
            const { usuario } = await request.json();
            let res = await prisma.usuario.findFirst({
                where: { usuario }
            });
            return Response.json({ existe: res ? true : false, error: false });
        } catch (error) {
            console.log(error)
            return Response.json({
                error: true,
                mensaje: 'Error al modificar personal'
            });
        }
    }
    else {
        return Response.error();
    }
}

export { POST };