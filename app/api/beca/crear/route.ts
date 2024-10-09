import { NextRequest } from "next/server";
import { prisma } from "../../client";
import axios from "axios";
import { fileDomain } from "@/utils/globals";
const POST = async (request: NextRequest) => {
    let form = await request.formData() as any;
    const portada = form.get("portada");
    const documento = form.get('documento');
    const institucion = form.get('institucion');
    try {
        const formimg = new FormData();
        const formdoc = new FormData();
        formimg.append('file', portada);
        formdoc.append('file', documento);
        let resimage = await axios.post(fileDomain + '/upload', formimg, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'modo': 'beca',
                'tipo': 'img'
            }
        });
        let resdoc = await axios.post(fileDomain + '/upload', formdoc, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'modo': 'beca',
                'tipo': 'doc'
            }
        });
        if (await prisma.institucion.findFirst({ where: { nombre: institucion } })) {

            await prisma.beca.create({
                data: {
                    titulo: form.get('titulo'),
                    descripcion: form.get('descripcion'),
                    pdf: resdoc.data.path,
                    imagen: resimage.data.path,
                    tipo: form.get('tipo'),
                    pais: form.get('tipo') == 'nacional' ? 'BO' : form.get('pais'),
                    continente: form.get('tipo') == 'nacional' ? 'SA' : form.get('continente'),
                    termina: form.get('termina'),
                    encargado: form.get('encargado'),
                    Institucion: {
                        connect: { nombre: institucion }
                    },
                }
            });
        }
        else {
            await prisma.beca.create({
                data: {
                    titulo: form.get('titulo'),
                    descripcion: form.get('descripcion'),
                    pdf: resdoc.data.path,
                    imagen: resimage.data.path,
                    tipo: form.get('tipo'),
                    pais: form.get('tipo') == 'nacional' ? 'BO' : form.get('pais'),
                    continente: form.get('tipo') == 'nacional' ? 'SA' : form.get('continente'),
                    termina: form.get('termina'),
                    encargado: form.get('encargado'),
                    Institucion: {
                        create: { nombre: institucion, logo: '' }
                    },
                }
            });
        }

        return Response.json({ error: false, mensaje: `Beca creada con éxito` });
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al crear la beca'
        });
    }
}

export { POST };