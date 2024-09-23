"use client";
import { BotonFilled, BotonSimple } from "@/app/componentes/Botones";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Grid } from "@mui/material";
import { BoxSombra } from "../componentes/Mostrar";
import { useRouter } from "next/navigation";
import { MdAlternateEmail, MdArrowLeft } from "react-icons/md";
import { Unidad } from "@prisma/client";
import { GrLocation } from "react-icons/gr";
import { TbAlertSquareRounded, TbPdf, TbReload } from "react-icons/tb";
import { InputBox, SwitchBox } from "@/app/componentes/Datos";
import { Controller, useForm } from "react-hook-form";
import { FiSmartphone } from "react-icons/fi";
import axios from "axios";

import { useModal } from "@/providers/ModalProvider";
export default function Page() {
    const { control,
        handleSubmit,
        formState: { isDirty } }
        = useForm<Unidad>({
            defaultValues: {
                contacto: '',
                email: '',
                ubicacion: ''
            }
        })
    const router = useRouter();
    const { openModal } = useModal();
    return (
        <Box px={{ xs: 1, md: 2, lg: 5 }}>
            {
                isDirty ?
                    <BoxSombra mb={2} p={1} display='flex'
                        alignItems='center'
                        justifyContent='space-between'>
                        <Normal sx={{
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <TbAlertSquareRounded style={{ marginRight: 5 }} fontSize={20} />
                            Cambios detectados
                        </Normal>
                        <BotonFilled
                            onClick={handleSubmit((data) => {
                                openModal({
                                    titulo: '¿Continuar?',
                                    content: 'La imagen será editada',
                                    callback: async () => {
                                        let res = await axios.post('/api/galeria/modificar', data);
                                        return res.data.mensaje;
                                    }
                                });
                            })}>
                            Guardar
                        </BotonFilled>
                    </BoxSombra>
                    : null
            }
            <Titulo mb={2}>
                Información de Unidad
            </Titulo>
            <BotonSimple
                startIcon={<MdArrowLeft fontSize={20} />}
                onClick={() => router.back()}>
                Regresar
            </BotonSimple>
            <Grid container spacing={2} pt={2}>
                <Grid item xs={12} sm={6} lg={4}>
                    <BoxSombra p={1.5}>
                        <FiSmartphone style={{ float: 'right' }} fontSize={20} color="#444" />
                        <Negrita sx={{ fontSize: 16 }}>
                            Contacto de referencia
                        </Negrita>
                        <Controller
                            control={control}
                            rules={{ required: 'Contacto es requerido' }}
                            name="contacto"
                            render={({ field, fieldState: { error } }) => {
                                return <InputBox
                                    size='small'
                                    error={!!error}
                                    helperText={error?.message}
                                    sx={{ mt: 1 }}
                                    {...field}
                                    placeholder="Introduzca el número de contacto"
                                />
                            }}
                        />
                    </BoxSombra>
                </Grid>
                <Grid item xs={12} sm={6} lg={4}>
                    <BoxSombra p={1.5}>
                        <MdAlternateEmail style={{ float: 'right' }} fontSize={20} color="#444" />
                        <Negrita sx={{ fontSize: 16 }}>
                            Correo de contacto
                        </Negrita>
                        <Controller
                            control={control}
                            name="email"
                            render={({ field }) => {
                                return <InputBox
                                    size='small'
                                    sx={{ mt: 1 }}
                                    {...field}
                                    placeholder="Introduzca correo de contacto"
                                />
                            }}
                        />
                    </BoxSombra>
                </Grid>
                <Grid item xs={12} sm={6} lg={4}>
                    <BoxSombra p={1.5}>
                        <GrLocation style={{ float: 'right' }} fontSize={20} color="#444" />
                        <Negrita sx={{ fontSize: 16 }}>
                            Ubicación de referencia
                        </Negrita>
                        <Controller
                            control={control}
                            name="ubicacion"
                            rules={{
                                required: 'Ubicación es requerida'
                            }}
                            render={({ field, fieldState: { error } }) => {
                                return <InputBox
                                    size='small'
                                    sx={{ mt: 1 }}
                                    error={!!error}
                                    helperText={error?.message}
                                    {...field}
                                    placeholder="Introduzca ubicación de referencia"
                                />
                            }}
                        />
                    </BoxSombra>
                </Grid>

            </Grid>


        </Box>
    )
}