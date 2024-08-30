import { prisma } from "../../client";
const POST = async () => {
    try {
        let carreras = await prisma.carrera.findMany({
            orderBy: {
                id: 'desc'
            }
        });
        return Response.json(carreras);
    } catch (error) {
        console.log(error)
        return Response.json([]);
    }
}

export { POST };