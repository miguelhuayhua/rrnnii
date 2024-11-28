import { NextRequest } from "next/server";
import { getToken } from 'next-auth/jwt'
import { fileDomain } from "@/utils/globals";
import axios from "axios";
import { prisma } from "../../client";
const POST = async (request: NextRequest) => {
    const token = await getToken({ secret: process.env.NEXTAUTH_SECRET as string, req: request });
    if (token?.name) {
        try {
            let { id, path } = await request.json();
            await axios.post(fileDomain + '/delete', {
            }, {
                headers: {
                    path
                }
            });

            await prisma.video.update({
                where: { id },
                data: { estado: false, video: '' }
            })
            return Response.json({ error: false, mensaje: `Multimedia borrada` });
        } catch (error) {
            console.log(error)
            return Response.json({
                error: true,
                mensaje: 'El archivo ya fue eliminado'
            });
        }
    }
    else {
        return Response.error();
    }

}

export { POST };