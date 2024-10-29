import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "../client";
import dayjs from "dayjs";
import 'dayjs/locale/es';
dayjs.locale('es');
const POST = async (request: NextRequest) => {
    const token = await getToken({ secret: process.env.NEXTAUTH_SECRET as string, req: request });
    if (token?.name) {
        try {
            const fechaInicio = new Date();
            fechaInicio.setDate(fechaInicio.getDate() - 7);

            let visitantes = await prisma.visitantes.findMany({
                where: {
                    createdAt: {
                        gte: fechaInicio
                    }
                },
                orderBy: { createdAt: 'asc' }
            });
            const conteoPorDia = visitantes.reduce((conteo: any, visitante) => {
                const diaSemana = new Date(visitante.createdAt).getDay(); // 0 = Domingo, ..., 6 = Sábado
                // Asignar el nombre del día correspondiente
                const diasDeLaSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
                const nombreDia = diasDeLaSemana[diaSemana];

                // Contar los visitantes por día
                conteo[nombreDia] = (conteo[nombreDia] || 0) + 1;
                return conteo;
            }, {});

            // Convertir el objeto conteo a un array del formato solicitado
            const resultadoFinal = Object.entries(conteoPorDia).map(([name, valor]) => ({ name, Visitantes: valor }));

            // Resultado final
            console.log(resultadoFinal);
            const totalVisitas = await prisma.visitantes.count();
            // Contar archivos de tipo PDF y DOCX en el modelo Convenio
            const pdfCountConvenio = await prisma.convenio.count({
                where: { pdf: { endsWith: '.pdf' } },
            });
            const docxCountConvenio = await prisma.convenio.count({
                where: { pdf: { endsWith: '.docx' } },
            });

            // Contar archivos PDF y DOCX por separado en el modelo Pasantia
            const pdfCountPasantia = await prisma.pasantia.count({
                where: { pdf: { endsWith: '.pdf' } },
            });
            const docxCountPasantia = await prisma.pasantia.count({
                where: { pdf: { endsWith: '.docx' } },
            });

            // Contar archivos PDF y DOCX por separado en el modelo Beca
            const pdfCountBeca = await prisma.beca.count({
                where: { pdf: { endsWith: '.pdf' } },
            });
            const docxCountBeca = await prisma.beca.count({
                where: { pdf: { endsWith: '.docx' } },
            });

            // Contar archivos PDF y DOCX por separado en el modelo Evento
            const pdfCountEvento = await prisma.evento.count({
                where: { pdf: { endsWith: '.pdf' } },
            });
            const docxCountEvento = await prisma.evento.count({
                where: { pdf: { endsWith: '.docx' } },
            });

            // Total de archivos PDF y DOCX en todos los modelos
            const totalPdfCount = pdfCountConvenio + pdfCountPasantia + pdfCountBeca + pdfCountEvento;
            const totalDocxCount = docxCountConvenio + docxCountPasantia + docxCountBeca + docxCountEvento;
            // Obtener todas las becas con sus participantes
            const becas = await prisma.beca.findMany({
                include: {
                    Participantes: {
                        select: {
                            createdAt: true, // Solo seleccionamos el campo createdAt
                        },
                    },
                },
            });
            // Inicializamos un arreglo para almacenar el conteo total por mes
            const conteoPorMes: any = [];

            // Obtenemos el mes actual
            const mesActual = dayjs().month(); // Obtiene el mes actual (0-11)

            // Inicializamos el conteo para los últimos 6 meses
            for (let i = 0; i < 6; i++) {
                const mesIndex = (mesActual - i + 12) % 12; // Calcular el índice del mes
                const mesNombre = dayjs().month(mesIndex).format('MMMM'); // Formateamos el nombre del mes

                conteoPorMes.unshift({ name: mesNombre, Participantes: 0 }); // Añadir al inicio del arreglo
            }
            // Iteramos sobre cada beca
            becas.forEach(beca => {
                // Iteramos sobre cada participante de la beca
                beca.Participantes.forEach(participante => {
                    const mesParticipante = dayjs(participante.createdAt).format('YYYY-MM'); // Formateamos la fecha a "YYYY-MM"

                    // Buscamos el mes en el arreglo y aumentamos el conteo de participantes
                    const mesIndex = conteoPorMes.findIndex((item: any) => item.name === dayjs(mesParticipante).format('MMMM'));
                    if (mesIndex !== -1) {
                        conteoPorMes[mesIndex].Participantes += 1; // Incrementamos el conteo total de participantes
                    }
                });
            });

            // Obtener los convenios
            const convenios = await prisma.convenio.findMany({
                select: {
                    continente: true,
                    conteo: true,
                    titulo: true, id: true,
                    pais: true
                },
            });
            const continentes = ['SA', 'NA', 'EU', 'AS', 'OC', 'AF'];
            const conteoPorContinente: any = {};

            // Inicializamos el objeto para cada continente
            continentes.forEach(continente => {
                conteoPorContinente[continente] = { becas: 0, convenios: 0 };
            });

            // Contar publicaciones por continente
            becas.forEach(beca => {
                const continente = beca.continente;
                if (conteoPorContinente[continente]) {
                    conteoPorContinente[continente].becas += 1;
                }
            });

            convenios.forEach(convenio => {
                const continente = convenio.continente;
                if (conteoPorContinente[continente]) {
                    conteoPorContinente[continente].convenios += 1;
                }
            });

            // Convertir el objeto a un formato deseado
            const resultado = continentes.map(continente => ({
                name: continente,
                Becas: conteoPorContinente[continente].becas,
                Convenios: conteoPorContinente[continente].convenios,
            }));

            const [eventos, pasantias] = await Promise.all([
                prisma.evento.findMany({
                    select: {
                        conteo: true, // Asumiendo que 'conteo' representa el número de visitantes
                        titulo: true, id: true
                    },
                }),
                prisma.pasantia.findMany({
                    select: {
                        conteo: true,
                        titulo: true, id: true
                    },
                }),
            ]);

            // Sumar los conteos para cada tipo de publicación
            const totalBecas = becas.reduce((acc, beca) => acc + beca.conteo, 0);
            const totalConvenios = convenios.reduce((acc, convenio) => acc + convenio.conteo, 0);
            const totalEventos = eventos.reduce((acc, evento) => acc + evento.conteo, 0);
            const totalPasantias = pasantias.reduce((acc, pasantia) => acc + pasantia.conteo, 0);

            // Crear el resultado en el formato deseado
            const conteoGeneral = [
                { name: "beca", Visitas: totalBecas },
                { name: "convenio", Visitas: totalConvenios },
                { name: "evento", Visitas: totalEventos },
                { name: "pasantia", Visitas: totalPasantias },
            ];

            // Crear un objeto para almacenar el conteo por país
            const conteoPorPais: any = {};

            // Función para sumar conteos por país
            const sumarConteo = (publicaciones: any) => {
                publicaciones.forEach(({ pais, conteo }: any) => {
                    if (!conteoPorPais[pais]) {
                        conteoPorPais[pais] = 0; // Inicializar si el país no existe
                    }
                    conteoPorPais[pais] += conteo; // Sumar el conteo
                });
            };

            // Sumar conteos para cada tipo de publicación
            sumarConteo(becas);
            sumarConteo(convenios);

            // Convertir el objeto en el formato deseado
            const resultadoPorPais = Object.entries(conteoPorPais).map(([pais, conteo]) => ({
                value: conteo,
                name: pais
            }));

            const masVisitados = [
                ...eventos
                    .sort((a, b) => b.conteo - a.conteo) // Ordenar por visitantes de mayor a menor
                    .slice(0, 2) // Tomar solo los dos primeros
                    .map(evento => ({
                        id: evento.id,
                        titulo: evento.titulo,
                        name: 'evento',
                        visitantes: evento.conteo || 0,
                    })),
                ...pasantias
                    .sort((a, b) => b.conteo - a.conteo)
                    .slice(0, 2)
                    .map(pasantia => ({
                        id: pasantia.id,
                        titulo: pasantia.titulo,
                        name: 'pasantia',
                        visitantes: pasantia.conteo || 0,
                    })),
                ...becas
                    .sort((a, b) => b.conteo - a.conteo)
                    .slice(0, 2)
                    .map(beca => ({
                        id: beca.id,
                        titulo: beca.titulo,
                        name: 'beca',
                        visitantes: beca.conteo || 0,
                    })),
                ...convenios
                    .sort((a, b) => b.conteo - a.conteo)
                    .slice(0, 2)
                    .map(convenio => ({
                        id: convenio.id,
                        titulo: convenio.titulo,
                        name: 'convenio',
                        visitantes: convenio.conteo || 0,
                    })),
            ];
            const Instituciones = await prisma.institucion.findMany({
                orderBy: { id: 'desc' }
            })
            return Response.json({
                conteoPais: resultadoPorPais, mayorVisto: conteoGeneral,
                publicacionXContinente: resultado, participantesXMes: conteoPorMes,
                archivos: [{ name: 'PDF', Cantidad: totalPdfCount }, { name: 'WORD', Cantidad: totalDocxCount }], vistasXDia: resultadoFinal, totalVisitas,
                masVisitados, Instituciones
            });
        } catch (error) {
            console.log(error)
            return Response.json({
                error: true,
                mensaje: 'Error al cargar datos de dashboard'
            });
        }
    }
    else {
        return Response.error();
    }
}

export { POST };