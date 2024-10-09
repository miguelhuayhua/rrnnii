import { NextRequest } from "next/server";
import { prisma } from "../../client";
const POST = async (request: NextRequest) => {
    try {
        let pasantias = await prisma.pasantia.findMany({ include: { Institucion: true, PasantiaCarrera: true }, orderBy: { id: 'desc' } });
        return Response.json(pasantias);
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
        });
    }
}

export { POST };