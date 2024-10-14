import { NextRequest } from "next/server";
import { prisma } from "../../client";
const POST = async (request: NextRequest) => {
    try {
        let { orden, skip, take } = await request.json();
        take = take || 15;
        skip = skip || 0;
        let noticias = await prisma.noticia.findMany({
            where: {
                estado: true
            },
            orderBy: {
                id: orden == '1' ? 'asc' : 'desc'
            },
            skip: skip * take,
            take
        });
        return Response.json(noticias);
    } catch (error) {
        console.log(error)
        return Response.json([]);
    }
}

export { POST };