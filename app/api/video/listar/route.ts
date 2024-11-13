import { prisma } from "../../client";
const POST = async (request: Request) => {
    try {
        let { orden, take, skip } = await request.json();
        take = take || 15;
        skip = skip || 0;
        let videos = await prisma.video.findMany({
            where: {
                estado: true
            },
            orderBy: { createdAt: orden == '0' ? 'desc' : 'asc' },
            take,
            skip: take * skip
        });
        return Response.json(videos);
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
        });
    }
}

export { POST };