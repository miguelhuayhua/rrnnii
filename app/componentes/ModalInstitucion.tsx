'use client';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import React from 'react';
import { IoClose } from "react-icons/io5";
import { BotonFilled, BotonSimple } from '@/app/componentes/Botones';
import { Negrita, Normal, Titulo } from '@/app/componentes/Textos';
import { Institucion } from '@prisma/client';
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
                    sx={{ position: 'absolute', top: 15, right: 5 }}>
                    <IoClose fontSize={25} />
                </BotonSimple>
                <Titulo sx={{ fontSize: 20, mb: 3, pr: 4 }}>
                    Conozca más: {Institucion.nombre}
                </Titulo>

            </DialogContent>

        </Dialog >
    );
}