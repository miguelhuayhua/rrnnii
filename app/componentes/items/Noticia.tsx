'use client';
import { Avatar, Box, Stack, } from "@mui/material";
import Image from 'next/legacy/image';
import { BoxSombra } from "../Mostrar";
import { Negrita, Normal } from "../Textos";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { Noticia } from "@prisma/client";
import dayjs from "dayjs";
import parser from 'html-react-parser';
import 'dayjs/locale/es';
import { fileDomain } from "@/utils/globals";
import { HiMinus, HiPlus } from "react-icons/hi2";
import { FaRotate } from "react-icons/fa6";
dayjs.locale('es');
interface Props {
    value: Noticia;
}

const NoticiaItem = ({ value }: Props) => {

    return (
        <BoxSombra sx={{
            borderRadius: 4, py: 2, border: '1px solid #eee',
            display: 'flex',
        }}>

            <Box position='relative' p={2}>

                <Normal sx={{ py: 2, fontSize: 12 }}>
                    {dayjs(value.createdAt).format('DD MMMM YYYY')}
                </Normal>
                <Negrita sx={{ py: 1, fontSize: 16 }}>
                    {value.titulo}
                </Negrita>
                <Box sx={{ fontSize: 15 }}>
                    {parser(value.descripcion)}
                </Box>
            </Box>
            <Zoom>
                <Image style={{ zIndex: 20 }} src={fileDomain + value.imagen}
                    width={100} height={100}
                    layout="fixed" objectFit="cover" />
            </Zoom>
        </BoxSombra>
    )
}
export default NoticiaItem;