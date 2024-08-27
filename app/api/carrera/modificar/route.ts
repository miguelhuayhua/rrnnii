import { NextRequest } from "next/server";
import { prisma } from "../../client";
import { writeFile } from "fs/promises";
import path from "path";
const POST = async (request: NextRequest) => {
    let form = await request.formData() as any;
    const portada = form.get("portada");
    const portadab = portada ? Buffer.from(await portada.arrayBuffer()) : null;
    const portadan = portada ? Date.now() + portada.name.replaceAll(" ", "_") : '';
    try {
        if (portadab) {
            await writeFile(path.join(process.cwd(), "public/uploads/carreras/img/" + portadan), portadab as any);
            await prisma.carrera.update({
                data: { logo: portada ? `/uploads/carreras/img/${portadan}` : '' },
                where: { id: form.get('id') }
            });
        }
        await prisma.carrera.update({
            data: {
                nombre: form.get('nombre').toUpperCase(),
                contacto: +form.get('contacto'),
            },
            where: { id: form.get('id') }
        });
        return Response.json({ error: false, mensaje: `Institución modificada con éxito` });
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al modificar carrera'
        });
    }
}

export { POST };