import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from '@/app/api/client';

//IMPORTACIÓN DE BCRYPT
import bcrypt from 'bcrypt';
const handler = NextAuth({
    providers: [

        CredentialsProvider({
            name: 'credenciales',
            credentials: {
                usuario: { label: 'Usuario', type: 'text', placeholder: 'Introduzca su usuario' },
                password: { label: 'Contraseña', type: 'password' }
            },
            async authorize(credentials) {
                const usuario = credentials?.usuario as string;
                const password = credentials?.password!;
                const data = await prisma.usuario.findUnique({
                    where: {
                        usuario
                    }
                });
                
                if (data) {
                    if (bcrypt.compareSync(password, data.password)) {
                        return {
                            habilitado: true,
                            id: data.id,
                            image: data.avatar,
                            name: data.usuario,
                            rol: data.rol
                        };
                    }
                    else {
                        throw new Error('aborted');
                    }
                }
                else {
                    throw new Error('aborted');
                }
            }
        })
    ],
    callbacks: {
        async signIn({ account }) {
            if (account!.provider === "google") {
                return true
            }
            else if (account!.provider === 'credentials') {
                return true
            }
            return false
        },

        jwt({ token, user, trigger, session }) {
            if (user) {
                token.rol = user.rol;
            }
            if (trigger == 'update') {
                token.name = session.usuario;
                token.picture = session.avatar;
            }
            return token
        },
        session({ session, token }) {
            session.user.rol = token.rol;
            return session;
        }
    }
})

export { handler as GET, handler as POST };