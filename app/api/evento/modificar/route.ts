
import { NextRequest } from "next/server";
import { prisma } from "../../client";
import { writeFile } from "fs/promises";
import path from "path";
const POST = async (request: NextRequest) => {
    let form = await request.formData() as any;
    const imagen = form.get("imagen");
    const doc = form.get('doc');
    try {
        if (imagen) {
            const bufferImg = Buffer.from(await imagen.arrayBuffer());
            const imagenName = Date.now() + imagen.name.replaceAll(" ", "_");
            await writeFile(path.join(process.cwd(), "public/uploads/eventos/img/" + imagenName), bufferImg as any);
            await prisma.evento.update({
                data: { imagen: imagen ? `/uploads/eventos/img/${imagenName}` : '' },
                where: { id: form.get('id') }
            });
        }
        if (doc) {
            const bufferDoc = Buffer.from(await doc.arrayBuffer());
            const docName = Date.now() + doc.name.replaceAll(" ", "_");
            await writeFile(path.join(process.cwd(), "public/uploads/eventos/files/" + docName), bufferDoc as any);
            await prisma.evento.update({
                data: { pdf: `/uploads/eventos/files/${docName}` },
                where: { id: form.get('id') }
            });
        }
        await prisma.evento.update({
            data: {
                titulo: form.get('titulo'),
                descripcion: form.get('descripcion'),
                tipo: form.get('tipo'),
                link: form.get('link'),
                inicio: form.get('inicio')
            },
            where: { id: form.get('id') }
        });
        return Response.json({ error: false, mensaje: `Evento modificado con éxito` });
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al modificar evento'
        });
    }
}

export { POST };