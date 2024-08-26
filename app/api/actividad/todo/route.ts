import { NextRequest } from "next/server";
import { prisma } from "../../client";
const POST = async (request: NextRequest) => {
    let { take } = await request.json();
    try {
        let actividades = await prisma.actividad.findMany({ take, orderBy: { id: 'desc' } });
        return Response.json(actividades);
    } catch (error) {
        console.log(error)
        return Response.json([]);
    }
}

export { POST };