import { NextRequest } from "next/server";
import { prisma } from "../../client";
import axios from "axios";
import { fileDomain } from "@/utils/globals";
const POST = async (request: NextRequest) => {
    let form = await request.formData() as any;
    const file = form.get("file");
    const formimg = new FormData();
    formimg.append('file', file);
    let resimage = await axios.post(fileDomain + '/upload', formimg, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'modo': 'noticia',
            'tipo': 'img'
        }
    });
    try {
        await prisma.noticia.create({
            data: {
                titulo: form.get('titulo'),
                descripcion: form.get('descripcion'),
                imagen: resimage.data.path,
            }
        });
        return Response.json({ error: false, mensaje: `Noticia creada con éxito` });
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al crear la imagen'
        });
    }
}

export { POST };