import { NextRequest } from "next/server";
import { prisma } from "../../client";
import axios from "axios";
import { fileDomain } from "@/utils/globals";
import { getToken } from "next-auth/jwt";
const POST = async (request: NextRequest) => {
    const token = await getToken({ secret: process.env.NEXTAUTH_SECRET as string, req: request });
    if (token?.name) {
        try {
            await prisma.acciones.create({ data: { tabla: 'pasantia', Usuario: { connect: { usuario: token.name } }, tipo: 'crear' } });
            let form = await request.formData() as any;
            const portada = form.get("portada");
            const documento = form.get('documento');
            const institucion = form.get('institucion');
            const carreras = JSON.parse(form.get('carreras')) as string[];
            const formimg = new FormData();
            const formdoc = new FormData();
            formimg.append('file', portada);
            formdoc.append('file', documento);
            let resimage = await axios.post(fileDomain + '/upload', formimg, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'modo': 'pasantia',
                    'tipo': 'img'
                }
            });
            let resdoc = await axios.post(fileDomain + '/upload', formdoc, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'modo': 'pasantia',
                    'tipo': 'doc'
                }
            });
            if (await prisma.institucion.findFirst({ where: { nombre: institucion } })) {
                await prisma.pasantia.create({
                    data: {
                        titulo: form.get('titulo'),
                        descripcion: form.get('descripcion'),
                        pdf: resdoc.data.path,
                        imagen: resimage.data.path,
                        modalidad: form.get('modalidad'),
                        descripcionCorta: form.get('descripcioncorta'),
                        finalizacion: form.get('finalizacion'),
                        Institucion: { connect: { nombre: institucion } },
                        PasantiaCarrera: {
                            createMany: {
                                data: carreras.map((value) => ({ carreraId: value })),
                                skipDuplicates: true
                            },
                        }
                    },
                });
            } else {
                await prisma.pasantia.create({
                    data: {
                        titulo: form.get('titulo'),
                        descripcion: form.get('descripcion'),
                        pdf: resdoc.data.path,
                        imagen: resimage.data.path,
                        modalidad: form.get('modalidad'),
                        descripcionCorta: form.get('descripcioncorta'),
                        finalizacion: form.get('finalizacion'),
                        Institucion: { create: { nombre: institucion, logo: '' } },
                        PasantiaCarrera: {
                            createMany: {
                                data: carreras.map((value) => ({ carreraId: value })),
                                skipDuplicates: true
                            },
                        }
                    },
                });
            }
            return Response.json({ error: false, mensaje: `Pasantia creada con éxito` });
        } catch (error) {
            console.log(error)
            return Response.json({
                error: true,
                mensaje: 'Error al crear la pasantía'
            });
        }
    }
    else {
        return Response.error();
    }
}

export { POST };