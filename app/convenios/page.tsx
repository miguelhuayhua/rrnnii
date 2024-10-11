import { Box, Button, ButtonGroup, Grid, Typography, } from "@mui/material";
import { Suspense } from 'react';
import Navbar from "../static/Navbar";
import Footer from "../static/Footer";
import Image from 'next/legacy/image';
import '@/app/globals.scss';
import { blue, red } from "@mui/material/colors";
import { useRouter } from "next/navigation";
import Link from "next/link";
export const metadata = {
    title: 'Convenios'
}
export default function Home() {

    return (
        <Box bgcolor='#f4f6f8'>
            <Navbar />

            <Box position='relative'>
                <Box sx={{
                    background: 'url("/convenios.png")',
                    backgroundSize: 'cover',
                    opacity: 0.9,
                    width: "100%",
                    zIndex: 10,
                    p: { xs: 3, md: 10, lg: 20, xl: 30 }
                }}>
                    <Typography
                        variant='h1'
                        sx={{ fontWeight: 900, textAlign: { xs: 'center', md: 'start' }, color: '#ff3333', fontSize: { xs: 22, sm: 30, md: 40, xl: 60 }, my: 3 }}
                    >
                        Convenios <br /> <span style={{ color: blue[700] }}>Universidad Pública de El Alto</span>
                    </Typography>
                    <Typography
                        sx={{ color: 'white', my: 3, fontWeight: 40, textAlign: 'start', fontSize: { xs: 15, md: 20, lg: 30 } }}
                    >
                        Los convenios realizados promueven una variedad de actividades en instituciones del exterior como nacionales,
                        con el objetivo de fomentar intercambios culturales y favorecer la colaboración entre docentes, investigadores y estudiantes.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', pb: 4, pt: 2 }}>
                        <ButtonGroup sx={{ color: 'white', }} color="inherit">
                            <Link href='/convenios/buscar?t=nacional'>
                                <Button sx={{ color: 'white', fontSize: 18 }}>Ver convenios nacionales</Button>
                            </Link>
                            <Link href='/convenios/buscar?t=internacional'>
                                <Button sx={{ color: 'white', fontSize: 18 }}>Ver convenios internacionales</Button>
                            </Link>
                        </ButtonGroup>
                    </Box>
                </Box>
                <Typography
                    variant='h2'
                    sx={{ fontWeight: 900, textAlign: 'center', my: 4, fontSize: { xs: 18, sm: 25, md: 35, xl: 40 } }}
                >
                    Convenios por continente
                </Typography>
                <Box display='flex' flexWrap='wrap' justifyContent='space-around'>
                    <Link href={"/convenios/buscar?co=na"}>
                        <Button sx={{ m: 1 }} className="btn-cont">
                            <span >
                                America Norte
                            </span>
                            <Image className="img" layout="fill" objectFit="cover" style={{ userSelect: 'none' }} src='/assets/america-norte.png' />
                        </Button>
                    </Link>
                    <Link href='/convenios/buscar?co=sa'>
                        <Button sx={{ m: 1 }} className="btn-cont">
                            <span >
                                America Sur
                            </span>
                            <Image className="img" layout="fill" objectFit="cover" style={{ userSelect: 'none' }} src='/assets/america-sur.png' />
                        </Button></Link>
                    <Link href='/convenios/buscar?co=eu'>
                        <Button sx={{ m: 1 }} className="btn-cont">
                            <span >
                                Europa
                            </span>
                            <Image className="img" layout="fill" objectFit="cover" style={{ userSelect: 'none' }} src='/assets/europa.png' />
                        </Button>
                    </Link>
                    <Link href='/convenios/buscar?co=as'>
                        <Button sx={{ m: 1 }} className="btn-cont">
                            <span >
                                Asia
                            </span>
                            <Image className="img" layout="fill" objectFit="cover" style={{ userSelect: 'none' }} src='/assets/asia.png' />
                        </Button>
                    </Link>
                    <Link href='/convenios/buscar?co=oc'>
                        <Button sx={{ m: 1 }} className="btn-cont">
                            <span >
                                Oceanía
                            </span>
                            <Image className="img" layout="fill" objectFit="cover" style={{ userSelect: 'none' }} src='/assets/oceania.png' />
                        </Button>
                    </Link>
                    <Link href='/convenios/buscar?co=af'>
                        <Button sx={{ m: 1 }} className="btn-cont">
                            <span >
                                África
                            </span>
                            <Image className="img" layout="fill" objectFit="cover" style={{ userSelect: 'none' }} src='/assets/africa.png' />
                        </Button></Link>

                </Box>
            </Box>
            <Box mt={10}>
                <Footer />
            </Box>
        </Box>
    );
}
