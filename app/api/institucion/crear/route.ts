import { NextRequest } from "next/server";
import { prisma } from "../../client";
import { writeFile } from "fs/promises";
import path from "path";
const POST = async (request: NextRequest) => {
    let form = await request.formData() as any;
    const portada = form.get("portada");
    const institucion = await prisma.institucion.findFirst({ where: { nombre: form.get('nombre').toUpperCase() } })
    try {
        if (!institucion) {
            if (portada) {
                const portadab = Buffer.from(await portada.arrayBuffer());
                const portadan = Date.now() + portada.name.replaceAll(" ", "_");
                await writeFile(path.join(process.cwd(), "public/uploads/instituciones/img/" + portadan), portadab as any);
                await prisma.institucion.create({
                    data: {
                        nombre: form.get('nombre'),
                        contacto: +form.get('contacto'),
                        logo: portada ? `/uploads/instituciones/img/${portadan}` : ''
                    }
                });
            }
            else {
                await prisma.institucion.create({
                    data: {
                        nombre: form.get('nombre'),
                        contacto: +form.get('contacto'),
                        logo: ''
                    }
                });
            }
            return Response.json({ error: false, mensaje: `Institución añadida con éxito` });
        }
        else {
            return Response.json({ error: false, mensaje: `Institución ya existente` });
        }
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al añadir la institución'
        });
    }
}

export { POST };