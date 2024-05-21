'use client';
import { Box, Divider, IconButton } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import React from 'react';
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { Titulo } from "../componentes/Textos";
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
    const CredencialesForm = useForm<{ usuario: string }>({
        defaultValues: { usuario: '' }
    });
    const PasswordForm = useForm<{ password: string }>({
        defaultValues: { password: '' }
    });
    //controlador de visualización de password
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const recaptcha = useRef<any>();


    const onSubmit2 = ({ password }: { password: string }) => {
        setLoading(true);
        signIn('credentials', {
            redirect: false,
            callbackUrl: '/dashboard/tienda/principal',
            usuario: CredencialesForm.getValues('usuario'),
            password
        }).then(response => {
            if (response?.status == 401) {
                setMensaje('Contraseña inválida');
                setLoading(false);
            }
            else if (response?.status == 200 && response.url) {
                router.push(response.url);
            }
        })
    }

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
                <Divider >
                    <Titulo>
                        Ingresa tus credenciales
                    </Titulo>
                </Divider>
                <Box
                    display={showTransition == '' ? 'block' : 'none'}
                    component={'form'}
                    py={2}
                >
                    <Controller
                        rules={{ required: 'No puede quedar vacio' }}
                        control={CredencialesForm.control}
                        name="usuario"
                        render={({ field }) => (
                            <Box pt={2}>

                            </Box>
                        )}
                    />
                    <Box
                        display={'flex'}
                        justifyContent={'center'}
                        mb={1}
                    >

                    </Box>

                </Box>

                {/*APARTADO PARA EL PROCESO DE ACCESO PASSWORD*/}
                <Box
                    display={showTransition == 'password' ? 'block' : 'none'}
                    component={'form'}
                    onSubmit={PasswordForm.handleSubmit(onSubmit2)}
                    py={4}
                >

                </Box>
                <Box
                    position={'absolute'}
                    className={showTransition == 'register' ? 'show' : 'hidde'}
                    top={40}
                    width={"92%"}
                    component={'form'}
                    onSubmit={PasswordForm.handleSubmit(onSubmit2)}
                >

                </Box>
                {/* <Divider>
                    <H2>
                        O mediante
                    </H2>
                </Divider>
                <Button
                    sx={{
                        display: 'flex',
                        margin: '10px auto',
                        background: 'white',
                        color: 'black',
                        alignItems: 'center',
                        borderRadius: 5,
                        px: 3,
                        py: 1,
                        "&:hover": {
                            backgroundColor: '#f8f8f8'
                        }
                    }}
                    onClick={() => {
                        signIn('google',
                            {
                                callbackUrl: '/dashboard/tienda/principal',
                                redirect: true
                            });
                    }}
                    startIcon={
                        <Image alt="logo-google" src={"/assets/google.webp"} width={20} height={20}
                            layout="fixed" />}
                    variant="contained"
                >
                    ACCEDER CON GOOGLE
                </Button> */}
            </DialogContent>

        </Dialog >
    );
}