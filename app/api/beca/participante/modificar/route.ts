import { NextRequest } from "next/server";
import { prisma } from "../../../client";
import axios from "axios";
import { fileDomain } from "@/utils/globals";
const POST = async (request: NextRequest) => {
    const { nombre_completo, id, contacto, ci, ru } = await request.json();
    try {

        await prisma.participanteBeca.update({
            data: {
                ci,
                ru,
                nombre_completo,
                contacto
            },
            where: { id }
        })
        return Response.json({ error: false, mensaje: `Participante modificado con éxito` });
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al modificar participante'
        });
    }
}

export { POST };