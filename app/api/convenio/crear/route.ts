import { NextRequest } from "next/server";
import { prisma } from "../../client";
import axios from "axios";
import { fileDomain } from "@/utils/globals";

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
        let resimage = await axios.post(fileDomain + '/upload', formimg, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'modo': 'convenio',
                'tipo': 'img'
            }
        });
        let resdoc = await axios.post(fileDomain + '/upload', formdoc, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'modo': 'convenio',
                'tipo': 'doc'
            }
        });
        if (await prisma.institucion.findFirst({ where: { nombre: institucion } })) {
            await prisma.convenio.create({
                data: {
                    titulo: form.get('titulo'),
                    descripcion: form.get('descripcion'),
                    pdf: resdoc.data.path,
                    imagen: resimage.data.path,
                    finalizacion: form.get('finalizacion'),
                    tipo: form.get('tipo'),
                    pais: form.get('tipo') == 'nacional' ? 'BO' : form.get('pais'),
                    continente: form.get('tipo') == 'nacional' ? 'SA' : form.get('continente'),
                    Institucion: {
                        connect: { nombre: institucion }
                    },
                    ConvenioCarrera: {
                        createMany: {
                            data: carreras.map((value) => ({ carreraId: value })),
                            skipDuplicates: true
                        },
                    }
                }
            });
        }
        else {
            await prisma.convenio.create({
                data: {
                    titulo: form.get('titulo'),
                    descripcion: form.get('descripcion'),
                    pdf: resdoc.data.path,
                    imagen: resimage.data.path,
                    finalizacion: form.get('finalizacion'),
                    tipo: form.get('tipo'),
                    Institucion: {
                        create: { nombre: institucion, logo: '' }
                    },
                    ConvenioCarrera: {
                        createMany: {
                            data: carreras.map((value) => ({ carreraId: value })),
                            skipDuplicates: true
                        },
                    }
                }
            });
        }


        return Response.json({ error: false, mensaje: `Convenio creado con éxito` });
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al crear convenio'
        });
    }
}

export { POST };