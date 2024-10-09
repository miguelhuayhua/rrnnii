'use client';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import React, { useEffect, useState } from 'react';
import { IoClose } from "react-icons/io5";
import { Icon as Iconify } from '@iconify/react';
import { Autocomplete, Box, Grid, LinearProgress, MenuItem } from '@mui/material';
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
import Image from 'next/legacy/image';
import dynamic from 'next/dynamic';
import EditorSkeleton from '@/app/skeletons/EditorSkeleton';
import { Beca, Institucion } from '@prisma/client';
import { grey, red } from '@mui/material/colors';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { RiFileWord2Line } from 'react-icons/ri';
import { ChipBox } from '@/app/componentes/Mostrar';
import axios from 'axios';
import { fileDomain } from '@/utils/globals';
import { FaUserTie } from 'react-icons/fa';
import dayjs from 'dayjs';
interface Props {
    setBeca: any;
    Beca: Beca;
    setBecas: any;
    setPrevBecas: any;
}
export default function ModalBeca({ setBeca, Beca, setBecas, setPrevBecas }: Props) {
    const { control, formState: { errors, isDirty }, handleSubmit, watch, setValue } =
        useForm<Beca & { Institucion: Institucion }>({
            defaultValues: Beca, shouldFocusError: true
        });
    const { openModal } = useModal();
    const [load, setLoad] = useState(false);
    const [portada, setPortada] = useState<any>('');
    const { openSnackbar } = useSnackbar();
    const [documento, setDocumento] = useState<any>('');
    const [instituciones, setInstituciones] = useState([]);
    useEffect(() => {
        axios.post('/api/institucion/todo', { opcion: 'activo' }).then(res => {
            setInstituciones(res.data);
        })
    }, []);
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
    const onSubmit = (beca: Beca & { Institucion: Institucion }) => {
        let form = new FormData();
        form.append('titulo', beca.titulo);
        form.append('pdf', beca.pdf);
        form.append('descripcion', beca.descripcion);
        form.append('portada', portada);
        form.append('documento', documento);
        form.append('institucion', beca.Institucion.nombre);
        form.append('encargado', beca.encargado);
        form.append('termina', beca.termina);
        form.append('continente', beca.continente);
        form.append('pais', beca.pais);
        form.append('tipo', beca.tipo);
        form.append('id', beca.id);
        openModal({
            titulo: '¿Continuar?',
            content: 'La beca será modificada',
            callback: async () => {
                setLoad(true);
                let res = await axios.post('/api/beca/modificar', form);
                if (!res.data.error) {
                    setBeca(null);
                    axios.post('/api/beca/todo', {}).then(res => {
                        setBecas(res.data);
                        setPrevBecas(res.data);
                    });
                }
                setLoad(false);
                return res.data.mensaje;
            }
        });
    }
    return (
        <Dialog
            open={!!Beca}
            keepMounted={false}
            maxWidth='md'
            onClose={() => { setBeca(null) }}
        >
            {load ? <LinearProgress style={{ position: 'absolute', top: 0, left: 0, width: "100%" }} /> : null}
            <DialogContent sx={{ position: 'relative', p: 2 }}>
                <BotonSimple onClick={() => setBeca(null)} sx={{ position: 'absolute', top: 5, right: 5 }}>
                    <IoClose fontSize={25} />
                </BotonSimple>
                <Titulo sx={{ fontSize: 20, mb: 3, pr: 4 }}>
                    Información sobre {Beca.titulo}
                </Titulo>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
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
                                    helperText={errors.titulo?.message || 'Este es el título principal que será visible en el beca'}
                                    inputRef={ref}
                                />
                            )}
                        />
                        <Controller
                            name="descripcion"
                            control={control}
                            render={({ field }) => (
                                <Box mb={2}>
                                    <Negrita sx={{ mb: 1 }}>
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
                        <Controller control={control}
                            name='encargado'
                            render={
                                ({ field }) =>
                                    <InputBox
                                        InputProps={{ endAdornment: <FaUserTie /> }}
                                        label='Encargado'
                                        {...field}
                                    />
                            }
                        />
                        <Controller
                            name="termina"
                            control={control}
                            rules={{ required: 'Incluya la finalización de la beca' }}
                            render={({ field: { ref, ...field } }) => (
                                <DatePickerBox
                                    disablePast
                                    onChange={(ev: any) => {
                                        field.onChange(ev?.format('DD/MM/YYYY'))
                                    }}
                                    value={dayjs(field.value, 'DD/MM/YYYY')}
                                    slotProps={{
                                        textField: {
                                            inputRef: ref,
                                            label: 'Finalización de la beca',
                                            error: !!errors.termina,
                                            helperText: errors.termina?.message
                                        }
                                    }}
                                />
                            )}
                        />
                        <Controller
                            name="Institucion.nombre"
                            control={control}
                            rules={{ required: 'Institución no puede quedar vacío' }}
                            render={({ field: { ref, ...field } }) => (
                                <Autocomplete
                                    multiple={false}
                                    value={field.value}
                                    onChange={(_, value) => field.onChange(value)}
                                    disableClearable
                                    options={instituciones.map((value: Institucion) => value.nombre)}
                                    renderInput={(params) =>
                                        <InputBox
                                            {...params}
                                            value={field.value}
                                            error={!!errors.Institucion?.nombre}
                                            helperText={errors.Institucion?.nombre?.message}
                                            label='Institución'
                                        />}
                                />

                            )}
                        />

                    </Grid>
                    {
                        isDirty ?
                            <Grid item xs={12}>
                                <BotonFilled onClick={handleSubmit(onSubmit)} sx={{ float: 'right' }}>Modificar Beca</BotonFilled>
                            </Grid>
                            : null
                    }
                </Grid>
            </DialogContent>

        </Dialog >
    );
}