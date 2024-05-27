'use client';
import { Avatar, Box } from "@mui/material";
import Link from "next/link";
import { FaBuilding } from "react-icons/fa6";
import { GiConversation } from "react-icons/gi";
import { Normal, Titulo } from "@/app/componentes/Textos";
import { Convenio } from "@prisma/client";
interface Props {
    Convenio: Convenio;
}
const ConvenioComponent = ({ Convenio }: Props) => {

    return (
        <Box p={3} bgcolor='white' borderRadius={4} pb={6}>
            <Avatar sx={{ bgcolor: '#0074b7', borderRadius: 2, float: 'right' }}>
                CN
            </Avatar>
            <Titulo sx={{ fontSize: 15, fontWeight: 600 }}>
                {Convenio.titulo}
            </Titulo>
            <Normal sx={{ mt: 1, color: '#929fac', fontSize: 12 }}>
                Termina el: 11 May 2024
            </Normal>
            <Normal sx={{ color: '#929fac', fontSize: 12 }}>
                Publicado el: 13 Ago 2024
            </Normal>

            <Normal sx={{ fontWeight: 600, fontSize: 12 }}>
                <FaBuilding /> {Convenio.institucion}
            </Normal>
            <Normal sx={{ fontWeight: 600, fontSize: 12 }}>
                <GiConversation /> {Convenio.tipo == 'nacional' ? 'Convenio nacional' : 'Convenio internacional'}
            </Normal>

        </Box>
    )
}
export default ConvenioComponent;