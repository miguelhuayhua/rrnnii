import { NextRequest } from "next/server";
import { prisma } from "../../client";
const POST = async (request: NextRequest) => {
    try {
        let { orden, skip } = await request.json();
        let noticias = await prisma.noticia.findMany({
            where: {
                estado: true
            },
            orderBy: {
                id: orden == '1' ? 'asc' : 'desc'
            },
            skip: skip * 10,
            take: 10
        });
        return Response.json(noticias);
    } catch (error) {
        console.log(error)
        return Response.json([]);
    }
}

export { POST };