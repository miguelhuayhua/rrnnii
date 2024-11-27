'use client';
import { Button } from "rsuite";
import { Icon } from '@iconify/react';
import { pdf } from "@react-pdf/renderer";
import dayjs from "dayjs";
import PasantiasPDF from "./PDF";
interface Props {
    Pasantias: any;
    opcion: string;
}
export default function BotonDescargar({ Pasantias, opcion }: Props) {
    return (
        <Button appearance='subtle'
            onClick={() => {
                pdf(<PasantiasPDF
                    Pasantias={Pasantias as any} // Reemplaza `any` con el tipo adecuado si lo conoces
                    modo={opcion}
                />).toBlob().then(res => {
                    const url = URL.createObjectURL(res);
                    const a = document.createElement('a');
                    a.download = "listado-pasantias-" + dayjs().format('DD-MM-YYYY_HH-mm-ss') + ".pdf"; // Ajusta el nombre del archivo
                    a.href = url;
                    a.click();
                    a.remove();
                });
            }}
        >
            <Icon icon='fa-regular:file-pdf' fontSize={22} />
        </Button>
    )
}