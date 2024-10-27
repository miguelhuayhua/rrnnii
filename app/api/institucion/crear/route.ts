import { NextRequest } from "next/server";
import { prisma } from "../../client";
import axios from "axios";
import { fileDomain } from "@/utils/globals";
import { getToken } from "next-auth/jwt";
const POST = async (request: NextRequest) => {
    const token = await getToken({ secret: process.env.NEXTAUTH_SECRET as string, req: request });
    if (token?.name) {
        try {
            await prisma.acciones.create({ data: { tabla: 'institucion', Usuario: { connect: { usuario: token.name } }, tipo: 'crear' } });
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
            });
            const institucion = await prisma.institucion.findFirst({ where: { nombre: form.get('nombre').toUpperCase() } })
            if (!institucion) {
                await prisma.institucion.create({
                    data: {
                        nombre: form.get('nombre'),
                        contacto: +form.get('contacto'),
                        logo: resimage.data.path
                    }
                });
                return Response.json({ error: false, mensaje: `Institución añadida con éxito` });
            }
            else {
                return Response.json({ error: false, mensaje: `Institución ya existente` });
            }
        } catch (error) {
            console.log(error)
            return Response.json({
                error: true,
                mensaje: 'Error al añadir la institución'
            });
        }
    }
    else {
        return Response.error();
    }
}

export { POST };