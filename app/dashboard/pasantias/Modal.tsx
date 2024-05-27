'use client';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { Box, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Pasantia } from '@prisma/client';
import { BotonFilled } from '@/app/componentes/Botones';
import { Negrita, Normal, Titulo } from '@/app/componentes/Textos';
import { Controller, useForm } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
import Editor from 'react-quill';
import { useFilePicker } from 'use-file-picker';
import { BsFileEarmarkPdfFill, BsImageAlt } from 'react-icons/bs';
import { DatePickerBox, InputBox, ItemBox } from '@/app/componentes/Datos';
import { MdOutlineAttachFile } from 'react-icons/md';
import { axiosInstance } from '@/globals';
import { useModal } from '@/providers/ModalProvider';
import { useRouter } from 'next/navigation';
import Image from 'next/legacy/image';
import { ChipBox } from '@/app/componentes/Mostrar';
import { FaFileWord } from 'react-icons/fa6';
interface Props {
    setPasantia: any;
    Pasantia: Pasantia;
}
export default function ModalPasantia({ setPasantia, Pasantia }: Props) {
    const theme = useTheme();
    const router = useRouter();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const { control, formState: { errors }, handleSubmit, watch, setValue } = useForm<Pasantia>({
        defaultValues: Pasantia, shouldFocusError: true
    });
    const { openModal } = useModal();
    const [portada, setPortada] = useState<any>('');
    const [documento, setDocumento] = useState<any>('');
    const { openFilePicker } = useFilePicker({
        readAs: 'DataURL',
        accept: 'image/*',
        multiple: false,
        onFilesSuccessfullySelected: ({ plainFiles }) => {
            setValue('imagen', URL.createObjectURL(plainFiles[0]));
            setPortada(plainFiles[0]);
        }
    });
    const PDFPicker = useFilePicker({
        readAs: 'DataURL',
        accept: '.pdf, .doc, .docx',
        multiple: false,
        onFilesSuccessfullySelected: ({ plainFiles }) => {
            setDocumento(plainFiles[0]);
            setValue('pdf', plainFiles[0].name);
        }
    });
    const onSubmit = (pasantia: Pasantia) => {
        let form = new FormData();
        form.append('titulo', pasantia.titulo);
        form.append('pdf', pasantia.pdf);
        form.append('descripcion', pasantia.descripcion);
        form.append('portada', portada);
        form.append('documento', documento);
        form.append('finalizacion', pasantia.finalizacion!);
        form.append('institucion', pasantia.institucion!);
        form.append('id', pasantia.id);
        form.append('modalidad', pasantia.modalidad);
        openModal({
            titulo: '¿Continuar?',
            content: 'Una nueva pasantia se agregará',
            callback: async () => {
                let res = await axiosInstance.post('/api/pasantia/modificar', form);
                if (!res.data.error) {
                    setPasantia(null);
                    router.refresh();
                }
                return res.data.mensaje;
            }
        });
    }
    return (
        <Dialog
            open={!!Pasantia}
            fullScreen={fullScreen}
            keepMounted={false}
            maxWidth='md'
            onClose={() => { setPasantia(null) }}
        >
            <DialogContent sx={{ position: 'relative', p: 2 }}>
                <BotonFilled sx={{ position: 'absolute', top: 10, left: 10 }} onClick={() => setPasantia(null)}>
                    <IoClose fontSize={20} />
                </BotonFilled>
                <Titulo sx={{ fontSize: 16, mt: 4 }}>
                    Información sobre el Pasantia
                </Titulo>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{
                            height: 200,
                            bgcolor: '#f6f7f9',
                            p: 1,
                            border: '1px dashed #ddd',
                            flexDirection: 'column',
                            borderRadius: 5,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: '#919eab',
                            transition: 'color 0.25s',
                            position: 'relative',
                            overflow: 'hidden',
                            "&:hover": {
                                color: '#919eab77',
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
                        <Typography sx={{ fontSize: 13, color: '#a6b0bb', textAlign: 'center', my: 1, fontWeight: 500 }}>Permitido: .png, .jpeg, .jpg</Typography>
                        <Box sx={{
                            height: 35,
                            p: 1,
                            border: '1px solid #e9eaed',
                            flexDirection: 'column',
                            borderRadius: 3,
                            position: 'relative',
                            color: '#969696',
                            transition: 'color 0.25s',
                            "&:hover": {
                                color: '#919eab77',
                                cursor: 'pointer'
                            }
                        }}
                            onClick={() => PDFPicker.openFilePicker()}
                        >
                            <Normal sx={{ color: 'inherit', fontWeight: 600, fontSize: 14, mt: 1, ml: 1 }}>PDF o Word de Referencia</Normal>
                            <MdOutlineAttachFile style={{ position: 'absolute', right: 10, top: 18, fontSize: 20 }} />
                        </Box>
                        {
                            watch('pdf') ?
                                <ChipBox icon={watch('pdf').includes('pdf') ?
                                    <BsFileEarmarkPdfFill fontSize={20} color={'#e62c31'} /> : <FaFileWord fontSize={20} color='#1951b2' />}
                                    sx={{
                                        mt: 2,
                                        border: `1px solid ${watch('pdf').includes('pdf') ? '#e62c31' : '#1951b2'}`,
                                        height: 40,
                                        bgcolor: 'white',
                                        "&:hover": {
                                            cursor: 'pointer'
                                        }
                                    }}
                                    onClick={() => {
                                        let a = document.createElement('a');
                                        a.download = watch('pdf');
                                        a.href = watch('pdf');
                                        a.click();
                                        a.remove();
                                    }}
                                    label={'Descargar'}
                                    onDelete={() => {
                                        setValue('pdf', '');
                                    }}
                                />
                                : null
                        }
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Grid container spacing={2} component='form' onSubmit={handleSubmit(onSubmit)}>
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
                                            helperText={errors.titulo?.message || 'Este es el título principal que será visible en el Pasantia'}
                                            inputRef={ref}
                                        />
                                    )}
                                />
                                <Controller
                                    name="descripcion"
                                    control={control}
                                    render={({ field }) => (
                                        <Box>
                                            <Negrita sx={{ my: 1, color: '#888888', fontWeight: 600, fontSize: 14 }}>
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
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="modalidad"
                                    control={control}
                                    render={({ field: { ref, ...field } }) => (
                                        <InputBox
                                            select
                                            label='Tiempo de duración'
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
                                            <ItemBox value='3'>3 meses</ItemBox>
                                            <ItemBox value='6'>6 meses</ItemBox>
                                        </InputBox>
                                    )}
                                />
                                <Controller
                                    name="institucion"
                                    control={control}
                                    render={({ field: { ref, ...field } }) => (
                                        <InputBox
                                            sx={{ mt: 2 }}
                                            {...field}
                                            label='Institución'
                                            inputRef={ref}
                                        />
                                    )}
                                />
                                <Controller
                                    name="finalizacion"
                                    control={control}

                                    render={({ field: { ref, ...field } }) => (
                                        <DatePickerBox
                                            sx={{ mt: 2 }}
                                            onChange={(ev: any) => {
                                                field.onChange(ev?.format('DD/MM/YYYY'))
                                            }}
                                            slotProps={{
                                                textField: {
                                                    inputRef: ref,
                                                    label: 'Finalización del Pasantia',
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <BotonFilled type="submit" sx={{ float: 'right' }}>Modificar Pasantia</BotonFilled>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>

        </Dialog >
    );
}