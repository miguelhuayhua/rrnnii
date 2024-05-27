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
        await writeFile(path.join(process.cwd(), "public/uploads/pasantias/img/" + portadan), portadab);
        if (documentob)
            await writeFile(path.join(process.cwd(), "public/uploads/pasantias/files/" + documenton), documentob);
        await prisma.pasantia.create({
            data: {
                titulo: form.get('titulo'),
                descripcion: form.get('descripcion'),
                pdf: documento ? `/uploads/actividades/files/${documenton}` : '',
                imagen: `/uploads/actividades/img/${portadan}`,
                logo: '',
                modalidad: form.get('modalidad'),
                finalizacion: form.get('finalizacion'),
                institucion: form.get('institucion')
            }
        });

        return Response.json({ error: false, mensaje: `Pasantia creada con éxito` });
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al crear la pasantía'
        });
    }
}

export { POST };