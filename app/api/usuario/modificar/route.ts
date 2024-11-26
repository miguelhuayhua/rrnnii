import { NextRequest } from "next/server";
import { prisma } from "../../client";
import bcrypt from 'bcrypt';
import { getToken } from "next-auth/jwt";
const POST = async (request: NextRequest) => {
    const token = await getToken({ secret: process.env.NEXTAUTH_SECRET as string, req: request });
    if (token?.name) {
        try {
            await prisma.acciones.create({ data: { tabla: 'usuario', Usuario: { connect: { usuario: token.name } }, tipo: 'editar' } });
            const { usuario, password, id } = await request.json();
            let res = await prisma.usuario.update({
                data: {
                    usuario: usuario as any,
                    ...password ? {
                        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
                    } : null
                },
                where: {
                    id
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
                mensaje: 'Error al modificar usuario'
            });
        }
    }
    else {
        return Response.error();
    }
}

export { POST };