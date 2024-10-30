'use client';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import React from 'react';
import { IoClose } from "react-icons/io5";
import { Icon } from '@iconify/react';
import { BotonSimple } from '@/app/componentes/Botones';
import { Negrita, Normal } from '@/app/componentes/Textos';
import { Institucion } from '@prisma/client';
import { Avatar, Box, Grid } from '@mui/material';
import Link from 'next/link';
import { MdPhone } from 'react-icons/md';
import { fileDomain } from '@/utils/globals';
import { red } from '@mui/material/colors';
interface Props {
    open: boolean;
    setOpen: any;
    Institucion: Institucion;
}
export default function ModalInstitucion({ Institucion, open, setOpen }: Props) {
    return (
        <Dialog
            open={open}
            keepMounted={false}
            maxWidth='md'
            fullWidth
            onClose={() => { setOpen(false) }}
        >
            <DialogContent sx={{ position: 'relative', p: 2 }}>
                <BotonSimple onClick={() => setOpen(false)}
                    sx={{ position: 'absolute', top: 10, right: 10 }}>
                    <IoClose fontSize={25} />
                </BotonSimple>

                <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                    {
                        Institucion.video ?
                            <Box component='iframe'
                                sx={{
                                    width: "100%",
                                    border: 'none', borderRadius: 4, mt: 6,
                                    height: { xs: 200, sm: 300, md: 400, lg: 500 }
                                }}
                                src={"https://www.youtube.com/embed/" + Institucion.video?.split('=')[1]}
                                title="Video institucional" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            /> :
                            <Box sx={{
                                width: "100%",
                                borderRadius: 4, mt: 6,
                                height: { xs: 200, sm: 300, md: 400, lg: 500 },
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'center', border: `1px solid ${red[300]}`
                            }}>
                                <Negrita>
                                    La institución no cuenta con alguna presentación
                                </Negrita>
                            </Box>
                    }
                    <Grid container spacing={2} py={2}>
                        <Grid item xs={12} md={6}>
                            <Box display='flex' alignItems='center' justifyContent='center'>
                                <Avatar sx={{
                                    bgcolor: 'white',
                                    height: 70, width: 70
                                }}
                                    src={Institucion.logo ? (fileDomain + Institucion.logo) : '/default-image.jpg'} />
                                <Box ml={2}>
                                    <Negrita sx={{ fontSize: 18 }}>
                                        {Institucion.nombre}
                                    </Negrita>
                                    <Normal sx={{ color: '#777', display: 'flex', alignItems: 'center' }}>
                                        <MdPhone style={{ marginRight: 5 }} />
                                        {Institucion.contacto || 'Sin número'}
                                    </Normal>
                                </Box>
                            </Box>

                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box display='flex' flexDirection='column'
                                alignItems='center' >
                                <Negrita
                                    textAlign='center'
                                    my={1} display='flex'
                                    alignItems='center'>
                                    <Icon icon="streamline:web" fontSize={25} style={{ marginRight: 10 }} />
                                    {
                                        Institucion.web ? `Visite la página web de ${Institucion.nombre}` :
                                            `La institución no cuenta con una página web`
                                    }
                                </Negrita>
                                <Link
                                    href={Institucion.web!} target='_blank'>
                                    {Institucion.web}
                                </Link>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>

        </Dialog >
    );
}