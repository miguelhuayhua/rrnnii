import { NextRequest } from "next/server";
import { prisma } from "../../client";
import axios from "axios";
const POST = async (request: NextRequest) => {
    let form = await request.formData() as any;
    const file = form.get("file");
    const formimg = new FormData();
    formimg.append('file', file);
    let resimage = await axios.post('http://localhost:4000/upload', formimg, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'modo': 'galeria',
            'tipo': 'img'
        }
    });
    try {
        await prisma.galeria.update({
            data: {
                titulo: form.get('titulo'),
                descripcion: form.get('descripcion'),
                ...file ? ({ imagen: resimage.data.path }) : null,
            },
            where: { id: form.get('id') }
        });
        return Response.json({ error: false, mensaje: `Imagen modificado con éxito` });
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al modificar la imagen'
        });
    }
}

export { POST };