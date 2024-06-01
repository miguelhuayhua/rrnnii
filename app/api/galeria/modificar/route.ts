
import { NextRequest } from "next/server";
import { prisma } from "../../client";
import { writeFile } from "fs/promises";
import path from "path";
const POST = async (request: NextRequest) => {
    let form = await request.formData() as any;
    const file = form.get("portada");
    try {
        if (file) {

            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = Date.now() + file.name.replaceAll(" ", "_");
            await writeFile(path.join(process.cwd(), "public/uploads/" + filename), buffer);
            await prisma.galeria.update({
                data: {
                    imagen: `/uploads/${filename}`,
                },
                where: { id: form.get('id') }
            });
        }
        await prisma.galeria.update({
            data: {
                titulo: form.get('titulo'),
                descripcion: form.get('descripcion'),
            },
            where: { id: form.get('id') }
        });
        return Response.json({ error: false, mensaje: `Imagen modificado con éxito` });
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al modificar la imagen'
        });
    }
}

export { POST };