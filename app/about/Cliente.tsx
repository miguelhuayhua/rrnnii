'use client';
import { Badge, Box, CircularProgress, Divider, Grid, } from "@mui/material";
import { InputBox } from "../componentes/Datos";
import { BiSearch } from "react-icons/bi";
import { BotonFilled, BotonOutline, BotonSimple } from "../componentes/Botones";
import { FiFilter } from "react-icons/fi";
import { Suspense, useCallback, useEffect, useState } from "react";
import PasantiaItem from "../componentes/items/Pasantia";
import Image from 'next/legacy/image';
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Pasantia } from "@prisma/client";
import Organigrama from "./Organigrama";
import { Negrita, Normal, Titulo } from "../componentes/Textos";
import { BoxSombra } from "../componentes/Mostrar";


const Cliente = () => {
    const [open, setOpen] = useState(false);
    const [Pasantias, setPasantias] = useState<Pasantia[]>([]);
    const [PasantiasMain, setPasantiasMain] = useState<Pasantia[]>([]);
    const [load, setLoad] = useState(true);
    const [skip, setSkip] = useState(0);
    const params = useSearchParams();
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


            <Grid container spacing={4} py={3} px={1} position='relative'>
                <Grid item xs={12}>
                    <Titulo sx={{ textAlign: 'center', zIndex: 100, color: 'black' }}>
                        Sobre Nosotros
                    </Titulo>
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
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
                <Grid item xs={12} sm={6} lg={3}>
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
                <Grid item xs={12} sm={6} lg={3}>
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
                <Grid item xs={12} sm={6} lg={3}>
                    <BoxSombra p={3} position='relative'>
                        <Box sx={{ position: 'absolute', top: 20, left: 15 }}>
                            <Image
                                src='/logo-upea.png' layout="fixed" width={40} height={40} />
                        </Box>
                        <Negrita sx={{ textAlign: 'center', fontSize: 20, mb: 2 }}>
                            Nuestro objetivo
                        </Negrita>
                        <ol style={{ margin: "0 10px", padding: 0 }}>
                            <li>
                                <Normal sx={{ textAlign: 'justify' }}>
                                    {
                                        '“Promover el fortalecimiento de las relaciones de la Universidad Pública de El Alto (UPEA), con instituciones Nacionales, Internacionales relacionadas con la Educación Superior.”'
                                    }
                                </Normal>
                            </li>
                        </ol>

                    </BoxSombra>
                </Grid>
                <Grid item xs={12} my={3}>
                    <Divider orientation="horizontal" />
                    <Titulo textAlign='center'>
                        Organigrama de la Unidad
                    </Titulo>
                </Grid>
                <Grid item xs={12} position='relative'>

                    <Box className="gradient-bg" sx={{ position: 'absolute', top: 0, zIndex: 0, left: 0 }}>

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
                    <Box height={600} width={{ xs: 480 }} mx='auto'
                        sx={{ border: '1px solid #eee', borderRadius: 10 }}>
                        <Organigrama personal={personal} />
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}
export default Cliente;