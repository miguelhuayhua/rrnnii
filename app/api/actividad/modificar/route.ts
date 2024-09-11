import { NextRequest } from "next/server";
import { prisma } from "../../client";
import axios from "axios";
import { fileDomain } from "@/utils/globals";
const POST = async (request: NextRequest) => {
    let form = await request.formData() as any;
    const portada = form.get("portada");
    const documento = form.get('documento');
    const formimg = new FormData();
    const formdoc = new FormData();
    formimg.append('file', portada);
    formdoc.append('file', documento);
    let resimage = await axios.post(fileDomain + '/upload', formimg, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'modo': 'actividad',
            'tipo': 'img'
        }
    });
    let resdoc = await axios.post(fileDomain + '/upload', formdoc, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'modo': 'actividad',
            'tipo': 'doc'
        }
    });
    try {
        await prisma.actividad.update({
            data: {
                titulo: form.get('titulo'),
                descripcion: form.get('descripcion'),
                tipo: form.get('tipo'),
                ...portada ? ({ imagen: resimage.data.path }) : null,
                ...documento ? ({ pdf: resdoc.data.path }) : null
            },
            where: { id: form.get('id') }
        });
        return Response.json({ error: false, mensaje: `Actividad modificada con éxito` });
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al modificar actividad'
        });
    }
}

export { POST };