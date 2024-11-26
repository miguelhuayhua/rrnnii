"use client";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Grid } from "@mui/material";
import { MdAlternateEmail } from "react-icons/md";
import { Unidad } from "@prisma/client";
import { GrLocation } from "react-icons/gr";
import { Controller, useForm } from "react-hook-form";
import { FiSmartphone } from "react-icons/fi";
import { Icon } from '@iconify/react';
import axios from "axios";
import { useModal } from "@/providers/ModalProvider";
import Link from "next/link";
import { Button, Form, Input, InputNumber, Panel } from "rsuite";
import { red } from "@mui/material/colors";
export default function Page({ Unidad }: { Unidad: Unidad }) {
    const { control,
        handleSubmit,
        formState: { isDirty }, reset, getValues }
        = useForm<Unidad>({
            defaultValues: Unidad
        })
    const { openModal } = useModal();
    return (
        <Box px={{ xs: 1, md: 2, lg: 5 }} pb={2}>
            <Breadcrumbs sx={{ my: 2 }}>
                <Link style={{ textDecoration: 'none' }} href="/dashboard">
                    <Normal>Principal</Normal>
                </Link>
                <Negrita>Unidad</Negrita>
            </Breadcrumbs>

            <Titulo my={1}>
                Información de Unidad
            </Titulo>
            <Grid container spacing={4} pt={2}>
                <Grid item xs={12} sm={6} lg={4}>
                    <Panel shaded style={{ background: 'white' }}>
                        <FiSmartphone style={{ float: 'right' }} fontSize={20} color="#444" />
                        <Negrita sx={{ fontSize: 16 }}>
                            Contacto de referencia
                        </Negrita>

                        <Controller
                            name="contacto"
                            control={control}
                            rules={{
                                required: 'Contacto no puede quedar vacío',
                                maxLength: { message: 'Contacto no puede exceder de 8 dígitos', value: 8 }
                            }}
                            render={({ field, fieldState }) => (
                                <Form.Group style={{ marginBottom: 10, marginTop: 30 }}>
                                    <InputNumber placeholder="Introduzca el número de contacto" {...field} size='lg' />
                                    <Form.ErrorMessage show={!!fieldState.error} placement="bottomStart">
                                        {fieldState.error?.message}
                                    </Form.ErrorMessage>
                                </Form.Group>
                            )}
                        />
                    </Panel>
                </Grid>
                <Grid item xs={12} sm={6} lg={4}>
                    <Panel shaded style={{ background: 'white' }}>
                        <MdAlternateEmail style={{ float: 'right' }} fontSize={20} color="#444" />
                        <Negrita sx={{ fontSize: 16 }}>
                            Correo de contacto
                        </Negrita>
                        <Controller
                            name="email"
                            rules={{ required: 'Correo electrónico no puede quedar vacío' }}
                            control={control}
                            render={({ field }) => (
                                <Form.Group style={{ marginBottom: 10, marginTop: 30 }}>
                                    <Input
                                        placeholder='Introduzca un correo electrónico de contacto'
                                        {...field} type="email" value={field.value!} size='lg' />
                                </Form.Group>
                            )}
                        />
                    </Panel>
                </Grid>
                <Grid item xs={12} sm={6} lg={4}>
                    <Panel shaded style={{ background: 'white' }}>
                        <GrLocation style={{ float: 'right' }} fontSize={20} color="#444" />
                        <Negrita sx={{ fontSize: 16 }}>
                            Ubicación de referencia
                        </Negrita>
                        <Controller
                            name="ubicacion"
                            control={control}
                            render={({ field }) => (
                                <Form.Group style={{ marginBottom: 10, marginTop: 30 }}>
                                    <Input
                                        placeholder='Introduzca la ubicación de la unidad'
                                        {...field} type="email" value={field.value!} size='lg' />
                                </Form.Group>
                            )}
                        />
                    </Panel>
                </Grid>
                <Grid item xs={12} sm={6} lg={4}>
                    <Panel shaded style={{ background: 'white' }}>
                        <Icon icon='qlementine-icons:facebook-16' style={{ float: 'right' }} fontSize={22} />
                        <Negrita sx={{ fontSize: 16 }}>
                            Facebook
                        </Negrita>
                        <Controller
                            name="facebook"
                            control={control}
                            render={({ field }) => (
                                <Form.Group style={{ marginBottom: 10, marginTop: 30 }}>

                                    <Input
                                        placeholder='Introduzca enlace de la página'
                                        {...field} type="email" value={field.value!} size='lg' />
                                </Form.Group>
                            )}
                        />
                    </Panel>
                </Grid>
                <Grid item xs={12} sm={6} lg={4}>
                    <Panel shaded style={{ background: 'white' }}>
                        <Icon icon='pajamas:twitter' style={{ float: 'right' }} fontSize={19} />
                        <Negrita sx={{ fontSize: 16 }}>
                            X
                        </Negrita>
                        <Controller
                            name="x"
                            control={control}
                            render={({ field }) => (
                                <Form.Group style={{ marginBottom: 10, marginTop: 30 }}>
                                    <Input
                                        placeholder='Introduzca enlace de página'
                                        {...field} type="email" value={field.value!} size='lg' />
                                </Form.Group>
                            )}
                        />
                    </Panel>
                </Grid>
                <Grid item xs={12} sm={6} lg={4}>
                    <Panel shaded style={{ background: 'white' }}>
                        <Icon icon='uil:instagram' style={{ float: 'right' }} fontSize={22} />
                        <Negrita sx={{ fontSize: 16 }}>
                            Instagram
                        </Negrita>
                        <Controller
                            name="instagram"
                            control={control}
                            render={({ field }) => (
                                <Form.Group style={{ marginBottom: 10, marginTop: 30 }}>
                                    <Input {...field} value={field.value!} size='lg' placeholder="Introduzca enlace de página" />
                                </Form.Group>
                            )}
                        />
                    </Panel>
                </Grid>
                <Grid item xs={12} sm={6} lg={4} mx='auto'>
                    <Panel shaded style={{ background: 'white' }}>
                        <Icon icon='qlementine-icons:youtube-16' style={{ float: 'right' }} fontSize={22} />
                        <Negrita sx={{ fontSize: 16 }}>
                            YouTube
                        </Negrita>
                        <Controller
                            name="youtube"
                            control={control}
                            render={({ field }) => (
                                <Form.Group style={{ marginBottom: 10, marginTop: 30 }}>
                                    <Input
                                        placeholder='Introduzca enlace del canal'
                                        {...field} type="email" value={field.value!} size='lg' />
                                </Form.Group>
                            )}
                        />
                    </Panel>
                </Grid>


            </Grid>
            {
                isDirty ?
                    <Button size='lg' appearance="primary"
                        style={{
                            background: red[700],
                            marginTop: 20,
                            margin: '30px auto',
                            minWidth: 200,
                            display: 'block'
                        }}
                        onClick={handleSubmit((data) => {
                            openModal({
                                titulo: '¿Continuar?',
                                content: 'La información de la unidad será modificada',
                                callback: async () => {
                                    let res = await axios.post('/api/unidad/modificar', data);
                                    reset({ ...getValues() }, { keepDirty: false })
                                    return res.data.mensaje;
                                }
                            });
                        })}>
                        Guardar
                    </Button>
                    : null
            }
        </Box>
    )
}