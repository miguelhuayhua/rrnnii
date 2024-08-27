import { NextRequest } from "next/server";
import { prisma } from "../../client";
import { writeFile } from "fs/promises";
import path from "path";
const POST = async (request: NextRequest) => {
    let form = await request.formData() as any;
    const portada = form.get("portada");
    const documento = form.get('documento');
    let pathdoc = '';
    let pathimg = '';
    const institucion = form.get('institucion');
    const carreras = JSON.parse(form.get('carreras')) as string[];
    try {
        if (portada) {
            const portadab = Buffer.from(await portada.arrayBuffer());
            const portadan = Date.now() + portada.name.replaceAll(" ", "_");
            pathimg = "/uploads/pasantias/img/" + portadan;
            await writeFile(path.join(process.cwd(), "public" + pathimg), portadab as any);
        }
        if (documento) {
            const documentob = Buffer.from(await documento.arrayBuffer());
            const documenton = Date.now() + documento.name.replaceAll(" ", "_");
            pathdoc = "/uploads/pasantias/files/" + documenton;
            await writeFile(path.join(process.cwd(), "public" + pathdoc), documentob as any);
        }
        if (await prisma.institucion.findFirst({ where: { nombre: institucion } })) {
            await prisma.pasantia.create({
                data: {
                    titulo: form.get('titulo'),
                    descripcion: form.get('descripcion'),
                    pdf: pathdoc,
                    imagen: pathimg,
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
            });
        } else {
            await prisma.pasantia.create({
                data: {
                    titulo: form.get('titulo'),
                    descripcion: form.get('descripcion'),
                    pdf: pathdoc,
                    imagen: pathimg,
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