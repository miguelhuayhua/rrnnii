import { NextRequest } from "next/server";
import { prisma } from "../../client";
import { writeFile } from "fs/promises";
import path from "path";
const POST = async (request: NextRequest) => {
    let form = await request.formData() as any;
    const portada = form.get("portada");
    const portadab = Buffer.from(await portada.arrayBuffer());
    const portadan = Date.now() + portada.name.replaceAll(" ", "_");
    const documento = form.get('documento');
    const institucion = form.get('institucion');
    console.log(institucion)
    const documentob = documento ? Buffer.from(await documento.arrayBuffer()) : null;
    const documenton = documento ? Date.now() + documento.name.replaceAll(" ", "_") : '';
    try {
        await writeFile(path.join(process.cwd(), "public/uploads/convenios/img/" + portadan), portadab);
        if (documentob)
            await writeFile(path.join(process.cwd(), "public/uploads/convenios/files/" + documenton), documentob);
        if (await prisma.institucion.findFirst({ where: { nombre: institucion } })) {
            await prisma.convenio.create({
                data: {
                    titulo: form.get('titulo'),
                    descripcion: form.get('descripcion'),
                    pdf: documento ? `/uploads/convenios/files/${documenton}` : '',
                    imagen: `/uploads/convenios/img/${portadan}`,
                    finalizacion: form.get('finalizacion'),
                    tipo: form.get('tipo'),
                    Institucion: {
                        connect: { nombre: institucion }
                    }
                }
            });
        }
        else {
            await prisma.convenio.create({
                data: {
                    titulo: form.get('titulo'),
                    descripcion: form.get('descripcion'),
                    pdf: documento ? `/uploads/convenios/files/${documenton}` : '',
                    imagen: `/uploads/convenios/img/${portadan}`,
                    finalizacion: form.get('finalizacion'),
                    tipo: form.get('tipo'),
                    Institucion: {
                        create: { nombre: institucion, logo: '' }
                    }
                }
            });
        }


        return Response.json({ error: false, mensaje: `Convenio creado con éxito` });
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al crear convenio'
        });
    }
}

export { POST };