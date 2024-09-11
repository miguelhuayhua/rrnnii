import { NextRequest } from "next/server";
import { prisma } from "../../client";
import axios from "axios";
import { fileDomain } from "@/utils/globals";
const POST = async (request: NextRequest) => {
    let form = await request.formData() as any;
    const portada = form.get("portada");
    let carrera = await prisma.carrera.findFirst({ where: { nombre: form.get('nombre').toUpperCase() } });
    try {
        if (carrera) {
            return Response.json({ error: false, mensaje: `Carrera existente` });
        }
        else {
            const formimg = new FormData();
            formimg.append('file', portada);
            let resimage = await axios.post(fileDomain + '/upload', formimg, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'modo': 'carrera',
                    'tipo': 'img'
                }
            });
            await prisma.carrera.create({
                data: {
                    nombre: form.get('nombre').toUpperCase(),
                    contacto: +form.get('contacto'),
                    logo: resimage.data.path
                }
            });
            return Response.json({ error: false, mensaje: `Carrera añadida con éxito` });
        }
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al añadir la carrera'
        });
    }
}

export { POST };