'use client';
import { Avatar, Box } from "@mui/material";
import { FaBuilding } from "react-icons/fa6";
import { Normal, Titulo } from "@/app/componentes/Textos";
import { Convenio, Institucion } from "@prisma/client";
import { ChipBox } from "@/app/componentes/Mostrar";
import dayjs from "dayjs";
interface Props {
    Convenio: Convenio & { Institucion: Institucion };
}
const ConvenioComponent = ({ Convenio }: Props) => {

    return (
        <Box p={3} bgcolor='white' borderRadius={4} pb={6}>
            <Titulo sx={{ fontSize: 15, fontWeight: 600 }}>
                {Convenio.titulo}
            </Titulo>
            <Normal sx={{ mt: 1, color: '#929fac', fontSize: 12 }}>
                Termina el: {Convenio.finalizacion}
            </Normal>
            <Normal sx={{ color: '#929fac', fontSize: 12 }}>
                Publicado el: {dayjs(Convenio.createdAt).format('DD/MM/YYYY - HH:mm:ss')}
            </Normal>
            <Normal sx={{ fontWeight: 600, fontSize: 12, my: 2 }}>
                <FaBuilding /> {Convenio.Institucion.nombre}
            </Normal>
            <ChipBox sx={{ bgcolor: Convenio.tipo == 'nacional' ? '#0074b7' : '#09b615', color: 'white', mx: 0 }} label={Convenio.tipo == 'nacional' ? 'Convenio nacional' : 'Convenio internacional'} />
        </Box>
    )
}
export default ConvenioComponent;