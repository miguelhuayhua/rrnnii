'use client';
import { Button } from "rsuite";
import { Icon } from '@iconify/react';
import { pdf } from "@react-pdf/renderer";
import BecaPDF from "./Pdf";
import dayjs from "dayjs";
interface Props {
    Becas: any;
    opcion: string;
}
export default function BotonDescargar({ Becas, opcion }: Props) {
    return (
        <Button appearance='subtle'
            onClick={() => {
                pdf(<BecaPDF
                    Becas={Becas as any}
                    modo={opcion}
                />).toBlob().then(res => {
                    let url = URL.createObjectURL(res);
                    let a = document.createElement('a');
                    a.download = "listado-becas" + dayjs().format('DD/MM/YYYY - HH:mm:ss');
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