'use client';
import { Box, Breadcrumbs, Grid, IconButton, LinearProgress, Link } from "@mui/material";
import { useEffect, useState } from "react";
import { BotonFilled, BotonOutline, BotonSimple } from "@/app/componentes/Botones";
import { MdArrowLeft, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useRouter } from "next/navigation";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { useFilePicker } from "use-file-picker";
import { BoxSombra } from "../componentes/Mostrar";
import Image from "next/legacy/image";
import axios from "axios";
import { InputBox } from "@/app/componentes/Datos";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { useSession } from "next-auth/react";
import { Persona, Usuario } from "@prisma/client";
import { useForm, Controller } from "react-hook-form";
import { useModal } from "@/providers/ModalProvider";
import dayjs from "dayjs";
import { fileDomain } from "@/utils/globals";
export default function Main() {
    const { openSnackbar } = useSnackbar();
    const [load, setLoad] = useState(false);
    const { data, update } = useSession();
    const { openFilePicker } = useFilePicker({
        multiple: false,
        accept: 'image/*',
        onFilesSuccessfullySelected({ plainFiles }: any) {
            const file = plainFiles[0];
            setLoad(true);
            const form = new FormData();
            form.append('file', file);
            form.append('usuario', data?.user.name!)
            axios.post('/api/usuario/avatar', form).then(res => {
                openSnackbar(res.data.mensaje);
                setLoad(false);
                if (!res.data.error) {
                    update({ ...res.data.usuario })
                }
            })
        }
    });

    const [persona, setPersona] = useState<Partial<Persona>>({
        nombre: '',
        paterno: '',
        materno: ''
    });

    const [personaCi, setPersonaCi] = useState<any>(null);
    const { control, watch, formState: { isDirty }, handleSubmit,
        resetField } = useForm<Usuario & { password2: string }>({
            defaultValues: {
                personaCi,
                usuario: '',
                password: '',
                avatar: ''
            }, shouldFocusError: true
        });
    const { openModal } = useModal();
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const router = useRouter();
    useEffect(() => {
        if (data) {
            console.log(data)
            axios.post('/api/persona/xusuario', { usuario: data.user.name }).then(res => {
                setPersona(res.data)
            })
            resetField('usuario', { defaultValue: data.user.name!, keepDirty: false })
            resetField('avatar', { defaultValue: data.user.image!, keepDirty: false })
        }
    }, [data]);
    return (
        <Box px={{ xs: 1, md: 2, lg: 5 }} pb={2} >
            {load ? <LinearProgress style={{ position: 'absolute', top: 0, left: 0, width: "100%" }} /> : null}
            <Breadcrumbs sx={{ mb: 2 }} >
                <Link style={{ textDecoration: 'none' }} href="/dashboard">
                    <Normal>Principal</Normal>
                </Link>
                <Negrita>Perfil</Negrita>
            </Breadcrumbs>
            <BotonSimple
                startIcon={<MdArrowLeft fontSize={20} />}
                onClick={() => router.back()}>
                Regresar
            </BotonSimple>
            <Titulo sx={{ mt: 1 }}>
                Perfil de usuario
            </Titulo>
            <Grid container mt={1} spacing={2}>
                <Grid item xs={12} sm={6}>
                    <BoxSombra p={2}>
                        <Box
                            borderRadius={100}
                            overflow='hidden'
                            width={100}
                            border='1px solid #ddd'
                            mb={1}
                            height={100}
                            position='relative'
                            mx='auto'>
                            <Image
                                layout="fill"
                                src={(fileDomain + data?.user.image) || '/default-image.jpg'} />
                        </Box>
                        <BotonOutline
                            onClick={openFilePicker}
                            size="small"
                            sx={{ fontSize: 13, mx: 'auto', display: 'block', mb: 2 }}>
                            Cambiar avatar
                        </BotonOutline>
                        <Controller
                            name="usuario"
                            control={control}
                            rules={{ required: 'Usuario es obligatorio' }}
                            render={({ field: { ref, ...field }, fieldState }) => (
                                <InputBox
                                    {...field}
                                    size="small"
                                    label='Usuario'
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    inputRef={ref}
                                />
                            )}
                        />
                        <Controller
                            name="password"
                            control={control}
                            render={({ field, fieldState }) => (
                                <InputBox
                                    {...field}
                                    label='Contraseña'
                                    size="small"
                                    type={showPassword ? 'text' : 'password'}
                                    InputProps={{
                                        endAdornment:
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                                            </IconButton>
                                    }}
                                    helperText={fieldState.error?.message}

                                />
                            )}
                        />
                        <Controller
                            name="password2"
                            control={control}
                            rules={{ validate: value => value === (watch('password') || '') || 'Las contraseñas no coinciden' }}
                            render={({ field, fieldState }) => (
                                <InputBox
                                    {...field}
                                    label='Verificar contraseña'
                                    size="small"
                                    type={showPassword2 ? 'text' : 'password'}
                                    InputProps={{
                                        endAdornment:
                                            <IconButton
                                                onClick={() => setShowPassword2(!showPassword2)}
                                                edge="end"
                                            >
                                                {showPassword2 ? <MdVisibilityOff /> : <MdVisibility />}
                                            </IconButton>
                                    }}
                                    helperText={fieldState.error?.message}
                                    error={!!fieldState.error}
                                />
                            )}
                        />

                        {
                            isDirty ?
                                <BotonFilled
                                    onClick={handleSubmit((Usuario) => {
                                        openModal({
                                            async callback() {
                                                let res = await axios.post('/api/usuario/modificar', {
                                                    usuario: Usuario.usuario,
                                                    password: Usuario.password,
                                                    usuario2: data?.user.name
                                                });
                                                setPersonaCi(null);
                                                update({ ...res.data.usuario })
                                                return res.data.mensaje;
                                            },
                                            content: 'El usuario será modificado',
                                            titulo: '¿Continuar?'
                                        })
                                    })} >
                                    Guardar cambios
                                </BotonFilled> : null
                        }
                    </BoxSombra>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Negrita sx={{ mb: 2, fontSize: 16 }}>
                        Información personal
                    </Negrita>
                    <Normal>
                        <b>Cédula de identidad: </b> {persona.ci}
                    </Normal>
                    <Normal>
                        <b>Nombre completo: </b> {`${persona.nombre} ${persona.paterno} ${persona.materno}`}
                    </Normal>
                    <Normal>
                        <b>Fecha de nacimiento: </b> {persona.f_nacimiento}
                    </Normal>
                    <Normal>
                        <b>Cargo en la unidad: </b> {persona.cargo}
                    </Normal>
                    <Normal sx={{ mt: 2 }}>
                        <i>
                            Registrado el {dayjs(persona.createdAt).format('DD/MM/YYYY - HH:mm:ss')}
                        </i>
                    </Normal>
                </Grid>
            </Grid >
        </Box >
    )
}