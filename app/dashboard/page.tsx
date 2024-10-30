"use client";
import React, { useEffect, useState } from "react";
import 'react-quill/dist/quill.snow.css';
import axios from "axios";
import { Icon } from '@iconify/react';
import { Negrita, Normal, Titulo } from "../componentes/Textos";
import { useSession } from "next-auth/react";
import { Box, Divider, Grid, Stack } from "@mui/material";
import { BoxSombra } from "../componentes/Mostrar";
import { BarChart, LineChart, Line, Bar, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { blue, green, grey, red } from "@mui/material/colors";
import CountUp from "react-countup";
import Tabla from "./componentes/Tabla";
import { BotonFilled, BotonOutline, BotonSimple } from "../componentes/Botones";
import { useRouter } from "next/navigation";
import Image from 'next/legacy/image';
import { Institucion } from "@prisma/client";
import { fileDomain } from "@/utils/globals";

export default function Page() {
    const { data } = useSession();
    const router = useRouter();
    const [dashboard, setDashboard] = useState({
        vistasXDia: [], archivos: [{ name: 'PDF', value: 0 }, { name: 'WORD', value: 0 }],
        participantesXMes: [], publicacionXContinente: [], mayorVisto: [],
        conteoPais: [], masVisitados: [], Instituciones: []
    });

    const [count, setCount] = useState({
        sizep: 0, sizea: 0, sizem: 0, sizeb: 0
    });
    useEffect(() => {
        axios.post('/api/dashboard/').then(res => {
            setCount(prev => ({
                ...prev, sizep: res.data.totalVisitas,
                sizea: res.data.archivos[0].Cantidad + res.data.archivos[1].Cantidad,
                sizem: (res.data.participantesXMes as []).reduce((total, mes: any) => total + mes.Participantes, 0)
            }));
            setDashboard(res.data);
        })
    }, [])

    const continenteNombres: any = {
        'SA': 'Sudamérica',
        'NA': 'Norteamérica',
        'EU': 'Europa',
        'AS': 'Asia',
        'OC': 'Oceanía',
        'AF': 'África',
    };


    return (
        <Box px={{ xs: 1, md: 4, lg: 5 }}>
            <Titulo>
                Bienvenido {data?.user.name}
            </Titulo>
            <Grid container spacing={4} my={2}>
                <Grid item xs={12} sm={6} lg={4} mx='auto'>
                    <BoxSombra p={2} >
                        <Box display='flex' justifyContent='space-between' alignItems='center'>
                            <Box sx={{ fontSize: 12, minWidth: { xs: 300, sm: 160, md: 60, lg: 150 } }} >
                                <Negrita>
                                    Visitas a la página principal
                                </Negrita>
                                <CountUp start={0} duration={10} end={count.sizep} >
                                    {({ countUpRef }) => (
                                        <Box sx={{
                                            display: 'flex', alignItems: 'center',
                                            fontSize: 35
                                        }}>
                                            <span style={{
                                                fontSize: 'inherit',
                                                marginRight: 10, fontWeight: 700
                                            }} ref={countUpRef} />
                                            <span style={{ fontSize: 15 }}>
                                                Visitas
                                            </span>
                                        </Box>
                                    )}
                                </CountUp>
                            </Box>
                            <Box height={100} width={120}>
                                <ResponsiveContainer >
                                    <LineChart data={dashboard.vistasXDia}>
                                        <XAxis hide dataKey="name" />
                                        <YAxis hide />
                                        <Tooltip content={
                                            ({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <Box sx={{
                                                            p: 1,
                                                            borderRadius: 2, bgcolor: grey[900], fontSize: '12px',
                                                            minWidth: 100
                                                        }}>
                                                            <Negrita sx={{ color: grey[50] }}>
                                                                {payload[0].payload.name}
                                                            </Negrita>
                                                            <Normal sx={{ fontSize: 13, color: grey[100] }}>{payload[0].value} Visitantes</Normal>
                                                        </Box>
                                                    );
                                                }
                                                return null;
                                            }} />
                                        <Line type="monotone" dataKey="Visitantes" stroke={green[500]} strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>

                        </Box>
                        <Normal>
                            2.6
                        </Normal>
                    </BoxSombra>
                </Grid>
                <Grid item xs={12} sm={6} lg={4} mx='auto'>
                    <BoxSombra p={2} >
                        <Box display='flex' justifyContent='space-between' alignItems='center'>
                            <Box sx={{ fontSize: 12, minWidth: { xs: 300, sm: 160, md: 60, lg: 150 } }} >
                                <Negrita>
                                    Cantidad de archivos alojados
                                </Negrita>
                                <CountUp start={0} duration={10} end={count.sizea} >
                                    {({ countUpRef }) => (
                                        <Box sx={{
                                            display: 'flex', alignItems: 'center',
                                            fontSize: 35
                                        }}>
                                            <span style={{
                                                fontSize: 'inherit',
                                                marginRight: 10, fontWeight: 700
                                            }} ref={countUpRef} />
                                            <span style={{ fontSize: 15 }}>
                                                Archivos
                                            </span>
                                        </Box>
                                    )}
                                </CountUp>
                            </Box>
                            <Box height={100} width={120}>
                                <ResponsiveContainer  >
                                    <PieChart  >
                                        <Tooltip content={
                                            ({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <Box sx={{
                                                            p: 1,
                                                            borderRadius: 2, bgcolor: grey[900], fontSize: '12px',
                                                            minWidth: 100
                                                        }}>
                                                            <Negrita sx={{ color: grey[50] }}>
                                                                {payload[0].payload.name}
                                                            </Negrita>
                                                            <Normal sx={{ fontSize: 13, color: grey[100] }}>{payload[0].value} Archivos</Normal>
                                                        </Box>
                                                    );
                                                }
                                                return null;
                                            }} />
                                        <Pie
                                            data={dashboard.archivos}
                                            dataKey="Cantidad"
                                        >
                                            {dashboard.archivos.map((entry, index) => (
                                                <Cell fill={index == 0 ? red[500] : blue[500]} key={`cell-${index}`} />
                                            ))}
                                        </Pie>

                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>

                        </Box>
                        <Normal>
                            2.6
                        </Normal>
                    </BoxSombra>
                </Grid>
                <Grid item xs={12} sm={6} lg={4} mx='auto' >
                    <BoxSombra p={2} >
                        <Box display='flex' justifyContent='space-between' alignItems='center'>
                            <Box sx={{ fontSize: 12, minWidth: { xs: 300, sm: 160, md: 60, lg: 150 } }} >
                                <Negrita>
                                    Participantes los últimos 6 meses
                                </Negrita>

                                <CountUp start={0} duration={10} end={count.sizem} >
                                    {({ countUpRef }) => (
                                        <Box sx={{
                                            display: 'flex', alignItems: 'center',
                                            fontSize: 35
                                        }}>
                                            <span style={{
                                                fontSize: 'inherit',
                                                marginRight: 10, fontWeight: 700
                                            }} ref={countUpRef} />
                                            <span style={{ fontSize: 15 }}>
                                                Participantes
                                            </span>
                                        </Box>
                                    )}
                                </CountUp>
                            </Box>
                            <Box height={100} width={120}>
                                <ResponsiveContainer >
                                    <BarChart height={60} data={dashboard.participantesXMes}>
                                        <Bar dataKey="Participantes" fill={blue[500]} radius={10} />
                                        <Tooltip content={
                                            ({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <Box sx={{
                                                            p: 1,
                                                            borderRadius: 2, bgcolor: grey[900], fontSize: '12px',
                                                            minWidth: 120
                                                        }}>
                                                            <Negrita sx={{ color: grey[50] }}>
                                                                {payload[0].payload.name}
                                                            </Negrita>
                                                            <Normal sx={{ fontSize: 13, color: grey[100] }}>{payload[0].value} Participantes</Normal>
                                                        </Box>
                                                    );
                                                }
                                                return null;
                                            }} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>

                        </Box>
                        <Normal>
                            2.6
                        </Normal>
                    </BoxSombra>
                </Grid>
                <Grid item xs={12} sm={7} >
                    <BoxSombra >
                        <Box px={2} pt={2}>
                            <Negrita sx={{ fontSize: 18 }}>
                                Mayores visitas
                            </Negrita>
                            <Normal>
                                Publicaciones que recibieron mayor audiencia
                            </Normal>
                        </Box>
                        <Tabla
                            hasSearch={false} data={dashboard.masVisitados.sort((a: any, b: any) => b.visitantes - a.visitantes).map((value: any) => (
                                {
                                    Titulo: value.titulo,
                                    "": (
                                        <Stack direction='row' spacing={2} alignItems='center'>
                                            <Negrita sx={{ display: 'flex', alignItems: 'center', fontSize: 13 }}>
                                                <Icon icon="solar:eye-bold" fontSize={20} style={{ marginRight: 5 }} />
                                                {value.visitantes}
                                            </Negrita>

                                            <BotonOutline
                                                sx={{
                                                    p: 0, m: 0,
                                                    border: `1px solid ${blue[600]}`,
                                                    color: blue[700],
                                                    width: 30, minWidth: 0, height: 30
                                                }}
                                                onClick={() => router.push(`/${value.name}s/${value.id}`)}>
                                                <Icon icon="tdesign:internet" fontSize={20} />
                                            </BotonOutline>
                                        </Stack>)
                                }
                            ))} />
                    </BoxSombra>
                </Grid>
                <Grid item xs={12} sm={5}>
                    <BoxSombra p={2}>
                        <Negrita sx={{ fontSize: 18 }}>
                            Continentes más interesados
                        </Negrita>
                        <Normal>
                            Mayores activos con convenios y becas
                        </Normal>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart
                                width={500}
                                data={dashboard.publicacionXContinente}
                                margin={{ top: 20 }}
                                barSize={15}
                            >
                                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip content={
                                    ({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const continenteAbreviatura = payload[0].payload.name; // Obtener la abreviatura del continente
                                            const continenteCompleto = continenteNombres[continenteAbreviatura]; // Obtener el nombre completo
                                            return (
                                                <Box sx={{
                                                    p: 1,
                                                    borderRadius: 2, bgcolor: grey[900], fontSize: '12px',
                                                    minWidth: 120
                                                }}>
                                                    <Negrita sx={{ color: grey[50] }}>
                                                        {continenteCompleto} {/* Mostrar el nombre completo del continente */}
                                                    </Negrita>
                                                    <Normal sx={{ fontSize: 13, color: grey[100] }}>{payload[0].value} Becas </Normal>
                                                    <Normal sx={{ fontSize: 13, color: grey[100] }}>{payload[1].value} Convenios </Normal>
                                                </Box>
                                            );
                                        }
                                        return null;
                                    }} />
                                <Legend />
                                <Bar width={20} radius={[0, 0, 10, 10]} dataKey="Becas" stackId="a" fill={green[500]} />
                                <Bar radius={[10, 10, 0, 0]} dataKey="Convenios" stackId="a" fill={green[900]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </BoxSombra>
                </Grid>

                <Grid item xs={12} lg={4}>
                    <BoxSombra p={2} >
                        <Negrita sx={{ fontSize: 18 }}>
                            Publicaciones con mayor demanda
                        </Negrita>
                        <Normal>
                            Mayores activos con convenios y becas
                        </Normal>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart
                                layout="vertical" // Establece la disposición del gráfico como horizontal
                                data={dashboard.mayorVisto}
                                margin={{ top: 20, left: 30 }}
                                barSize={15}
                            >
                                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                                <YAxis style={{ textTransform: 'capitalize' }} type="category" dataKey="name" />
                                <XAxis type="number" allowDecimals={false} />
                                <Tooltip content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <Box sx={{
                                                p: 1,
                                                borderRadius: 2,
                                                bgcolor: grey[900],
                                                fontSize: '12px',
                                                minWidth: 120
                                            }}>
                                                <Negrita sx={{ color: grey[50] }}>
                                                    {payload[0].payload.name.toUpperCase()}S
                                                </Negrita>
                                                <Normal sx={{ fontSize: 13, color: grey[100] }}>{payload[0].value} Visitantes</Normal>
                                            </Box>
                                        );
                                    }
                                    return null;
                                }} />
                                <Bar dataKey="Visitas" radius={10} fill={grey[800]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </BoxSombra>
                </Grid>
                <Grid item xs={12} sm={6} lg={4}>
                    <BoxSombra >
                        <Box px={2} pt={2}>
                            <Negrita sx={{ fontSize: 18 }}>
                                Paises más concurridos
                            </Negrita>
                            <Normal>
                                Países que atraen a más visitantes
                            </Normal>
                        </Box>
                        <Tabla
                            hasSearch={false}
                            data={dashboard.conteoPais.map((value: any) => ({
                                Pais: (
                                    <Box display='flex' alignItems='center' my={1}>

                                        <Icon style={{ marginRight: 10, borderRadius: 10 }} fontSize={25} icon={`flagpack:${value.name.toLowerCase()}`} />
                                        <b style={{ fontSize: 15 }}>{value.name}</b>
                                    </Box>
                                ),
                                "": (<Negrita sx={{
                                    display: 'flex', alignItems: 'center', color: grey[700],
                                }}>
                                    <Icon style={{ marginRight: 10, fontSize: 18 }} icon="solar:eye-bold" />
                                    {value.value} Visitantes
                                </Negrita>)
                            }))}

                        />
                    </BoxSombra>
                </Grid>
                <Grid item xs={12} sm={6} lg={4}>
                    <BoxSombra position='relative' >
                        <Box px={2} pt={2} pr={11}>
                            <Negrita sx={{ fontSize: 18 }}>
                                Últimas instituciones agregadas
                            </Negrita>
                            <Normal >
                                Mire los ultimos 10 instituciones creados
                            </Normal>
                            <BotonFilled
                                onClick={() => router.push('/dashboard/instituciones')}
                                sx={{ height: 40, position: 'absolute', right: 10, top: 20 }}>
                                Ver más
                            </BotonFilled>
                        </Box>
                        <Tabla
                            hasSearch={false}
                            data={dashboard.Instituciones.map((value: Institucion) => ({
                                "Institución": (
                                    <Box display='flex' alignItems='center' my={0.6}>
                                        <Image style={{
                                            borderRadius: 10,
                                            padding: 10, background: '#eee',
                                            overflow: 'hidden'
                                        }} objectFit="cover" width={50} height={50}
                                            src={value.logo ? (fileDomain + value.logo) : '/default-image.jpg'} />
                                        <Box ml={1}>
                                            <Negrita>
                                                {value.nombre}
                                            </Negrita>
                                            <Box sx={{ display: 'flex', alignItems: 'center', color: grey[600] }}>
                                                <Icon icon="gridicons:phone" fontSize={20} />
                                                <Normal>
                                                    {value.contacto || 'Sin contacto'}
                                                </Normal>
                                            </Box>
                                        </Box>
                                    </Box>
                                ),
                                "": (<Stack direction='row'>
                                    {
                                        value.web ?
                                            <BotonOutline onClick={() => {
                                                router.push(value.web!);
                                            }}>
                                                <Icon icon="tdesign:internet" fontSize={20} />

                                            </BotonOutline> : null
                                    }
                                </Stack>)
                            }))}>

                        </Tabla>
                    </BoxSombra>
                </Grid>
            </Grid>

        </Box>
    )
}