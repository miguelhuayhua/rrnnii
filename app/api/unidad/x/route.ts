import { NextRequest } from "next/server";
import { prisma } from "../../client";
const POST = async (request: NextRequest) => {
    const Unidad = await prisma.unidad.findFirst({
        where: { id: 'rrnnii' },

    })
    return Response.json(Unidad);
}
export { POST };