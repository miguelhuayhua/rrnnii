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
    const carreras = JSON.parse(form.get('carreras')) as string[];
    try {
        if (portada) {
            const portadab = Buffer.from(await portada.arrayBuffer());
            const portadan = Date.now() + portada.name.replaceAll(" ", "_");
            await writeFile(path.join(process.cwd(), "public/uploads/pasantias/img/" + portadan), portadab as any);
            await prisma.pasantia.update({
                data: { imagen: portada ? `/uploads/pasantias/img/${portadan}` : '' },
                where: { id: form.get('id') }
            });
        }
        if (documentob) {
            await writeFile(path.join(process.cwd(), "public/uploads/pasantias/files/" + documenton), documentob as any);
            await prisma.pasantia.update({
                data: { pdf: `/uploads/pasantias/files/${documenton}` },
                where: { id: form.get('id') }
            });
        }
        if (await prisma.institucion.findFirst({ where: { nombre: institucion } })) {
            await prisma.pasantia.update({
                data: {
                    titulo: form.get('titulo'),
                    descripcion: form.get('descripcion'),
                    modalidad: form.get('modalidad'),
                    finalizacion: form.get('finalizacion'),
                    Institucion: { connect: { nombre: institucion } },
                    PasantiaCarrera: {
                        createMany: {
                            data: carreras.map((value) => ({ carreraId: value })),
                            skipDuplicates: true
                        },
                    }
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
                    Institucion: { create: { nombre: institucion, logo: '' } },
                    PasantiaCarrera: {
                        createMany: {
                            data: carreras.map((value) => ({ carreraId: value })),
                            skipDuplicates: true
                        },
                    }
                },
                where: { id: form.get('id') }
            });
        }
        await prisma.pasantiaCarrera.deleteMany({
            where: { carreraId: { notIn: carreras } }
        });
        return Response.json({ error: false, mensaje: `Pasantia modificado con éxito` });

    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al modificar pasantía'
        });
    }
}

export { POST };