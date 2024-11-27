'use client';
import { Button } from "rsuite";
import { Icon } from '@iconify/react';
import { pdf } from "@react-pdf/renderer";
import dayjs from "dayjs";
import NoticiasPDF from "./PDF";
interface Props {
    Noticias: any;
    opcion: string;
}
export default function BotonDescargar({ Noticias, opcion }: Props) {
    return (
        <Button
            appearance="subtle"
            onClick={() => {
                pdf(<NoticiasPDF modo={opcion} Noticias={Noticias} />)
                    .toBlob()
                    .then((res) => {
                        const url = URL.createObjectURL(res);
                        const a = document.createElement("a");
                        a.download = `listado-noticias-${dayjs().format("DD-MM-YYYY_HH-mm-ss")}.pdf`;
                        a.href = url;
                        a.click();
                        a.remove();
                    });
            }}
        >
            <Icon icon="fa-regular:file-pdf" fontSize={22} />
        </Button>
    )
}