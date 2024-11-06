import { NextRequest } from "next/server";
import { prisma } from "../../../client";
import axios from "axios";
import { fileDomain } from "@/utils/globals";
const POST = async (request: NextRequest) => {
    const form = await request.formData();
    try {
        const formru = new FormData();
        const formci = new FormData();
        formci.append('file', form.get('archivoru') as Blob);
        formru.append('file', form.get('archivoci') as Blob);
        let resci = await axios.post(fileDomain + '/upload',
            formci, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'modo': 'ci',
                'tipo': 'participante'
            }
        });
        let resru = await axios.post(fileDomain + '/upload', formru, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'modo': 'ru',
                'tipo': 'participante'
            }
        });
        await prisma.participanteBeca.create({
            data: {
                ci: form.get('ci')?.toString(),
                contacto: form.get('contacto')?.toString(),
                ru: form.get('ru')?.toString(),
                nombre_completo: form.get('nombre_completo')?.toString(),
                becaId: form.get('becaId')?.toString(),
                cipath: resci.data.path,
                rupath: resru.data.path
            }
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