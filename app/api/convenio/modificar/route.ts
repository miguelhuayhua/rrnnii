import { NextRequest } from "next/server";
import { prisma } from "../../client";
import { ConvenioCarrera } from "@prisma/client";
import axios from "axios";
const POST = async (request: NextRequest) => {
    let form = await request.formData() as any;
    const portada = form.get("portada");
    const documento = form.get('documento');
    const institucion = form.get('institucion');
    const convenioCarrera = JSON.parse(form.get('convenioCarrera')) as ConvenioCarrera[];
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
    try {

        await prisma.convenioCarrera.deleteMany({
            where: { convenioId: form.get('id') }
        });
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
                            data: convenioCarrera.map(value => ({ carreraId: value.carreraId, ...(value.id ? { id: value.id } : null) })),
                            skipDuplicates: true
                        },
                    },
                    ...portada ? ({ imagen: resimage.data.path }) : null,
                    ...documento ? ({ pdf: resdoc.data.path }) : null
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
                    imagen: resimage.data.path, pdf: resdoc.data.path,
                    ConvenioCarrera: {
                        createMany: {
                            data: convenioCarrera.map(value => ({ carreraId: value.carreraId, ...(value.id ? { id: value.id } : null) })),
                            skipDuplicates: true
                        },
                    }
                },
                where: { id: form.get('id') }
            });
        }
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