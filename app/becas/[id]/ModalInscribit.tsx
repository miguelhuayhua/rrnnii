'use client';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { Box, Grid } from '@mui/material';
import { BotonFilled, BotonSimple } from '@/app/componentes/Botones';
import { Negrita, Titulo } from '@/app/componentes/Textos';
import { Controller, useForm } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
import { useFilePicker } from 'use-file-picker';
import CircularProgress from '@mui/material/CircularProgress'; import { DatePickerBox, InputBox } from '@/app/componentes/Datos';
import { MdOutlineAttachFile } from 'react-icons/md';
import { useModal } from '@/providers/ModalProvider';
import { ParticipanteBeca } from '@prisma/client';
import axios from 'axios';
import { parsePhone } from '@/utils/data';
import { blue, grey, red } from '@mui/material/colors';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { TbReload } from 'react-icons/tb';
import { makeid } from '@/utils/globals';
interface Props {
    open: boolean;
    setOpen: any;
    becaId: string;
}
export default function ModalInscribir({ becaId, open, setOpen }: Props) {
    const { control, formState: { isDirty }, handleSubmit, setValue, watch } = useForm<ParticipanteBeca & {
        captcha: string,
        confirmCaptcha: string
    }>({
        defaultValues: { captcha: makeid(7) }, shouldFocusError: true
    });
    const { openModal } = useModal();

    const [loadCI, setLoadCI] = useState(false);
    const [loadRU, setLoadRU] = useState(false);
    const CIPicker = useFilePicker({
        readAs: 'DataURL',
        accept: '.pdf, .doc, .docx, .jpg, .png',
        multiple: false,
        onFilesSuccessfullySelected: ({ plainFiles }) => {
            setLoadCI(true);
            setCi(plainFiles[0]);
            setValue('cipath', plainFiles[0].name, { shouldDirty: true });
            openSnackbar('Carnet de identidad cargado con éxito');
            setLoadCI(false);
        }
    });
    const RUPicker = useFilePicker({
        readAs: 'DataURL',
        accept: '.pdf, .doc, .docx, .jpg, .png',
        multiple: false,
        onFilesSuccessfullySelected: ({ plainFiles }) => {
            setLoadRU(true);
            setRu(plainFiles[0]);
            setValue('rupath', plainFiles[0].name, { shouldDirty: true });
            openSnackbar('Registro universitario cargado con éxito');
            setLoadRU(false);
        }
    });
    const { openSnackbar } = useSnackbar();
    const [ci, setCi] = useState<any>(null);
    const [ru, setRu] = useState<any>(null);
    const onSubmit = (participante: ParticipanteBeca) => {
        if (ci && ru) {
            let form = new FormData();
            form.append('nombre_completo', participante.nombre_completo);
            form.append('ru', participante.ru);
            form.append('ci', participante.ci);
            form.append('contacto', participante.contacto);
            form.append('archivoru', ru);
            form.append('archivoci', ci);
            form.append('becaId', becaId)
            openModal({
                titulo: '¿Continuar?',
                content: 'Tu postulación será enviada y serás contactado',
                callback: async () => {
                    let res = await axios.post('/api/beca/participante/crear', form);
                    if (!res.data.error) {
                        setOpen(false);
                    }
                    return res.data.mensaje;
                }
            });
        }
        else {
            openSnackbar('Por favor, ingrese los archivos de respaldo')
        }
    }
    return (
        <Dialog
            open={open}
            keepMounted={false}
            fullScreen
            onClose={() => { setOpen(false) }}
        >
            <DialogContent sx={{ position: 'relative', p: 2 }}>
                <BotonSimple onClick={() => setOpen(false)}
                    sx={{ position: 'absolute', top: 5, right: 5 }}>
                    <IoClose fontSize={25} />
                </BotonSimple>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Titulo sx={{ textAlign: 'center' }}>
                            Registro de postulante
                        </Titulo>
                    </Grid>
                    <Grid item xs={12}>
                        <Titulo sx={{ fontSize: 20, pr: 4 }}>
                            Datos del postulante
                        </Titulo>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <Controller control={control}
                            name='nombre_completo'
                            rules={{ required: 'Inserte su nombre completo' }}
                            render={
                                ({ field, fieldState }) =>
                                    <InputBox
                                        error={!!fieldState.error}
                                        label='Nombre Completo'
                                        {...field}
                                        helperText={fieldState.error?.message}
                                    />
                            }
                        />

                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <Controller control={control}
                            name='ru'
                            rules={{ required: 'Inserte su registro universitario' }}
                            render={
                                ({ field, fieldState }) =>
                                    <InputBox
                                        label='Registro universitario'
                                        {...field}
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                    />
                            }
                        />

                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <Controller control={control}
                            rules={{ required: 'Inserte su carnet de identidad' }}
                            name='ci'
                            render={
                                ({ field, fieldState }) =>
                                    <InputBox
                                        label='Carnet de identidad'
                                        {...field}
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                    />
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <Controller control={control}
                            name='contacto'
                            rules={{ required: 'Número de contacto es requerido' }}
                            render={
                                ({ field, fieldState }) =>
                                    <InputBox
                                        label='Número de contacto'
                                        {...field}
                                        onChange={ev => {
                                            field.onChange(parsePhone(ev.target.value))
                                        }}
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                    />
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Titulo sx={{ fontSize: 20 }}>
                            Archivos de respaldo
                        </Titulo>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Box sx={{
                            p: 2,
                            border: `1px solid ${grey[300]}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderRadius: 3,
                            color: grey[800],
                            position: 'relative',
                            transition: 'border .5s',
                            "&:hover": {
                                border: `1px solid ${red[300]}`
                            }
                        }}
                            onClick={() => CIPicker.openFilePicker()}
                        >
                            <Negrita sx={{
                                color: 'inherit'
                            }}>
                                {
                                    ci ? ci.name :
                                        'Suba su carnet de identidad'

                                }
                            </Negrita>

                            {
                                loadCI ? <CircularProgress size="30px" /> :
                                    <MdOutlineAttachFile style={{ fontSize: 20 }} />
                            }


                        </Box>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Box sx={{
                            mt: { xs: 2, lg: 0 },
                            p: 2,
                            border: `1px solid ${grey[300]}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderRadius: 3,
                            color: grey[800],
                            position: 'relative',
                            transition: 'border .5s',
                            "&:hover": {
                                border: `1px solid ${red[300]}`
                            }
                        }}
                            onClick={() => RUPicker.openFilePicker()}
                        >
                            <Negrita sx={{ color: 'inherit' }}>
                                {
                                    ru ? ru.name :
                                        'Suba su registro universitario'
                                }
                            </Negrita>
                            {
                                loadRU ?
                                    <CircularProgress size="30px" /> :
                                    <MdOutlineAttachFile style={{ fontSize: 20 }} />
                            }
                        </Box>

                    </Grid>
                    <Grid item xs={8} sm={6} lg={3} mx='auto'>
                        <Controller
                            rules={{ required: 'No puede quedar vacio' }}
                            control={control}
                            name="captcha"
                            render={({ field }) => (
                                <InputBox
                                    label='Captcha'
                                    disabled
                                    sx={{ userSelect: 'none', mt: 1 }}
                                    {...field}
                                    InputProps={{
                                        endAdornment: <BotonFilled
                                            onClick={() => {
                                                setValue('captcha', makeid(7))
                                            }}
                                            sx={{
                                                bgcolor: blue[500],
                                                minWidth: 0,
                                                height: 35, width: 40,
                                            }}>
                                            <TbReload fontSize={24} /></BotonFilled>
                                    }}
                                />
                            )}
                        />
                        <Controller
                            rules={{
                                required: 'No puede quedar vacio',
                                validate: value => value === watch('captcha') || 'El valor del captcha no coincide, inténtelo de nuevo'

                            }}
                            control={control}
                            name="confirmCaptcha"
                            render={({ field, fieldState }) => (
                                <InputBox
                                    label='Confirme el captcha'
                                    error={!!fieldState.error}
                                    {...field}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />
                        {
                            isDirty ?
                                <BotonFilled onClick={handleSubmit(onSubmit)} fullWidth>
                                    Solicitar mi postulación
                                </BotonFilled>
                                : null
                        }
                    </Grid>
                </Grid>
            </DialogContent>

        </Dialog >
    );
}