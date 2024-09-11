import { NextRequest } from "next/server";
import { prisma } from "../../client";
import axios from "axios";
import { fileDomain } from "@/utils/globals";
const POST = async (request: NextRequest) => {
    let form = await request.formData() as any;
    const portada = form.get("portada");
    const formimg = new FormData();
    formimg.append('file', portada);
    let resimage = await axios.post(fileDomain + '/upload', formimg, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'modo': 'pasantia',
            'tipo': 'img'
        }
    });
    try {
        if (portada) {
            await prisma.carrera.update({
                data: { logo: resimage.data.path },
                where: { id: form.get('id') }
            });
        }
        await prisma.carrera.update({
            data: {
                nombre: form.get('nombre').toUpperCase(),
                contacto: +form.get('contacto'),
            },
            where: { id: form.get('id') }
        });
        return Response.json({ error: false, mensaje: `Carrera modificada con éxito` });
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al modificar carrera'
        });
    }
}

export { POST };