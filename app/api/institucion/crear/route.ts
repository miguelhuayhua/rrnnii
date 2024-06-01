import { NextRequest } from "next/server";
import { prisma } from "../../client";
import { writeFile } from "fs/promises";
import path from "path";
const POST = async (request: NextRequest) => {
    let form = await request.formData() as any;
    const portada = form.get("portada");
    const portadab = Buffer.from(await portada.arrayBuffer());
    const portadan = Date.now() + portada.name.replaceAll(" ", "_");
    try {
        if (portada)
            await writeFile(path.join(process.cwd(), "public/uploads/instituciones/img/" + portadan), portadab);
        await prisma.institucion.create({
            data: {
                nombre: form.get('nombre'),
                contacto: +form.get('contacto'),
                logo: portada ? `/uploads/instituciones/img/${portadan}` : ''
            }
        });

        return Response.json({ error: false, mensaje: `Institución añadida con éxito` });
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al añadir la institución'
        });
    }
}

export { POST };