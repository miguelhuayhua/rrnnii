import { NextRequest } from "next/server";
import { prisma } from "../../client";
import bcrypt from 'bcrypt';
const POST = async (request: NextRequest) => {
    const { usuario, usuario2, password } = await request.json();
    console.log(usuario, usuario2, password)
    try {
        let res = await prisma.usuario.update({
            data: {
                usuario: usuario as any,
                ...password ? {
                    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
                } : null
            },
            where: {
                usuario: usuario2
            },
            select: {
                usuario: true, avatar: true, rol: true
            }
        })
        return Response.json({ error: false, mensaje: 'Usuario modificado con éxito', usuario: res });
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al modificar personal'
        });
    }
}

export { POST };