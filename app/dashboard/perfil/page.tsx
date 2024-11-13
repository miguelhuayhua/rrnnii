'use client';
import {
    Box, Breadcrumbs, Grid, IconButton,
    CircularProgress, Backdrop
} from "@mui/material";
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
import Link from "next/link";
import { Button, Form, Input, InputGroup, Panel } from "rsuite";
import { red } from "@mui/material/colors";
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

    const [personaId, setPersonaId] = useState<any>(null);
    const { control, watch, formState: { isDirty }, setError, clearErrors, handleSubmit,
        resetField } = useForm<Usuario & { password2: string }>({
            defaultValues: {
                personaId,
                usuario: '',
                password: '',
                avatar: '',
                password2: ''
            }, shouldFocusError: true
        });
    const { openModal } = useModal();
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const router = useRouter();
    useEffect(() => {
        if (data) {
            axios.post('/api/persona/xusuario', { usuario: data.user.name }).then(res => {
                setPersona(res.data)
            })
            resetField('usuario', { defaultValue: data.user.name!, keepDirty: false })
            resetField('avatar', { defaultValue: data.user.image!, keepDirty: false })
        }
    }, [data]);
    return (
        <Box px={{ xs: 1, md: 2, lg: 5 }} pb={2} >
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1000 })}
                open={load}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Breadcrumbs sx={{ m: 2 }} >
                <Link style={{ textDecoration: 'none' }} href="/dashboard">
                    <Normal>Principal</Normal>
                </Link>
                <Negrita>Perfil</Negrita>
            </Breadcrumbs>
            <Button
                appearance="subtle"
                startIcon={<MdArrowLeft fontSize={20} />}
                onClick={() => router.back()}>
                Regresar
            </Button>
            <Titulo sx={{ mt: 1 }}>
                Perfil de usuario
            </Titulo>
            <Grid container mt={1} spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Panel shaded style={{ background: 'white' }}>
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
                                objectFit="cover"
                                src={data?.user.image ? (fileDomain + data?.user.image) : '/default-image.jpg'} />
                        </Box>
                        <Button
                            block
                            onClick={openFilePicker}
                            size='md'
                            style={{ margin: '20px 0', fontSize: 13 }}
                            appearance='ghost'>
                            Cambiar avatar
                        </Button>

                        <Controller
                            name="usuario"
                            control={control}
                            rules={{
                                required: 'No puede quedar vacío',
                                onBlur: async () => {
                                    let res = await axios.post('/api/usuario/existe', { usuario: watch('usuario') });
                                    res.data.existe ? setError('usuario', { message: 'Usuario en uso' }) : clearErrors('usuario');
                                }
                            }} render={({ field, fieldState }) => (
                                <Form.Group style={{ marginBottom: 10 }}>
                                    <Form.ControlLabel>Usuario</Form.ControlLabel>
                                    <Input {...field} size='lg' />
                                    <Form.ErrorMessage show={!!fieldState.error} placement="bottomStart">
                                        {fieldState.error?.message}
                                    </Form.ErrorMessage>
                                </Form.Group>
                            )}
                        />
                        <Controller
                            control={control}
                            name="password"
                            render={({ field }) => (
                                <Form.Group style={{ marginBottom: 10 }}>
                                    <Form.ControlLabel>Contraseña</Form.ControlLabel>
                                    <InputGroup inside >
                                        <Input
                                            size='lg' {...field} type={showPassword ? 'text' : 'password'} />
                                        <InputGroup.Button
                                            style={{ height: "100%" }} onClick={() => {
                                                setShowPassword(!showPassword);
                                            }}>
                                            {showPassword ? <MdVisibilityOff fontSize={25} /> : <MdVisibility fontSize={23} />}
                                        </InputGroup.Button>
                                    </InputGroup>
                                </Form.Group>
                            )}
                        />
                        <Controller
                            name="password2"
                            control={control}
                            rules={{ validate: value => value === (watch('password') || '') || 'Las contraseñas no coinciden' }}
                            render={({ field, fieldState }) => (
                                <Form.Group style={{ marginBottom: 10 }}>
                                    <Form.ControlLabel>Verificar contraseña</Form.ControlLabel>
                                    <Form.ErrorMessage show={!!fieldState.error} placement="bottomStart">
                                        {fieldState.error?.message}
                                    </Form.ErrorMessage>
                                    <InputGroup inside >
                                        <Input
                                            size='lg' {...field} type={showPassword2 ? 'text' : 'password'} />
                                        <InputGroup.Button
                                            style={{ height: "100%" }} onClick={() => {
                                                setShowPassword2(!showPassword2);
                                            }}>
                                            {showPassword ? <MdVisibilityOff fontSize={25} /> : <MdVisibility fontSize={23} />}
                                        </InputGroup.Button>
                                    </InputGroup>
                                </Form.Group>
                            )}
                        />

                        {
                            isDirty ?
                                <Button
                                    size='lg'
                                    block
                                    appearance='primary'
                                    style={{ background: red[700], marginTop: 20 }}
                                    onClick={handleSubmit((Usuario) => {
                                        openModal({
                                            async callback() {
                                                setLoad(true);
                                                let res = await axios.post('/api/usuario/modificar', {
                                                    usuario: Usuario.usuario,
                                                    password: Usuario.password,
                                                    usuario2: data?.user.name
                                                });
                                                setPersonaId(null);
                                                update({ ...res.data.usuario });
                                                setLoad(false);
                                                return res.data.mensaje;
                                            },
                                            content: 'El usuario será modificado',
                                            titulo: '¿Continuar?'
                                        })
                                    })} >
                                    Guardar cambios
                                </Button> : null
                        }
                    </Panel>
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