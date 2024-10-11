'use client';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { Box, Grid, MenuItem, LinearProgress } from '@mui/material';
import { Evento } from '@prisma/client';
import { BotonFilled, BotonSimple } from '@/app/componentes/Botones';
import { Negrita, Normal, Titulo } from '@/app/componentes/Textos';
import { Controller, useForm } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
const Editor = dynamic(() => import('react-quill').then((module) => module.default), { ssr: false, loading: () => (<EditorSkeleton />) });
import { useFilePicker } from 'use-file-picker';
import { BsFileEarmarkPdfFill, BsImageAlt } from 'react-icons/bs';
import { DatePickerBox, InputBox } from '@/app/componentes/Datos';
import { MdOutlineAttachFile } from 'react-icons/md';
import { useModal } from '@/providers/ModalProvider';
import { ChipBox } from '@/app/componentes/Mostrar';
import Image from 'next/legacy/image';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import EditorSkeleton from '@/app/skeletons/EditorSkeleton';
import { grey, red } from '@mui/material/colors';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { RiFileWord2Line } from 'react-icons/ri';
import axios from 'axios';
import { fileDomain } from '@/utils/globals';
import { IoMdLink } from 'react-icons/io';
interface Props {
    setEvento: any;
    Evento: Evento;
    setEventos: any;
    setPrevEventos: any;
}
export default function ModalEvento({ setEvento, Evento, setEventos, setPrevEventos }: Props) {
    const { control, formState: { errors, isDirty }, handleSubmit, setValue, watch } = useForm<Evento>({
        defaultValues: Evento, shouldFocusError: true
    });
    const [portada, setPortada] = useState<any>('');
    const [documento, setDocumento] = useState<any>('');
    const { openModal } = useModal();
    const [load, setLoad] = useState(false);
    const { openSnackbar } = useSnackbar();
    const { openFilePicker } = useFilePicker({
        readAs: 'DataURL',
        accept: 'image/*',
        multiple: false,
        onFilesSuccessfullySelected: ({ plainFiles }) => {
            setValue('imagen', URL.createObjectURL(plainFiles[0]), { shouldDirty: true });
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
            setValue('pdf', plainFiles[0].name, { shouldDirty: true });
            openSnackbar('Documento actualizado con éxito');
        }
    });
    const onSubmit = (evento: Evento) => {
        let form = new FormData();
        form.append('titulo', evento.titulo);
        form.append('tipo', evento.tipo);
        form.append('pdf', evento.pdf);
        form.append('link', evento.link!);
        form.append('inicio', evento.inicio);
        form.append('descripcion', evento.descripcion);
        form.append('imagen', portada);
        form.append('doc', documento);
        form.append('id', evento.id)
        openModal({
            titulo: '¿Continuar?',
            content: 'Un nuevo evento se agregará',
            callback: async () => {
                setLoad(true);
                let res = await axios.post('/api/evento/modificar', form);
                if (!res.data.error) {
                    axios.post('/api/evento/todo').then(res => {
                        setEventos(res.data);
                        setPrevEventos(res.data);
                    });
                    setEvento(null);
                    setLoad(false);
                }
                return res.data.mensaje;
            }
        });
    }
    return (
        <Dialog
            open={!!Evento}
            keepMounted={false}
            maxWidth='md'
            onClose={() => { setEvento(null) }}
        >
            {load ? <LinearProgress sx={{
                position: 'absolute', top: 0, left: 0, zIndex: 10, width: "100%"
            }} /> : null}
            <DialogContent sx={{ position: 'relative', p: 2 }}>
                <BotonSimple onClick={() => setEvento(null)} sx={{ position: 'absolute', top: 5, right: 5 }}>
                    <IoClose fontSize={25} />
                </BotonSimple>
                <Titulo sx={{ fontSize: 20, mb: 3, pr: 4 }}>
                    Información sobre {Evento.titulo}
                </Titulo>
                <Grid container spacing={2}>
                    <Grid item xs={12} mx='auto' sm={6}>
                        <Box px={{ xs: 10, sm: 0 }}>
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
                                    watch('imagen') ?
                                        <Image src={(portada ? '' : fileDomain) + watch('imagen')} layout='fill' objectFit='cover' />
                                        : null
                                }
                                <BsImageAlt color={'inherit'} fontSize={30} />
                                <Normal sx={{ color: 'inherit', fontWeight: 600, mt: 1 }}>+ Subir imagen</Normal>
                            </Box>
                        </Box>
                        <Normal sx={{ fontSize: 13, textAlign: 'center', my: 3 }}>Permitido: .png, .jpeg, .jpg</Normal>
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
                                    <BsFileEarmarkPdfFill fontSize={20} color={'#e62c31'} /> : <RiFileWord2Line fontSize={20} color='#1951b2' />}
                                    sx={{
                                        mt: 2,
                                        border: `1px solid ${documento.type.includes('pdf') ? '#e62c31' : '#1951b2'}`,
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
                    </Grid>
                    <Grid item xs={12} sm={6}>
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
                                <Box mb={1}>
                                    <Negrita sx={{ my: 1 }}>
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
                        <Controller
                            name="tipo"
                            control={control}
                            render={({ field: { ref, ...field } }) => (
                                <InputBox
                                    sx={{ mt: 1 }}
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
                            render={({ field: { ref, ...field } }) => (
                                <DatePickerBox
                                    defaultValue={dayjs(field.value, 'DD/MM/YYYY')}
                                    onChange={(ev: any) => {
                                        field.onChange(ev?.format('DD/MM/YYYY'))
                                    }}
                                    slotProps={{
                                        textField: {
                                            inputRef: ref,
                                            label: 'Inicio del evento',
                                        }
                                    }}
                                />
                            )}
                        />
                        {
                            watch('tipo') == 'online' ?

                                <Controller
                                    name="link"
                                    control={control}
                                    rules={{ required: 'Título es obligatorio' }}
                                    render={({ field: { ref, ...field } }) => (
                                        <InputBox
                                            {...field}
                                            label='Link de acceso'
                                            InputProps={{ endAdornment: <IoMdLink fontSize={25} /> }}
                                        />
                                    )}
                                /> : null
                        }
                    </Grid>
                    {
                        isDirty ?
                            <Grid item xs={12}>
                                <BotonFilled sx={{ float: 'right' }} onClick={handleSubmit(onSubmit)} >Modificar Evento</BotonFilled>
                            </Grid>
                            : null
                    }
                </Grid>
            </DialogContent>

        </Dialog >
    );
}