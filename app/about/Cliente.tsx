'use client';
import { Box, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import Image from 'next/legacy/image';
import axios from "axios";
import Organigrama from "./Organigrama";
import { Negrita, Normal, Titulo } from "../componentes/Textos";
import { BoxSombra } from "../componentes/Mostrar";


const Cliente = () => {

    const [personal, setPersonal] = useState([]);
    useEffect(() => {
        document.addEventListener('DOMContentLoaded', () => {
            const interBubble = document.querySelector<HTMLDivElement>('.interactive')!;
            let curX = 0;
            let curY = 0;
            let tgX = 0;
            let tgY = 0;

            function move() {
                curX += (tgX - curX) / 20;
                curY += (tgY - curY) / 20;
                interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
                requestAnimationFrame(() => {
                    move();
                });
            }

            window.addEventListener('mousemove', (event) => {
                tgX = event.clientX;
                tgY = event.clientY;
            });

            move();
        });
        axios.post('/api/persona/listar').then(res => {
            setPersonal(res.data);
        })
    }, [])
    return (
        <>

            <Box className="gradient-bg" sx={{
                position: 'fixed', top: 0, left: 0,
                height: "100%", width: "100vw"
            }}>

                <svg xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <filter id="goo">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
                            <feBlend in="SourceGraphic" in2="goo" />
                        </filter>
                    </defs>
                </svg>


                <div className="gradients-container">
                    <div className="g1"></div>
                    <div className="g2"></div>
                    <div className="g3"></div>
                    <div className="g4"></div>
                    <div className="g5"></div>
                    <div className="interactive"></div>
                </div>

            </Box>

            <Grid container spacing={4} py={3}
                pb={10} px={1} position='relative'>
                <Grid item xs={12}>
                    <Titulo sx={{ textAlign: 'center', py: 3 }}>
                        Sobre Nosotros
                    </Titulo>
                </Grid>
                <Grid item xs={12} sm={6} lg={4}>
                    <BoxSombra p={3} position='relative'>
                        <Box sx={{ position: 'absolute', top: 20, left: 15 }}>
                            <Image
                                src='/logo-upea.png' layout="fixed" width={40} height={40} />
                        </Box>
                        <Negrita sx={{ textAlign: 'center', fontSize: 20, mb: 2 }}>
                            Misión
                        </Negrita>
                        <Normal sx={{ textAlign: 'justify' }}>
                            {
                                '“La Dirección de Relaciones Internacionales DRNI de la UPEA, es la encargada de la internacionalización del conocimiento académico, científico, tecnológico, de Interacción Social e Investigación en todos los campos del conocimiento, para fortalecer y expandir los vínculos internacionales con universidades nacionales y extranjeras; de beneficio para docentes y estudiantes.”'
                            }
                        </Normal>
                    </BoxSombra>
                </Grid>
                <Grid item xs={12} sm={6} lg={4}>
                    <BoxSombra p={3} position='relative'>
                        <Box sx={{ position: 'absolute', top: 20, left: 15 }}>
                            <Image
                                src='/logo-upea.png' layout="fixed" width={40} height={40} />
                        </Box>
                        <Negrita sx={{ textAlign: 'center', fontSize: 20, mb: 2 }}>
                            Visión
                        </Negrita>
                        <Normal sx={{ textAlign: 'justify' }}>
                            {
                                '“La Dirección de Relaciones Internacionales DRNI de la UPEA, es la encargada de la internacionalización del conocimiento académico, científico, tecnológico, de Interacción Social e Investigación en todos los campos del conocimiento, para fortalecer y expandir los vínculos internacionales con universidades nacionales y extranjeras; de beneficio para docentes y estudiantes.”'
                            }
                        </Normal>
                    </BoxSombra>
                </Grid>
                <Grid item xs={12} sm={6} lg={4} mx='auto'>
                    <BoxSombra p={3} position='relative'>
                        <Box sx={{ position: 'absolute', top: 20, left: 15 }}>
                            <Image
                                src='/logo-upea.png' layout="fixed" width={40} height={40} />
                        </Box>
                        <Negrita sx={{ textAlign: 'center', fontSize: 20, mb: 2 }}>
                            Líneas de acción
                        </Negrita>
                        <Normal sx={{ textAlign: 'justify' }}>
                            {
                                '“La Dirección de Relaciones Internacionales, propone trabajar las siguientes líneas de acción: Promoción de la información y filiación de entidades de cooperación. Gestión y fortalecimiento académico vía intercambio de docentes y estudiantes. La Promoción y fortalecimiento de la investigación científica - tecnológica. El fortalecimiento de los procesos de Interacción Social y Extensión Universitaria. Programas de Becas.”'
                            }
                        </Normal>
                    </BoxSombra>
                </Grid>
                <Grid item xs={12} mx={{ xs: 4, md: 10, lg: 20, xl: 30 }}>
                    <Negrita sx={{ textAlign: 'center', fontSize: 20, mb: 2 }}>
                        Nuestro objetivo
                    </Negrita>
                    <ol style={{ margin: "0 10px", padding: 0 }}>
                        <li style={{ marginTop: 20 }}>
                            <Normal sx={{ textAlign: 'justify' }}>
                                {
                                    '“Promover el fortalecimiento de las relaciones de la Universidad Pública de El Alto (UPEA), con instituciones Nacionales, Internacionales relacionadas con la Educación Superior.”'
                                }
                            </Normal>
                        </li>
                        <li style={{ marginTop: 20 }}>
                            <Normal sx={{ textAlign: 'justify' }}>
                                {
                                    '“Promover el intercambio de docentes y estudiantes con universidades del exterior.”'
                                }
                            </Normal>
                        </li>

                        <li style={{ marginTop: 20 }}>
                            <Normal sx={{ textAlign: 'justify' }}>
                                {
                                    '“Gestionar financiamiento para la ejecución de programas y proyectos de investigación tecnológica en todas las áreas del conocimiento insertados en el Plan de desarrollo del a UPEA.”'
                                }
                            </Normal>
                        </li>
                        <li style={{ marginTop: 20 }}>
                            <Normal sx={{ textAlign: 'justify' }}>
                                {
                                    '“Gestionar la concreción de convenios de cooperación bilateral y multilateral con instituciones extranjeras y nacionales.”'
                                }
                            </Normal>
                        </li>
                        <li style={{ marginTop: 20 }}>
                            <Normal sx={{ textAlign: 'justify' }}>
                                {
                                    '“Fortalecer las actividades de investigación ciencia y tecnología a través de la realización de conferencias internacionales, talleres, seminarios en todos los campos del conocimiento dirigido a la comunidad universitaria en temas de actualidad.”'
                                }
                            </Normal>
                        </li>
                    </ol>
                </Grid>
                <Grid item xs={12} my={3}>
                    <Titulo textAlign='center'>
                        Organigrama de la Unidad
                    </Titulo>
                </Grid>
                <Grid item xs={12} position='relative'>

                    <Box height={600} width={{ xs: 480 }} mx='auto'>
                        <Organigrama personal={personal} />
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}
export default Cliente;