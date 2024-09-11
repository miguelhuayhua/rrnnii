import { NextRequest } from "next/server";
import { prisma } from "../../client";
import axios from "axios";
const POST = async (request: NextRequest) => {
    let form = await request.formData() as any;
    const portada = form.get("portada");
    const documento = form.get('documento');
    const institucion = form.get('institucion');
    const carreras = JSON.parse(form.get('carreras')) as string[];
    try {
        const formimg = new FormData();
        const formdoc = new FormData();
        formimg.append('file', portada);
        formdoc.append('file', documento);
        let resimage = await axios.post('http://localhost:4000/upload', formimg, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'modo': 'convenio',
                'tipo': 'img'
            }
        });
        let resdoc = await axios.post('http://localhost:4000/upload', formdoc, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'modo': 'convenio',
                'tipo': 'doc'
            }
        });
        await prisma.pasantiaCarrera.deleteMany({
            where: { pasantiaId: form.get('id') }
        });
        if (await prisma.institucion.findFirst({ where: { nombre: institucion } })) {
            await prisma.pasantia.update({
                data: {
                    titulo: form.get('titulo'),
                    descripcion: form.get('descripcion'),
                    modalidad: form.get('modalidad'),
                    finalizacion: form.get('finalizacion'),
                    ...portada ? ({ imagen: resimage.data.path }) : null,
                    ...documento ? ({ pdf: resdoc.data.path }) : null,
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
                    imagen: resimage.data.path, pdf: resdoc.data.path,
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