import { prisma } from "../client";

const POST = async (request: Request) => {
    try {
        let sizec = await prisma.convenio.count({
            where: {
                estado: true,

            }
        });
        let sizeb = await prisma.beca.count({
            where: {
                estado: true
            }
        })
        let sizee = await prisma.evento.count({
            where: { estado: true }
        });
        let sizen = await prisma.evento.count({
            where: { estado: true }
        })
        return Response.json({ sizec, sizeb, sizee, sizen });
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
        });
    }
}

export { POST };