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
    const institucion = form.get('institucion');
    try {
        await writeFile(path.join(process.cwd(), "public/uploads/pasantias/img/" + portadan), portadab);
        if (documentob)
            await writeFile(path.join(process.cwd(), "public/uploads/pasantias/files/" + documenton), documentob);
        if (await prisma.institucion.findFirst({ where: { nombre: institucion } })) {
            await prisma.pasantia.create({
                data: {
                    titulo: form.get('titulo'),
                    descripcion: form.get('descripcion'),
                    pdf: documento ? `/uploads/pasantias/files/${documenton}` : '',
                    imagen: `/uploads/pasantias/img/${portadan}`,
                    modalidad: form.get('modalidad'),
                    finalizacion: form.get('finalizacion'),
                    Institucion: { connect: { nombre: institucion } }
                },
            });
        } else {
            await prisma.pasantia.create({
                data: {
                    titulo: form.get('titulo'),
                    descripcion: form.get('descripcion'),
                    pdf: documento ? `/uploads/pasantias/files/${documenton}` : '',
                    imagen: `/uploads/pasantias/img/${portadan}`,
                    modalidad: form.get('modalidad'),
                    finalizacion: form.get('finalizacion'),
                    Institucion: { create: { nombre: institucion, logo: '' } }
                },
            });
        }
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