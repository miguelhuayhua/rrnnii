import { NextRequest } from "next/server";
import { prisma } from "../../client";
import axios from "axios";
import { fileDomain } from "@/utils/globals";
const POST = async (request: NextRequest) => {
    const form = await request.formData();
    const formimg = new FormData();
    formimg.append('file', form.get('file') as File);
    let resimage = await axios.post(fileDomain + '/upload', formimg, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'modo': 'avatar',
            'tipo': ''
        }
    });
    try {
        let usuario = await prisma.usuario.update({
            where: { usuario: form.get('usuario') as any },
            data: { avatar: resimage.data.path }
        });
        return Response.json({
            mensaje: 'Avatar de usuario modifcado con éxito', error: false,
            usuario
        });
    } catch (error) {
        console.log(error)
        return Response.json({ error: true, mensaje: 'Error al modificar personal' });
    }
}

export { POST };