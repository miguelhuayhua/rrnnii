import { NextRequest } from "next/server";
import { prisma } from "../../client";
const POST = async (request: NextRequest) => {
    let { take } = await request.json();
    try {
        let becas = await prisma.beca.findMany({
            take, orderBy: { id: 'desc' },
            include: {
                Participantes: true,
                Institucion: true
            }
        });
        return Response.json(becas);
    } catch (error) {
        console.log(error)
        return Response.json([]);
    }
}

export { POST };