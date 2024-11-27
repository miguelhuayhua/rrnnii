
'use client';
import { Button } from "rsuite";
import { Icon } from '@iconify/react';
import { pdf } from "@react-pdf/renderer";
import dayjs from "dayjs";
import VideosPDF from "./PDF";
interface Props {
    Videos: any;
    opcion: string;
}
export default function BotonDescargar({ Videos, opcion }: Props) {
    return (

        <Button appearance='subtle'
            onClick={() => {
                pdf(<VideosPDF videos={Videos} modo="todo" />)
                    .toBlob()
                    .then((res) => {
                        const url = URL.createObjectURL(res);
                        const a = document.createElement('a');
                        a.download = `listado-videos-${dayjs().format('DD-MM-YYYY_HH-mm-ss')}.pdf`;
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