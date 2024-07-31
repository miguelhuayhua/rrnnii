
import { NextRequest } from "next/server";
import { prisma } from "../../client";
const POST = async (request: NextRequest) => {
    let { take } = await request.json();
    try {
        let eventos = await prisma.evento.findMany({ take });

        return Response.json(eventos);
    } catch (error) {
        console.log(error)
        return Response.json([]);
    }
}

export { POST };