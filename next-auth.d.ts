import { DefaultUser, DefaultSession } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            rol: string;
            habilitado: boolean;
            modo: string;
        } & DefaultUser
    }

    interface User extends DefaultUser {
        rol:string;
        habilitado: boolean;
        modo: string;
    }
}
declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        rol: string;
        habilitado: boolean;
        modo: string;
    }
}