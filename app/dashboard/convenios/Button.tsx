'use client';
import { Button } from "rsuite";
import { Icon } from '@iconify/react';
import { pdf } from "@react-pdf/renderer";
import dayjs from "dayjs";
import ConvenioPDF from "./PDF";
interface Props {
    Convenios: any;
    opcion: string;
}
export default function BotonDescargar({ Convenios, opcion }: Props) {
    return (
        <Button appearance='subtle'
            onClick={() => {
                pdf(<ConvenioPDF
                    Convenios={Convenios as any} // Reemplaza `any` con el tipo adecuado si lo conoces
                    modo={opcion} // Puedes reutilizar la lógica de `opcion` si es aplicable
                />).toBlob().then(res => {
                    const url = URL.createObjectURL(res);
                    const a = document.createElement('a');
                    a.download = "listado-convenios-" + dayjs().format('DD-MM-YYYY_HH-mm-ss') + ".pdf"; // Ajusta el nombre del archivo
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