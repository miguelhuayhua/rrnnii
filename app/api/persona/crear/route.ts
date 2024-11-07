import { NextRequest } from "next/server";
import { prisma } from "../../client";
import { getToken } from "next-auth/jwt";
import bcrypt from 'bcrypt';
const POST = async (request: NextRequest) => {
    const token = await getToken({ secret: process.env.NEXTAUTH_SECRET as string, req: request });
    if (token?.name) {
        try {
            let Persona = await request.json();
            await prisma.acciones.create({ data: { tabla: 'persona', Usuario: { connect: { usuario: token.name } }, tipo: 'crear' } });
            let persona = await prisma.persona.create({
                data: {
                    ci:Persona.ci,
                    nombre:Persona.nombre,
                    paterno: Persona.paterno,
                    materno: Persona.materno,
                    cargo: Persona.cargo,
                    f_nacimiento:Persona.f_nacimiento
                }
            });
            await prisma.usuario.create({
                data: {
                    password: bcrypt.hashSync(Persona.Usuario.password, bcrypt.genSaltSync(10)),
                    usuario: Persona.Usuario.usuario,
                    rol: Persona.Usuario.rol,
                    personaId: persona.id,
                    

                }
            })
            return Response.json({ error: false, mensaje: `Personal creado con éxito` });
        } catch (error) {
            console.log(error)
            return Response.json({
                error: true,
                mensaje: 'Error al agregar personal'
            });
        }
    }
    else {
        return Response.error();
    }
}

export { POST };