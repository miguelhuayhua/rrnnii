"use client";
import { BotonFilled, BotonOutline, BotonSimple } from "@/app/componentes/Botones";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Grid, LinearProgress, MenuItem } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdArrowLeft, MdOutlineAttachFile } from "react-icons/md";
import { BoxSombra } from "../../componentes/Mostrar";
import { DatePickerBox, InputBox } from "@/app/componentes/Datos";
import { BsFileEarmarkPdfFill, BsImageAlt } from "react-icons/bs";
import { Controller, useForm } from "react-hook-form";
import { Evento } from "@prisma/client";
import 'react-quill/dist/quill.snow.css';
const Editor = dynamic(() => import('react-quill').then((module) => module.default), { ssr: false, loading: () => (<EditorSkeleton />) });
import { useFilePicker } from 'use-file-picker';
import { useModal } from "@/providers/ModalProvider";
import { axiosInstance } from "@/globals";
import { useState } from "react";
import Image from 'next/legacy/image';
import { ChipBox } from "@/app/componentes/Mostrar";
import { useSnackbar } from "@/providers/SnackbarProvider";
import dynamic from "next/dynamic";
import EditorSkeleton from "@/app/skeletons/EditorSkeleton";
import { grey, red, blue } from "@mui/material/colors";
import { RiFileWord2Line } from "react-icons/ri";

export default function Page() {
    const { control, formState: { errors }, handleSubmit, setValue, watch } = useForm<Evento>({
        defaultValues: { titulo: '', tipo: 'online', descripcion: '', inicio: '', link: '', pdf: '' }, shouldFocusError: true
    });
    const [load, setLoad] = useState(false);
    const [portada, setPortada] = useState<any>('');
    const [documento, setDocumento] = useState<any>('');
    const router = useRouter();
    const { openSnackbar } = useSnackbar();
    const { openModal } = useModal();
    const { openFilePicker } = useFilePicker({
        readAs: 'DataURL',
        accept: 'image/*',
        multiple: false,
        onFilesSuccessfullySelected: ({ plainFiles }) => {
            setValue('imagen', URL.createObjectURL(plainFiles[0]));
            setPortada(plainFiles[0]);
            openSnackbar('Imagen actualizada con éxito');
        }
    });
    const PDFPicker = useFilePicker({
        readAs: 'DataURL',
        accept: '.pdf, .doc, .docx',
        multiple: false,
        onFilesSuccessfullySelected: ({ plainFiles }) => {
            setDocumento(plainFiles[0]);
            openSnackbar('Documento actualizado con éxito');
        }
    });

    const onSubmit = (evento: Evento) => {
        if (portada) {
            let form = new FormData();
            form.append('titulo', evento.titulo);
            form.append('tipo', evento.tipo);
            form.append('pdf', evento.pdf);
            form.append('link', evento.link!);
            form.append('inicio', evento.inicio);
            form.append('descripcion', evento.descripcion);
            form.append('imagen', portada);
            form.append('doc', documento);
            openModal({
                titulo: '¿Continuar?',
                content: 'Un nuevo evento se agregará',
                callback: async () => {
                    setLoad(true);
                    let res = await axiosInstance.post('/api/evento/crear', form);
                    if (!res.data.error) {
                        router.back();
                        router.refresh();
                    }
                    setLoad(false);
                    return res.data.mensaje;
                }
            });
        }
        else {
            openSnackbar('Por favor introduzca una imagen de referencia');
        }
    }
    return (
        <>
            <Box px={{ xs: 1, md: 2, lg: 5 }}>
                <Breadcrumbs sx={{ mb: 1 }}>
                    <Link style={{ textDecoration: 'none' }} href="/dashboard">
                        <Normal>Principal</Normal>
                    </Link>
                    <Link style={{ textDecoration: 'none' }} href="/dashboard/eventos">
                        <Normal>Eventos</Normal>
                    </Link>
                    <Negrita>Crear</Negrita>
                </Breadcrumbs>
                <Titulo sx={{ mb: 2 }}>
                    Crear nuevo evento
                </Titulo>
                <BotonSimple
                    startIcon={<MdArrowLeft fontSize={20} />}
                    onClick={() => router.back()}>
                    Regresar
                </BotonSimple>
                <Grid container spacing={2} px={{ xs: 0, md: 5, lg: 10, xl: 5 }} py={4}>
                    <Grid item xs={12} sm={5} lg={4}>
                        <BoxSombra p={2}>
                            <Box sx={{
                                aspectRatio: 1,
                                bgcolor: grey[100],
                                p: 1,
                                border: `1px dashed ${grey[400]}`,
                                flexDirection: 'column',
                                borderRadius: 5,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: grey[900],
                                transition: 'color 0.25s',
                                position: 'relative',
                                overflow: 'hidden',
                                "&:hover": {
                                    color: grey[500],
                                    cursor: 'pointer'
                                }
                            }}
                                onClick={() => openFilePicker()}
                            >
                                {
                                    watch('imagen') ? <Image src={watch('imagen')} layout='fill' objectFit='cover' /> : null
                                }
                                <BsImageAlt color={'inherit'} fontSize={30} />
                                <Normal sx={{ color: 'inherit', fontWeight: 600, mt: 1 }}>+ Subir imagen</Normal>
                            </Box>
                            <Normal sx={{ fontSize: 13, textAlign: 'center', my: 3 }}>Permitido: .png, .jpeg, .jpg</Normal>
                            <Box px={{ xs: 2, sm: 0 }}>
                                <Box sx={{
                                    p: 2,
                                    border: `1px solid ${grey[400]}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    borderRadius: 3,
                                    color: grey[900],
                                    position: 'relative',
                                    transition: 'border .5s',
                                    "&:hover": {
                                        border: `1px solid ${red[300]}`
                                    }
                                }}
                                    onClick={() => PDFPicker.openFilePicker()}
                                >
                                    <Normal sx={{ fontSize: 15, color: 'inherit', fontWeight: 600 }}>PDF o Word de Referencia</Normal>
                                    <MdOutlineAttachFile style={{ fontSize: 20 }} />
                                </Box>
                                {
                                    documento ?
                                        <ChipBox icon={documento.type.includes('pdf') ?
                                            <BsFileEarmarkPdfFill fontSize={20} color={red[400]} /> : <RiFileWord2Line fontSize={20} color='#1951b2' />}
                                            sx={{
                                                mt: 2,
                                                border: `1px solid ${documento.type.includes('pdf') ? red[400] : '#1951b2'}`,
                                                height: 40,
                                                bgcolor: 'white'
                                            }}
                                            label={documento.name}
                                            onDelete={() => {
                                                setDocumento(null);
                                            }}
                                        />
                                        : null
                                }
                            </Box>
                        </BoxSombra>

                    </Grid>
                    <Grid item xs={12} sm={7} lg={8}>
                        <BoxSombra p={2} component='form' onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} lg={6}>
                                    <Controller
                                        name="titulo"
                                        control={control}
                                        rules={{ required: 'Título es obligatorio' }}
                                        render={({ field: { ref, ...field } }) => (
                                            <InputBox
                                                {...field}
                                                label='Título'
                                                error={!!errors.titulo}
                                                helperText={errors.titulo?.message || 'Este es el título principal que será visible en el evento'}
                                                inputRef={ref}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="descripcion"
                                        control={control}
                                        render={({ field }) => (
                                            <Box>
                                                <Negrita sx={{ my: 1, fontWeight: 600 }}>
                                                    Descripción:
                                                </Negrita>
                                                <Editor
                                                    value={field.value}
                                                    modules={{
                                                        toolbar: [
                                                            [{ 'header': [2, 3, 4, 5, false] }],
                                                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                                                            ['link'],
                                                        ]
                                                    }}
                                                    preserveWhitespace
                                                    className="editor"
                                                    onChange={(value) => { field.onChange(value) }}
                                                />
                                            </Box>
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <Controller
                                        name="tipo"
                                        control={control}
                                        render={({ field: { ref, ...field } }) => (
                                            <InputBox
                                                select
                                                label='Modalidad'
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
                                                <MenuItem value='online'>Online</MenuItem>
                                                <MenuItem value='presencial'>Presencial</MenuItem>
                                            </InputBox>
                                        )}
                                    />
                                    <Controller
                                        name="inicio"
                                        control={control}
                                        rules={{ required: 'Inicio de evento requerido' }}
                                        render={({ field: { ref, ...field } }) => (
                                            <DatePickerBox
                                                sx={{ mt: 2 }}
                                                disablePast
                                                onChange={(ev: any) => {
                                                    field.onChange(ev?.format('DD/MM/YYYY'))
                                                }}
                                                slotProps={{
                                                    textField: {
                                                        inputRef: ref,
                                                        label: 'Inicio de evento',
                                                        error: !!errors.inicio,
                                                        helperText: errors.inicio?.message
                                                    }
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <BotonFilled type="submit" sx={{ float: 'right' }}>Crear Evento</BotonFilled>
                                </Grid>
                            </Grid>
                        </BoxSombra>
                    </Grid>
                </Grid>
            </Box>
            {load ? <LinearProgress style={{ position: 'absolute', top: 0, width: "100%" }} /> : null}
        </>
    )
}