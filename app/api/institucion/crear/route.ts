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
    });
    const institucion = await prisma.institucion.findFirst({ where: { nombre: form.get('nombre').toUpperCase() } })
    try {
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

export { POST };