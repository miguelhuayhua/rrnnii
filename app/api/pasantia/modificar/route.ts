import { NextRequest } from "next/server";
import { prisma } from "../../client";
import { writeFile } from "fs/promises";
import path from "path";
const POST = async (request: NextRequest) => {
    let form = await request.formData() as any;
    const portada = form.get("portada");
    const documento = form.get('documento');
    const documentob = documento ? Buffer.from(await documento.arrayBuffer()) : null;
    const documenton = documento ? Date.now() + documento.name.replaceAll(" ", "_") : '';
    const institucion = form.get('institucion');
    try {
        if (portada) {
            const portadab = Buffer.from(await portada.arrayBuffer());
            const portadan = Date.now() + portada.name.replaceAll(" ", "_");
            await writeFile(path.join(process.cwd(), "public/uploads/pasantias/img/" + portadan), portadab);
            await prisma.pasantia.update({
                data: { imagen: portada ? `/uploads/pasantias/img/${portadan}` : '' },
                where: { id: form.get('id') }
            });
        }
        if (documentob) {
            await writeFile(path.join(process.cwd(), "public/uploads/pasantias/files/" + documenton), documentob);
            await prisma.pasantia.update({
                data: { pdf: `/uploads/pasantias/files/${documenton}` },
                where: { id: form.get('id') }
            });
        }
        else {
            await prisma.pasantia.update({
                data: { pdf: '' },
                where: { id: form.get('id') }
            });
        }
        if (institucion) {
            if (await prisma.institucion.findFirst({ where: { nombre: institucion } })) {
                await prisma.pasantia.update({
                    data: {
                        titulo: form.get('titulo'),
                        descripcion: form.get('descripcion'),
                        modalidad: form.get('modalidad'),
                        finalizacion: form.get('finalizacion'),
                        Institucion: { connect: { nombre: institucion } }
                    },
                    where: { id: form.get('id') }
                });
            } else {
                await prisma.pasantia.update({
                    data: {
                        titulo: form.get('titulo'),
                        descripcion: form.get('descripcion'),
                        modalidad: form.get('modalidad'),
                        finalizacion: form.get('finalizacion'),
                        Institucion: { create: { nombre: institucion, logo: '' } }
                    },
                    where: { id: form.get('id') }
                });
            }
            return Response.json({ error: false, mensaje: `Pasantia modificado con éxito` });
        }
        else {
            return Response.json({ error: true, mensaje: `No se pudo modificar. (sin institución)` });
        }
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al modificar pasantía'
        });
    }
}

export { POST };