'use client';
import { Box, IconButton } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useState } from "react";
import { signIn } from "next-auth/react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import React from 'react';
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { Normal, Titulo } from "../componentes/Textos";
import { InputBox } from "../componentes/Datos";
import { BotonFilled } from "../componentes/Botones";
import { makeid } from "@/utils/globals";
import { TbReload } from "react-icons/tb";
import { blue, red } from "@mui/material/colors";
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="down" ref={ref} {...props} />;
});
interface Props {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    open: boolean;
}
export default function ModalLogin({ open, setOpen }: Props) {
    const router = useRouter();
    const [showTransition, setShowTransition] = useState<'password' | 'register' | ''>('');
    const [showPassword, setShowPassword] = React.useState(false);
    //controlador de eventos para el submit

    const credencialsForm = useForm<{
        password: string,
        usuario: string,
        captcha: string,
        confirmCaptcha: string
    }>({
        defaultValues: { password: '', usuario: '', captcha: makeid(7), confirmCaptcha: '' }
    });
    //controlador de visualización de password
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState('');
    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            maxWidth='sm'
            PaperProps={{ sx: { borderRadius: 2.5 } }}
            fullWidth
            onClose={() => {
                setShowTransition('');
                setOpen(false);
                setMensaje('');
            }}
        >
            <DialogContent sx={{ position: 'relative' }} >
                <Titulo sx={{ textAlign: 'center' }}>
                    Ingrese sus credenciales
                </Titulo>
                <Box
                    display={showTransition == '' ? 'block' : 'none'}
                    py={2}
                >
                    <Controller
                        rules={{ required: 'Usuario es requerido' }}
                        control={credencialsForm.control}
                        name="usuario"
                        render={({ field }) => (
                            <InputBox
                                label='Usuario'
                                disabled={loading}
                                error={!!credencialsForm.formState.errors.usuario}
                                {...field}
                                helperText={credencialsForm.formState.errors.usuario?.message}
                            >
                            </InputBox>
                        )}
                    />
                    <Controller
                        rules={{
                            required: 'La contraseña es requerida',
                        }}
                        control={credencialsForm.control}
                        name="password"
                        render={({ field, fieldState }) => (
                            <InputBox
                                label='Contraseña'
                                error={!!fieldState.error}
                                disabled={loading}
                                type={showPassword ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment:
                                        <IconButton
                                            sx={{ mr: 0 }}
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                                        </IconButton>
                                }}
                                helperText={fieldState.error?.message}
                                {...field}
                            />
                        )}
                    />
                    <Controller
                        rules={{ required: 'No puede quedar vacio' }}
                        control={credencialsForm.control}
                        name="captcha"
                        render={({ field }) => (
                            <InputBox
                                label='Captcha'
                                disabled
                                sx={{ userSelect: 'none' }}
                                {...field}
                                InputProps={{
                                    endAdornment: <BotonFilled
                                        onClick={() => {
                                            credencialsForm.setValue('captcha', makeid(7))
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
                            validate: value => value === credencialsForm.watch('captcha') || 'El valor del captcha no coincide, inténtelo de nuevo'

                        }}
                        control={credencialsForm.control}
                        name="confirmCaptcha"
                        render={({ field, fieldState }) => (
                            <InputBox
                                label='Confirme el captcha'
                                disabled={loading}
                                error={!!fieldState.error}
                                {...field}
                                helperText={fieldState.error?.message}
                            />
                        )}
                    />
                    {
                        mensaje ?
                            <Normal sx={{
                                fontSize: 13,
                                textAlign: 'center',
                                color: red[500]
                            }}>
                                {mensaje}
                            </Normal> : null
                    }
                    <BotonFilled
                        disabled={loading}
                        sx={{ display: 'block', mt: 2, mx: 'auto', px: 4 }} onClick={async () => {
                            if (await credencialsForm.trigger()) {
                                setLoading(true);
                                signIn('credentials', {
                                    redirect: false,
                                    callbackUrl: '/dashboard',
                                    password: credencialsForm.getValues('password'),
                                    usuario: credencialsForm.getValues('usuario')
                                }).then(response => {
                                    if (response?.status == 401) {
                                        setMensaje('Usuario o Contraseña inválida');
                                        setLoading(false);
                                    }
                                    else if (response?.status == 200 && response.url) {
                                        router.push(response.url);
                                    }
                                })
                            }
                        }}>
                        Ingresar
                    </BotonFilled>
                </Box>
            </DialogContent>

        </Dialog >
    );
}