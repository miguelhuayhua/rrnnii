import { NextRequest } from "next/server";
import { prisma } from "../../client";
import axios from "axios";
import { fileDomain } from "@/utils/globals";
import { getToken } from "next-auth/jwt";
const POST = async (request: NextRequest) => {
    const token = await getToken({ secret: process.env.NEXTAUTH_SECRET as string, req: request });
    if (token?.name) {
        try {
            await prisma.acciones.create({ data: { tabla: 'beca', Usuario: { connect: { usuario: token.name } }, tipo: 'editar' } });
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
                    'modo': 'beca',
                    'tipo': 'img'
                }
            });
            let resdoc = await axios.post(fileDomain + '/upload', formdoc, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'modo': 'beca',
                    'tipo': 'doc'
                }
            });
            await prisma.beca.update({
                data: {
                    titulo: form.get('titulo'),
                    descripcion: form.get('descripcion'),
                    tipo: form.get('tipo'),
                    pais: form.get('tipo') == 'nacional' ? 'BO' : form.get('pais'),
                    continente: form.get('tipo') == 'nacional' ? 'SA' : form.get('continente'),
                    ...portada ? ({ imagen: resimage.data.path }) : null,
                    ...documento ? ({ pdf: resdoc.data.path }) : null
                },
                where: { id: form.get('id') }
            });
            return Response.json({ error: false, mensaje: `Beca modificada con éxito` });
        } catch (error) {
            console.log(error)
            return Response.json({
                error: true,
                mensaje: 'Error al modificar beca'
            });
        }

    }
    else {
        return Response.error();
    }

}

export { POST };