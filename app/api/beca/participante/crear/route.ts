import { NextRequest } from "next/server";
import { prisma } from "../../../client";
import axios from "axios";
import { fileDomain } from "@/utils/globals";
import { resolve } from "path";
const POST = async (request: NextRequest) => {
    const form = await request.formData();
    try {
        const archivos = form.getAll('archivos') as Blob[];
        let fileArray = archivos.map(async value => {
            const archive = new FormData();
            archive.append('file', value)
            let res = await axios.post(fileDomain + '/upload',
                archive, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'modo': 'archivos',
                    'tipo': 'participante'
                }
            })
            return ({ ruta: res.data.path, nombre: res.data.filename })
        })
        Promise.all(fileArray).then(async resolvedArray => {
            await prisma.participanteBeca.create({
                data: {
                    ci: form.get('ci')?.toString(),
                    contacto: form.get('contacto')?.toString(),
                    ru: form.get('ru')?.toString(),
                    nombre_completo: form.get('nombre_completo')?.toString(),
                    becaId: form.get('becaId')?.toString(),
                    Archivos: { createMany: { data: resolvedArray } }
                }
            })
        })

        return Response.json({ error: false, mensaje: `Registrado con éxito` });
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al registrar participante'
        });
    }
}

export { POST };