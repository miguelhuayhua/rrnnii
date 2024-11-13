import { NextRequest } from "next/server";
import { prisma } from "../../client";
import axios from "axios";
import { fileDomain } from "@/utils/globals";
import { getToken } from "next-auth/jwt";
const POST = async (request: NextRequest) => {
    const token = await getToken({ secret: process.env.NEXTAUTH_SECRET as string, req: request });
    if (token?.name) {
        try {
            await prisma.acciones.create({ data: { tabla: 'video', Usuario: { connect: { usuario: token.name } }, tipo: 'editar' } });
            let form = await request.formData() as any;
            const file = form.get("file");
            const formvideo = new FormData();
            formvideo.append('file', file);
            let resvideo = await axios.post(fileDomain + '/upload', formvideo, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'modo': 'main',
                    'tipo': 'video'
                }
            });
            await prisma.video.update({
                data: {
                    titulo: form.get('titulo'),
                    descripcion: form.get('descripcion'),
                    ...file ? ({ video: resvideo.data.path }) : null,
                },
                where: { id: form.get('id') }
            });
            return Response.json({ error: false, mensaje: `Video modificado con éxito` });
        } catch (error) {
            console.log(error)
            return Response.json({
                error: true,
                mensaje: 'Error al modificar la noticia'
            });
        }
    }
    else {
        return Response.error();
    }
}

export { POST };