import { NextRequest } from "next/server";
import { prisma } from "../../client";
import { writeFile } from "fs/promises";
import path from "path";
const POST = async (request: NextRequest) => {
    let form = await request.formData() as any;
    const file = form.get("file");
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = Date.now() + file.name.replaceAll(" ", "_");
    try {
        await writeFile(path.join(process.cwd(), "public/uploads/" + filename), buffer as any);
        await prisma.galeria.create({
            data: {
                titulo: form.get('titulo'),
                descripcion: form.get('descripcion'),
                imagen: `/uploads/${filename}`,
            }
        });
        return Response.json({ error: false, mensaje: `Imagen creado con éxito` });
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al crear la imagen'
        });
    }
}

export { POST };