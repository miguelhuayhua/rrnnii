'use client';
import { BotonFilled, BotonOutline } from "@/app/componentes/Botones";
import { Normal, Titulo } from "@/app/componentes/Textos";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import PDFMerger from 'pdf-merger-js/browser';
import SortableList, { SortableItem } from 'react-easy-sort';
import arrayMove from 'array-move';
import { MdOutlineAttachFile } from "react-icons/md";
import { axiosInstance } from "@/globals";
import { useFilePicker } from "use-file-picker";
import { IoClose } from "react-icons/io5";
import { BoxSombra } from "@/app/componentes/Mostrar";
import { FaRegFilePdf } from "react-icons/fa";
export default function Main() {
    const [opcion, setOpcion] = useState('todo');
    const [Pasantias, setPasantias] = useState<any>([]);
    const [prevPasantias, setPrevPasantias] = useState<any>([]);
    const [Pasantia, setPasantia] = useState<any>(null);
    useEffect(() => {
        axiosInstance.post('/api/pasantia/todo', { opcion }).then(res => {
            setPasantias(res.data);
            setPrevPasantias(res.data);
        })
    }, [opcion, Pasantia]);
    const [files, setFiles] = useState<File[]>([]);
    const PDFPicker = useFilePicker({
        readAs: 'DataURL',
        accept: '.pdf, .doc, .docx',
        multiple: true,
        onFilesSuccessfullySelected: ({ plainFiles }) => {
            setFiles([...files, ...plainFiles]);
        }
    });
    const onSortEnd = (oldIndex: number, newIndex: number) => {
        setFiles(arrayMove(files, oldIndex, newIndex));
    };
    return (
        <Box px={{ xs: 1, md: 2, lg: 5 }} >
           
        </Box>
    )
}