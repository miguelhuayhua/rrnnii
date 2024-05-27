
import { NextRequest } from "next/server";
import { prisma } from "../../client";
import { writeFile } from "fs/promises";
import path from "path";
const POST = async (request: NextRequest) => {
    let form = await request.formData() as any;
    const portada = form.get("portada");
    const portadab = portada ? Buffer.from(await portada.arrayBuffer()) : null;
    const portadan = portada ? Date.now() + portada.name.replaceAll(" ", "_") : '';
    const documento = form.get('documento');
    const documentob = documento ? Buffer.from(await documento.arrayBuffer()) : null;
    const documenton = documento ? Date.now() + documento.name.replaceAll(" ", "_") : '';
    try {
        if (portadab) {
            await writeFile(path.join(process.cwd(), "public/uploads/pasantias/img/" + portadan), portadab);
            await prisma.pasantia.update({
                data: { imagen: portada ? `/uploads/pasantias/img/${portadan}` : '' },
                where: { id: form.get('id') }
            });
        }
        if (documentob) {
            await writeFile(path.join(process.cwd(), "public/uploads/pasantias/files/" + documenton), documentob);
            await prisma.pasantia.update({
                data: { pdf: `/uploads/pasantiaes/files/${documenton}` },
                where: { id: form.get('id') }
            });
        }
        else {
            await prisma.pasantia.update({
                data: { pdf: '' },
                where: { id: form.get('id') }
            });
        }
        await prisma.pasantia.update({
            data: {
                titulo: form.get('titulo'),
                descripcion: form.get('descripcion'),
                logo: '',
                modalidad: form.get('modalidad'),
                finalizacion: form.get('finalizacion'),
                institucion: form.get('institucion')
            },
            where: { id: form.get('id') }
        });
        return Response.json({ error: false, mensaje: `Pasantia modificado con éxito` });
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
            mensaje: 'Error al modificar pasantía'
        });
    }
}

export { POST };