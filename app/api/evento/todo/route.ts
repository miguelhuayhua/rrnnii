
import { NextRequest } from "next/server";
import { prisma } from "../../client";
const POST = async (request: NextRequest) => {
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

export { POST };