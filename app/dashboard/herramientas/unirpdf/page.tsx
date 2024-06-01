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
            <Titulo sx={{ my: 2, textAlign: 'center' }} >Unir archivos PDF </Titulo>
            <Normal sx={{ mb: 4, textAlign: 'center', fontSize: 20 }}>Combina PDFs en el orden que quieras</Normal>
            <BotonFilled sx={{
                fontSize: 25,
                my: 6,
                display: 'flex',
                mx: 'auto'
            }}
                startIcon={<MdOutlineAttachFile />}
                onClick={() => PDFPicker.openFilePicker()}
            >
                Seleccionar Archivos
            </BotonFilled>
            <SortableList className="list" draggedItemClassName="dragged" onSortEnd={onSortEnd}>
                {
                    files.map((value, index) => {
                        return (
                            <SortableItem key={index} >
                                <BoxSombra className="item" sx={{ width: 170, mx: 'auto' }} p={1} m={1} bgcolor='white' position='relative'>
                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <FaRegFilePdf style={{ fontSize: 55, margin: '30px 0' }} color='#e5322d' />
                                    </Box>
                                    <BotonOutline
                                        sx={{ position: 'absolute', p: 0.65, right: 5, top: 5 }}
                                        onClick={() => { setFiles(files.filter(v => v != value)) }}
                                    >
                                        <IoClose fontSize={20} />
                                    </BotonOutline>
                                    <Normal sx={{ textAlign: 'center' }}>
                                        {value.name}
                                    </Normal>
                                    <Normal sx={{ textAlign: 'center', mt: 2, fontWeight: 700 }}>
                                        {Math.floor(value.size / 1024)} Kb.
                                    </Normal>
                                </BoxSombra>
                            </SortableItem>
                        )
                    })
                }
            </SortableList>

            {
                files.length > 0 ?
                    <BotonOutline
                        sx={{ mx: 'auto', display: 'flex', fontSize: 18, mt: 5 }}
                        onClick={async () => {
                            // Converting File Object Array To PDF Document Array
                            const render = async () => {
                                const merger = new PDFMerger();
                                for (const file of files) {
                                    await merger.add(file);
                                }
                                await merger.setMetadata({
                                    producer: "pdf-merger-js based script"
                                });

                                const mergedPdf = await merger.saveAsBlob();
                                const url = URL.createObjectURL(mergedPdf);
                                let a = document.createElement('a');
                                a.href = url;
                                a.download = url;
                                
                                a.click();
                                a.remove();
                            };
                            render().catch((err) => {
                                throw err;
                            });

                        }}>
                        Unir PDFS
                    </BotonOutline>
                    : null
            }
        </Box>
    )
}