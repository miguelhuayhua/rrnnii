'use client';
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import arrayMove from 'array-move';
import { axiosInstance } from "@/globals";
import { useFilePicker } from "use-file-picker";
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