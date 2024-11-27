
import { NextRequest } from "next/server";
import { prisma } from "../../client";
import { getToken } from "next-auth/jwt";
const POST = async (request: NextRequest) => {
    const token = await getToken({ secret: process.env.NEXTAUTH_SECRET as string, req: request });
    if (token?.name) {
        try {
            let eventos = await prisma.evento.findMany({
                orderBy: {
                    id: 'desc'
                }
            });

            return Response.json(eventos);
        } catch (error) {
            console.log(error)
            return Response.json([]);
        }
    }
    else {
        return Response.error();
    }
}

export { POST };