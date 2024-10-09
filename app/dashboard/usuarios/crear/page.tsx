'use client';
import { BotonFilled, BotonSimple } from "@/app/componentes/Botones";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Autocomplete, Box, Breadcrumbs, Grid, LinearProgress, MenuItem, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdArrowLeft, MdOutlineAttachFile } from "react-icons/md";
import { DatePickerBox, InputBox } from "@/app/componentes/Datos";
import { Controller, useForm } from "react-hook-form";
import { Carrera, Institucion, Persona } from "@prisma/client";
import 'react-quill/dist/quill.snow.css';
import { useModal } from "@/providers/ModalProvider";
import { useEffect, useState } from "react";
import Image from 'next/legacy/image';
import { BoxSombra, ChipBox } from "@/app/componentes/Mostrar";
import { useSnackbar } from "@/providers/SnackbarProvider";
import dynamic from "next/dynamic";
import EditorSkeleton from "@/app/skeletons/EditorSkeleton";
import { grey, red } from "@mui/material/colors";
import { RiFileWord2Line } from "react-icons/ri";
import dayjs from "dayjs";
import axios from "axios";
export default function Page() {
    const { control, formState: { errors }, handleSubmit, watch,
        setValue } = useForm<Persona>({
            defaultValues: {
                nombre: '', paterno: '', materno: '',
                cargo: '', f_nacimiento: dayjs().format('DD/MM/YYYY')
            }, shouldFocusError: true
        });
    const router = useRouter();
    const { openModal } = useModal();
    const [load, setLoad] = useState(false);
    const [portada, setPortada] = useState<any>('');
    const [documento, setDocumento] = useState<any>('');

    const { openSnackbar } = useSnackbar();

    return (
        <>
            <Box px={{ xs: 1, md: 2, lg: 5 }}>
                <Breadcrumbs sx={{ mb: 1 }} >
                    <Link style={{ textDecoration: 'none' }} href="/dashboard">
                        <Normal>Principal</Normal>
                    </Link>
                    <Link style={{ textDecoration: 'none' }} href="/dashboard/pasantias">
                        <Normal>Personal</Normal>
                    </Link>
                    <Negrita>Crear</Negrita>
                </Breadcrumbs>

                <Titulo sx={{ mb: 2 }}>
                    Crear nuevo personal
                </Titulo>
                <BotonSimple
                    startIcon={<MdArrowLeft fontSize={20} />}
                    onClick={() => router.back()}>
                    Regresar
                </BotonSimple>

                <Grid container spacing={2} px={{ xs: 0, md: 10, lg: 20, xl: 5 }} mt={2}>

                    <Grid item xs={12} sm={6}>
                        <BoxSombra p={2} component='form' onSubmit={handleSubmit(Persona => {
                            openModal({
                                titulo: '¿Continuar?',
                                content: 'Se agregará un nuevo personal',
                                async callback() {
                                    let res = await axios.post('/api/persona/crear', Persona);
                                    router.replace('/dashboard/usuarios');
                                    return res.data.mensaje;
                                }
                            })
                        })}>

                            <Controller
                                name="nombre"
                                control={control}
                                rules={{ required: 'Nombre es obligatorio' }}
                                render={({ field: { ref, ...field }, fieldState }) => (
                                    <InputBox
                                        {...field}
                                        label='Nombre'
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                        inputRef={ref}
                                    />
                                )}
                            />
                            <Controller
                                name="paterno"
                                control={control}
                                render={({ field }) => (
                                    <InputBox
                                        {...field}
                                        label='Ap. Paterno'
                                    />
                                )}
                            />
                            <Controller
                                name="materno"
                                control={control}
                                render={({ field }) => (
                                    <InputBox
                                        {...field}
                                        label='Ap. Materno'
                                    />
                                )}
                            />
                            <Controller
                                name="ci"
                                control={control}
                                rules={{ required: 'C.I. es requerido' }}
                                render={({ field: { ref, ...field }, fieldState }) => (
                                    <InputBox
                                        {...field}
                                        label='Carnet de identidad'
                                        inputRef={ref}
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />
                            <Controller
                                name="f_nacimiento"
                                control={control}
                                render={({ field: { ref, ...field } }) => (
                                    <DatePickerBox
                                        disableFuture
                                        inputRef={ref}
                                        label='Fecha de nacimiento'
                                        onChange={ev => {
                                            field.onChange(ev?.format('DD/MM/YYYY'))
                                        }}
                                        value={dayjs(field.value, 'DD/MM/YYYY')}
                                    />
                                )}
                            />
                            <Controller
                                name="cargo"
                                control={control}
                                render={({ field: { ref, ...field } }) => (
                                    <InputBox
                                        select
                                        label='Cargo en la unidad'
                                        {...field}
                                        inputRef={ref}
                                        SelectProps={{
                                            MenuProps: {
                                                slotProps: {
                                                    paper: {
                                                        sx: {
                                                            background: 'linear-gradient(25deg, rgba(255,245,245,1) 0%, rgba(255,255,255,1) 51%, rgba(255,255,255,1) 72%, rgba(244,247,255,1) 100%)',
                                                            px: 0,
                                                            borderRadius: 3,
                                                            border: "1px solid #f1f1f1",
                                                            boxShadow: '-10px 10px 30px #00000022',
                                                            maxHeight: 400
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                    >
                                        <MenuItem value='becas'>Jefe de unidad</MenuItem>
                                        <MenuItem value='idiomas'>Técnico</MenuItem>
                                        <MenuItem value='noticias'>Secretaria</MenuItem>
                                    </InputBox>
                                )}
                            />
                            <BotonFilled type="submit" sx={{ float: 'right' }}>
                                Añadir personal
                            </BotonFilled>
                        </BoxSombra>
                    </Grid>
                </Grid>
            </Box>
            {load ? <LinearProgress style={{ position: 'absolute', top: 0, width: "100%" }} /> : null}
        </>
    )
}