import { NextRequest } from "next/server";
import { prisma } from "../../client";
import { writeFile } from "fs/promises";
import path from "path";
const POST = async (request: NextRequest) => {
    let form = await request.formData() as any;
    const imagen = form.get("imagen");
    const bufferImg = Buffer.from(await imagen.arrayBuffer());
    const imagenName = Date.now() + imagen.name.replaceAll(" ", "_");
    const doc = form.get('doc');
    console.log(typeof doc)
    const bufferDoc = doc ? Buffer.from(await doc.arrayBuffer()) : null;
    const docName = doc ? Date.now() + doc.name.replaceAll(" ", "_") : '';
    try {
        await writeFile(path.join(process.cwd(), "public/uploads/eventos/img/" + imagenName), bufferImg);
        if (bufferDoc)
            await writeFile(path.join(process.cwd(), "public/uploads/eventos/files/" + docName), bufferDoc);
        await prisma.evento.create({
            data: {
                titulo: form.get('titulo'),
                descripcion: form.get('descripcion'),
                pdf: doc ? `/uploads/eventos/files/${docName}` : '',
                imagen: `/uploads/eventos/img/${imagenName}`,
                tipo: form.get('tipo'),
                link: form.get('link'),
                inicio: form.get('inicio')
            }
        });
        return Response.json({ error: false, mensaje: `Evento creado con éxito` });
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al crear el evento'
        });
    }
}

export { POST };