
import { NextRequest } from "next/server";
import { prisma } from "../../client";
import { writeFile } from "fs/promises";
import path from "path";
const POST = async (request: NextRequest) => {
    let form = await request.formData() as any;
    const portada = form.get("portada");
    const portadab = Buffer.from(await portada.arrayBuffer());
    const portadan = Date.now() + portada.name.replaceAll(" ", "_");
    const documento = form.get('documento');
    const documentob = documento ? Buffer.from(await documento.arrayBuffer()) : null;
    const documenton = documento ? Date.now() + documento.name.replaceAll(" ", "_") : '';
    try {
        await writeFile(path.join(process.cwd(), "public/uploads/actividades/img/" + portadan), portadab as any);
        if (documentob)
            await writeFile(path.join(process.cwd(), "public/uploads/actividades/files/" + documenton), documentob as any);
        await prisma.actividad.create({
            data: {
                titulo: form.get('titulo'),
                descripcion: form.get('descripcion'),
                pdf: documento ? `/uploads/actividades/files/${documenton}` : '',
                imagen: `/uploads/actividades/img/${portadan}`,
                tipo: form.get('tipo'),
                referencia: form.get('referencia')
            }
        });
        return Response.json({ error: false, mensaje: `Actividad creada con éxito` });
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al crear la actividad'
        });
    }
}

export { POST };