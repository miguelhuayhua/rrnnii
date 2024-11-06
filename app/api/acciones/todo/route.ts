
import { NextRequest } from "next/server";
import { prisma } from "../../client";
const POST = async (request: NextRequest) => {
    try {
        let acciones = await prisma.acciones.findMany({
            orderBy: {
                id: 'desc',

            },
            include: { Usuario: true }
        });

        return Response.json(acciones);
    } catch (error) {
        console.log(error)
        return Response.json([]);
    }
}

export { POST };