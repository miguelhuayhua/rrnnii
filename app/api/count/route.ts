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
        let sizen = await prisma.noticia.count({
            where: { estado: true }
        });
        let contacto = await prisma.unidad.findFirst({ where: { id: 'rrnnii' } });
        let sizev = await prisma.visitantes.count();
        return Response.json({ sizec, sizeb, sizee, sizen, sizev, contacto: contacto?.contacto });
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
        });
    }
}

export { POST };