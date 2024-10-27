import { NextRequest } from "next/server";
import { prisma } from "../../client";
import axios from "axios";
import { fileDomain } from "@/utils/globals";
import { getToken } from "next-auth/jwt";
const POST = async (request: NextRequest) => {
    const token = await getToken({ secret: process.env.NEXTAUTH_SECRET as string, req: request });
    if (token?.name) {
        try {
            await prisma.acciones.create({ data: { tabla: 'noticia', Usuario: { connect: { usuario: token.name } }, tipo: 'crear' } });
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
    else {
        return Response.error();
    }
}

export { POST };