import { prisma } from "../../client";
const POST = async (request: Request) => {
    try {
        let { skip, id } = await request.json();
        let becas = await prisma.beca.findMany({
            where: {
                estado: true,
                id: { not: id || undefined }
            },
            skip: skip || undefined,
            include: {
                Participantes: true
            }
        });
        return Response.json(becas);
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
        });
    }
}

export { POST };