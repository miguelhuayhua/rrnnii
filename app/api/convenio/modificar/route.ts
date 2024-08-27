
import { NextRequest } from "next/server";
import { prisma } from "../../client";
import { writeFile } from "fs/promises";
import path from "path";
const POST = async (request: NextRequest) => {
    let form = await request.formData() as any;
    const portada = form.get("portada");
    const documento = form.get('documento');
    const institucion = form.get('institucion');
    const carreras = JSON.parse(form.get('carreras')) as string[];
    try {
        if (portada) {
            const portadab = Buffer.from(await portada.arrayBuffer());
            const portadan = Date.now() + portada.name.replaceAll(" ", "_");
            await writeFile(path.join(process.cwd(), "public/uploads/convenios/img/" + portadan), portadab as any);
            await prisma.convenio.update({
                data: { imagen: portada ? `/uploads/convenios/img/${portadan}` : '' },
                where: { id: form.get('id') }
            });
        }
        if (documento) {
            const documentob = Buffer.from(await documento.arrayBuffer());
            const documenton = Date.now() + documento.name.replaceAll(" ", "_");
            await writeFile(path.join(process.cwd(), "public/uploads/convenios/files/" + documenton), documentob as any);
            await prisma.convenio.update({
                data: { pdf: `/uploads/convenios/files/${documenton}` },
                where: { id: form.get('id') }
            });
        }
        if (await prisma.institucion.findFirst({ where: { nombre: institucion } })) {
            await prisma.convenio.update({
                data: {
                    titulo: form.get('titulo'),
                    descripcion: form.get('descripcion'),
                    tipo: form.get('tipo'),
                    finalizacion: form.get('finalizacion'),
                    Institucion: {
                        connect: { nombre: institucion }
                    },
                    ConvenioCarrera: {
                        createMany: {
                            data: carreras.map((value) => ({ carreraId: value })),
                            skipDuplicates: true
                        },
                    }
                },
                where: { id: form.get('id') }
            });
        }
        else {
            await prisma.convenio.update({
                data: {
                    titulo: form.get('titulo'),
                    descripcion: form.get('descripcion'),
                    tipo: form.get('tipo'),
                    finalizacion: form.get('finalizacion'),
                    Institucion: {
                        create: { nombre: institucion, logo: '' }
                    },
                    ConvenioCarrera: {
                        createMany: {
                            data: carreras.map((value) => ({ carreraId: value })),
                            skipDuplicates: true
                        }
                    }
                },
                where: { id: form.get('id') }
            });
        }
        await prisma.convenioCarrera.deleteMany({
            where: { carreraId: { notIn: carreras } }
        });
        return Response.json({ error: false, mensaje: `Convenio modificado con éxito` });
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al modificar convenio'
        });
    }
}

export { POST };