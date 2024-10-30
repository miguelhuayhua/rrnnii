import { NextRequest } from "next/server";
import { prisma } from "../../client";
import axios from "axios";
import { fileDomain } from "@/utils/globals";
import { getToken } from "next-auth/jwt";
const POST = async (request: NextRequest) => {
    const token = await getToken({ secret: process.env.NEXTAUTH_SECRET as string, req: request });
    if (token?.name) {
        try {
            await prisma.acciones.create({ data: { tabla: 'institucion', Usuario: { connect: { usuario: token.name } }, tipo: 'editar' } });
            let form = await request.formData() as any;
            const portada = form.get("portada");
            const formimg = new FormData();
            formimg.append('file', portada);
            let resimage = await axios.post(fileDomain + '/upload', formimg, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'modo': 'institucion',
                    'tipo': 'img'
                }
            })
            await prisma.institucion.update({
                data: {
                    nombre: form.get('nombre'),
                    contacto: +form.get('contacto'),
                    video: form.get('video'),
                    web: form.get('web'),
                    ...portada ? ({ logo: resimage.data.path }) : null,
                },
                where: { id: form.get('id') }
            });
            return Response.json({ error: false, mensaje: `Institución modificada con éxito` });
        } catch (error) {
            console.log(error)
            return Response.json({
                error: true,
                mensaje: 'Error al modificar pasantía'
            });
        }
    }
    else {
        return Response.error();
    }
}

export { POST };