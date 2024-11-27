'use client';
import { Button } from "rsuite";
import { Icon } from '@iconify/react';
import { pdf } from "@react-pdf/renderer";
import dayjs from "dayjs";
import InstitucionesPDF from "./PDF";
interface Props {
    Instituciones: any;
    opcion: string;
}
export default function BotonDescargar({ Instituciones, opcion }: Props) {
    return (
        <Button appearance='subtle'
            onClick={() => {
                pdf(<InstitucionesPDF modo={opcion} instituciones={Instituciones} />)
                    .toBlob()
                    .then((res) => {
                        const url = URL.createObjectURL(res);
                        const a = document.createElement('a');
                        a.download = `listado-instituciones-${dayjs().format('DD-MM-YYYY_HH-mm-ss')}.pdf`;
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