import { NextRequest } from "next/server";
import { prisma } from "../../client";
const POST = async (request: NextRequest) => {
    try {
        let noticias = await prisma.noticia.findMany({
            orderBy: { id: 'desc' }
        });
        return Response.json(noticias);
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
        });
    }
}

export { POST };