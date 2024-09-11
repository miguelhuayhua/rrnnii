import { NextRequest } from "next/server";
import { prisma } from "../../client";
import axios from "axios";
const POST = async (request: NextRequest) => {
    let form = await request.formData() as any;
    const portada = form.get("portada");
    const formimg = new FormData();
    formimg.append('file', portada);
    let resimage = await axios.post('http://localhost:4000/upload', formimg, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'modo': 'institucion',
            'tipo': 'img'
        }
    })
    try {
        await prisma.institucion.update({
            data: {
                nombre: form.get('nombre'),
                contacto: +form.get('contacto'),
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

export { POST };