
import { NextRequest } from "next/server";
import { prisma } from "../../client";
import { writeFile } from "fs/promises";
import path from "path";
const POST = async (request: NextRequest) => {
    let form = await request.formData() as any;
    const imagen = form.get("imagen");
    const bufferImg = imagen ? Buffer.from(await imagen.arrayBuffer()) : null;
    const imagenName = imagen ? Date.now() + imagen.name.replaceAll(" ", "_") : '';
    const doc = form.get('doc');
    const bufferDoc = doc ? Buffer.from(await doc.arrayBuffer()) : null;
    const docName = doc ? Date.now() + doc.name.replaceAll(" ", "_") : '';
    try {
        if (bufferImg) {
            await writeFile(path.join(process.cwd(), "public/uploads/eventos/img/" + imagenName), bufferImg);
            await prisma.evento.update({
                data: { imagen: imagen ? `/uploads/eventos/img/${imagenName}` : '' },
                where: { id: form.get('id') }
            });
        }
        if (bufferDoc) {
            await writeFile(path.join(process.cwd(), "public/uploads/eventos/files/" + docName), bufferDoc);
            await prisma.evento.update({
                data: { pdf: `/uploads/eventos/files/${docName}` },
                where: { id: form.get('id') }
            });
        }
        else {
            await prisma.evento.update({
                data: { pdf: '' },
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