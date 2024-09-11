import { NextRequest } from "next/server";
import { prisma } from "../../client";
import axios from "axios";
import { fileDomain } from "@/utils/globals";
const POST = async (request: NextRequest) => {
    let form = await request.formData() as any;
    const portada = form.get("portada");
    const documento = form.get('documento');
    try {
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
        await prisma.actividad.create({
            data: {
                titulo: form.get('titulo'),
                descripcion: form.get('descripcion'),
                pdf: resdoc.data.path,
                imagen: resimage.data.path,
                tipo: form.get('tipo'),
                referencia: form.get('referencia')
            }
        });
        return Response.json({ error: false, mensaje: `Actividad creada con éxito` });
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al crear la actividad'
        });
    }
}

export { POST };