
import { NextRequest } from "next/server";
import { prisma } from "../../client";
import axios from "axios";
import { fileDomain } from "@/utils/globals";
import { getToken } from "next-auth/jwt";
const POST = async (request: NextRequest) => {
    const token = await getToken({ secret: process.env.NEXTAUTH_SECRET as string, req: request });
    if (token?.name) {
        try {
            await prisma.acciones.create({ data: { tabla: 'evento', Usuario: { connect: { usuario: token.name } }, tipo: 'editar' } });
            let form = await request.formData() as any;
            const imagen = form.get("imagen");
            const doc = form.get('doc');
            const formimg = new FormData();
            const formdoc = new FormData();
            formimg.append('file', imagen);
            formdoc.append('file', doc);
            let resimage = await axios.post(fileDomain + '/upload', formimg, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'modo': 'evento',
                    'tipo': 'img'
                }
            });
            let resdoc = await axios.post(fileDomain + '/upload', formdoc, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'modo': 'evento',
                    'tipo': 'doc'
                }
            });
            await prisma.evento.update({
                data: {
                    titulo: form.get('titulo'),
                    descripcion: form.get('descripcion'),
                    tipo: form.get('tipo'),
                    link: form.get('link'),
                    inicio: form.get('inicio'),
                    ...imagen ? ({ imagen: resimage.data.path }) : null,
                    ...doc ? ({ pdf: resdoc.data.path }) : null
                },
                where: { id: form.get('id') }
            });
            return Response.json({ error: false, mensaje: `Evento modificado con éxito` });
        } catch (error) {
            console.log(error)
            return Response.json({
                error: true,
                mensaje: 'Error al modificar evento'
            });
        }
    }
    else {
        return Response.error();
    }
}

export { POST };