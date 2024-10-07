
import { NextRequest } from "next/server";
import { prisma } from "../../client";
const POST = async (request: NextRequest) => {
    try {
        let personas = await prisma.persona.findMany({
            orderBy: {
                ci: 'desc'
            }
        });

        return Response.json(personas);
    } catch (error) {
        console.log(error)
        return Response.json([]);
    }
}

export { POST };