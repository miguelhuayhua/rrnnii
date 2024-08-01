
import { NextRequest } from "next/server";
import { prisma } from "../../client";
const POST = async (request: NextRequest) => {
    try {
        let institucions = await prisma.institucion.findMany({
            orderBy: {
                id: 'desc'
            }
        });
        return Response.json(institucions);
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
        });
    }
}

export { POST };