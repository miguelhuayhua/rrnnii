
import { NextRequest } from "next/server";
import { prisma } from "../../client";
const POST = async (request: NextRequest) => {
    try {
        const { take } = await request.json();
        let galerias = await prisma.galeria.findMany({
            take,
            orderBy: { id: 'desc' }
        });
        return Response.json(galerias);
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
        });
    }
}

export { POST };