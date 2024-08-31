import { NextRequest } from "next/server";
import { prisma } from "../../client";
import { writeFile } from "fs/promises";
import path from "path";
const POST = async (request: NextRequest) => {
    let form = await request.formData() as any;
    const portada = form.get("portada");
    let carrera = await prisma.carrera.findFirst({ where: { nombre: form.get('nombre').toUpperCase() } });
    try {
        if (carrera) {
            return Response.json({ error: false, mensaje: `Carrera existente` });
        }
        else {
            if (portada) {
                const portadab = Buffer.from(await portada.arrayBuffer());
                const portadan = Date.now() + portada.name.replaceAll(" ", "_");
                await writeFile(path.join(process.cwd(), "public/uploads/carreras/img/" + portadan), portadab as any);
                await prisma.carrera.create({
                    data: {
                        nombre: form.get('nombre').toUpperCase(),
                        contacto: +form.get('contacto'),
                        logo: portada ? `/uploads/carreras/img/${portadan}` : ''
                    }
                });
            }
            else {
                await prisma.carrera.create({
                    data: {
                        nombre: form.get('nombre').toUpperCase(),
                        contacto: +form.get('contacto'),
                        logo: ''
                    }
                });
            }
            return Response.json({ error: false, mensaje: `Carrera añadida con éxito` });

        }
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al añadir la carrera'
        });
    }
}

export { POST };