'use client';
import { Avatar, Box } from "@mui/material";
import Link from "next/link";
import Image from 'next/legacy/image';
import { ChipBox } from "../Mostrar";
import { Negrita, Normal } from "../Textos";
import { Beca, Institucion, ParticipanteBeca } from "@prisma/client";
import dayjs from "dayjs";
interface Props { value: Beca & { Participantes: ParticipanteBeca[], Institucion: Institucion } }
import 'dayjs/locale/es';
import { Icon as Iconify } from '@iconify/react';
import { fileDomain } from "@/utils/globals";
import { IoMdCalendar, IoMdPeople } from "react-icons/io";
import plugin from 'dayjs/plugin/customParseFormat';
import { BiBuilding } from "react-icons/bi";
import { MdPhone } from "react-icons/md";
dayjs.extend(plugin);
dayjs.locale('es');
const BecaItem = ({ value }: Props) => {
    return (
        <Box bgcolor='white !important' sx={{ overflow: 'hidden', borderRadius: 4, boxShadow: 'rgba(145, 158, 171, 0.16) 0px 1px 2px 0px', }}>
            <Box position='relative'>
                <Normal sx={{
                    display: 'flex',
                    color: '#ddd',
                    alignItems: 'center',
                    zIndex: 10,
                    position: 'absolute', right: 15, top: 15
                }}>
                    <Iconify fontSize={30} style={{ marginRight: 5, borderRadius: 10 }} icon={`flag:${value.tipo == 'nacional' ? 'bo' : value.pais.toLowerCase()}-4x3`} />
                    {value.tipo == 'nacional' ? 'BO' : value.pais}
                </Normal>
                <Box alignItems='center' zIndex={10} display='flex' position='absolute' left={10} bottom={20}>
                    <Avatar
                        src={value.Institucion.logo ? fileDomain + value.Institucion.logo : ''}
                        sx={{ background: 'white', height: 70, width: 70 }}>
                        <BiBuilding color="#666" fontSize={27} />
                    </Avatar>
                    <Box ml={2}>
                        <Negrita sx={{ fontSize: 18, color: 'white' }}>
                            {value.Institucion.nombre}
                        </Negrita>

                        <Normal sx={{ color: '#bbb', display: 'flex', alignItems: 'center' }}>
                            <MdPhone style={{ marginRight: 5 }} />
                            {value.Institucion.contacto || 'Sin número'}
                        </Normal>
                    </Box>
                </Box>
                <Link href={`/becas/${value.id}`}>
                    <Image style={{ filter: 'brightness(0.4)' }} layout='responsive'
                        objectFit="cover" width={100} height={70}
                        src={fileDomain + value.imagen} alt={`Imagen de: ${value.titulo}`} />
                </Link>
            </Box>
            <Box p={2} position='relative'>
                <Normal sx={{ color: '#bbb' }}>
                    {dayjs(value.createdAt).format('DD MMMM YYYY')}
                </Normal>
                <Link href={`/becas/${value.id}`} style={{ textDecoration: 'none' }}>
                    <Negrita py={1}>
                        {value.titulo}
                    </Negrita>
                </Link>
                <Normal sx={{ display: 'flex', alignItems: 'center', color: '#777', mt: 1 }}>
                    <IoMdCalendar style={{ marginRight: 5, fontSize: 22 }} />
                    {dayjs(value.termina, 'DD/MM/YYYY').format('[Finaliza el] DD [de] MMMM [del] YYYY')}
                </Normal>
                <ChipBox
                    icon={<IoMdPeople />}
                    sx={{ mt: 2 }}
                    label={`${value.Participantes.length} participantes`} />
            </Box>
        </Box >
    )
}
export default BecaItem;