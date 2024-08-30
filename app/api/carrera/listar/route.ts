import { prisma } from "../../client";
const POST = async (request: Request) => {
    try {
        let carreras = await prisma.carrera.findMany({
            orderBy: {
                nombre: 'asc',
            },
            where: { estado: true,  }
        });
        return Response.json(carreras);
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
        });
    }
}

export { POST };