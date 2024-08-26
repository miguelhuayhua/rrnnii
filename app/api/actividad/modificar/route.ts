
import { NextRequest } from "next/server";
import { prisma } from "../../client";
import { writeFile } from "fs/promises";
import path from "path";
const POST = async (request: NextRequest) => {
    let form = await request.formData() as any;
    const portada = form.get("portada");
    const portadab = portada ? Buffer.from(await portada.arrayBuffer()) : null;
    const portadan = portada ? Date.now() + portada.name.replaceAll(" ", "_") : '';
    const documento = form.get('documento');
    const documentob = documento ? Buffer.from(await documento.arrayBuffer()) : null;
    const documenton = documento ? Date.now() + documento.name.replaceAll(" ", "_") : '';
    try {
        if (portadab) {
            await writeFile(path.join(process.cwd(), "public/uploads/actividades/img/" + portadan), portadab as any);
            await prisma.actividad.update({
                data: {
                    imagen: portada ? `/uploads/actividades/img/${portadan}` : '',
                },
                where: { id: form.get('id') }
            });
        }
        if (documentob) {
            await writeFile(path.join(process.cwd(), "public/uploads/actividades/files/" + documenton), documentob as any);
            await prisma.actividad.update({
                data: {
                    pdf: `/uploads/actividades/files/${documenton}`,
                    titulo: form.get('titulo'),
                    descripcion: form.get('descripcion'),
                    tipo: form.get('tipo'),
                },
                where: { id: form.get('id') }
            });
        }
        else {
            await prisma.actividad.update({
                data: {
                    pdf: '', titulo: form.get('titulo'),
                    descripcion: form.get('descripcion'),
                    tipo: form.get('tipo'),
                },
                where: { id: form.get('id') }
            });
        }
        return Response.json({ error: false, mensaje: `Actividad modificada con éxito` });
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al modificar actividad'
        });
    }
}

export { POST };