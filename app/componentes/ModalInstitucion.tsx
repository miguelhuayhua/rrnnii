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

                
            </DialogContent>

        </Dialog >
    );
}