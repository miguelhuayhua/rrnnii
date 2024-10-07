'use client';
import * as React from 'react';
import Table from '@mui/material/Table';
import { TbDotsVertical } from "react-icons/tb";
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Box, ClickAwayListener, Tooltip, Typography } from '@mui/material';
import { BiSearch } from 'react-icons/bi';
import Image from 'next/legacy/image';
import { BsCursorFill } from "react-icons/bs"; import { useRouter } from 'next/navigation';
import { Normal } from '@/app/componentes/Textos';
import { ChipBox } from '@/app/componentes/Mostrar';
import { InputBox } from '@/app/componentes/Datos';
import { BotonOutline, BotonSimple } from '@/app/componentes/Botones';
import { FaEye } from 'react-icons/fa6';
import { grey } from '@mui/material/colors';
interface Column {
    id: string;
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}
function filtrarValorEnArray(array: any, valorBuscado: string) {
    let resultados: any[] = [];

    // Iterar sobre cada objeto en el array
    array.forEach((objeto: any) => {
        // Iterar sobre cada atributo del objeto
        for (let clave in objeto) {
            // Verificar si el valor del atributo no es un objeto
            if (typeof objeto[clave] !== 'object' && objeto[clave].toString().toLowerCase().includes(valorBuscado.toLocaleLowerCase())) {
                resultados.push(objeto); // Si el valor coincide, agregar al resultado
                break; // Romper el bucle para pasar al siguiente objeto
            }
        }
    });

    return resultados;
}


interface Props {
    hasPagination?: boolean;
    data: any[];
    take?: number;
    admin?: string;
    skip?: number;
    small?: boolean;
    onRow?: (item: any) => void | undefined;
    skipColumns?: { [key: string]: boolean };
    hasSearch?: boolean;
}

const Tabla = ({
    hasPagination = false,
    data,
    skip = 0,
    take = 10,
    small = true,
    admin = undefined,
    onRow = undefined,
    skipColumns = {},
    hasSearch = true

}: Props) => {
    const [page, setPage] = React.useState(skip);
    const [Data, setData] = React.useState(data);
    const router = useRouter();
    const [open, setOpen] = React.useState<any>(null);
    const [rowsPerPage, setRowsPerPage] = React.useState(take);
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    React.useEffect(() => {
        setData(data)
    }, [data]);

    let cols: Column[] = [];
    let keys = Data ? Data[0] ? Object.keys(Data[0]) : [] : [];
    keys.forEach((value => {
        if (value != 'id' && !skipColumns[value])
            cols.push({ id: value, label: value })
    }));
    return (
        <Box>

            <Box>
                <TableContainer sx={{
                    maxHeight: 1000,
                    bgcolor: 'white', p: 1.5, borderRadius: 3
                }} >
                    {
                        Data.length > 0 ?
                            <Table
                                size={small ? 'small' : 'medium'}
                                stickyHeader
                            >
                                <TableHead >
                                    {
                                        hasSearch ?
                                            <Box>
                                                <InputBox

                                                    size='small'

                                                    sx={{
                                                        width: "30%",
                                                        minWidth: 200,
                                                        ".MuiInputBase-root": {
                                                            background: 'white'
                                                        }
                                                    }}
                                                    onChange={(ev: any) => {
                                                        setData(filtrarValorEnArray(data, ev.target.value));
                                                    }}
                                                    placeholder='Buscar'
                                                    InputProps={{
                                                        endAdornment:
                                                            <BiSearch fontSize={25} />
                                                    }}
                                                />
                                            </Box>
                                            : null
                                    }
                                    <TableRow key={'head'}>
                                        {cols.map((column) => {
                                            return (
                                                <TableCell
                                                    style={{
                                                        textTransform: 'capitalize',
                                                        fontSize: 16,
                                                        fontFamily: 'inherit',
                                                        fontWeight: 600,
                                                        border: 'none'
                                                    }}
                                                    key={column.label}
                                                    align={'left'}
                                                >
                                                    {column.label}
                                                </TableCell>
                                            );
                                        })}
                                        {
                                            admin || onRow ?
                                                <TableCell
                                                    style={{
                                                        textTransform: 'capitalize',
                                                        fontSize: 14.5,
                                                        fontWeight: 600,
                                                        color: '#637381',
                                                        border: 'none'
                                                    }}
                                                    align={'left'}
                                                >
                                                </TableCell>
                                                : null
                                        }
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Data
                                        .slice(rowsPerPage! * page!, rowsPerPage! * page! + rowsPerPage!)
                                        .map((row, index) => {
                                            return (
                                                <TableRow hover key={index} >
                                                    {cols.map((column) => {
                                                        let value = row[column.id];
                                                        if (React.isValidElement(value)) {
                                                            return (
                                                                <TableCell
                                                                    sx={{ py: 0, borderBottom: "none" }}
                                                                    key={Math.random()}
                                                                >
                                                                    {value}
                                                                </TableCell>
                                                            );
                                                        }
                                                        if (typeof value == 'boolean') {
                                                            return (
                                                                <TableCell
                                                                    sx={{ py: 0, borderBottom: "none" }}
                                                                    key={Math.random()}
                                                                >
                                                                    {
                                                                        value ?
                                                                            <ChipBox label="Sí" />
                                                                            :
                                                                            <ChipBox label="No" />
                                                                    }
                                                                </TableCell>
                                                            );
                                                        }
                                                        else if (column.id == 'avatar') {
                                                            return (
                                                                <TableCell
                                                                    sx={{
                                                                        width: 0,
                                                                        py: 2,
                                                                        borderBottom: "none"
                                                                    }}
                                                                    key={Math.random()}
                                                                >
                                                                    <Image style={{ borderRadius: 10 }} src={value} width={50} height={50} layout='fixed' />
                                                                </TableCell>
                                                            )
                                                        }
                                                        else if (typeof value != 'object') {
                                                            return (
                                                                <TableCell
                                                                    sx={{
                                                                        fontWeight: 500,
                                                                        fontSize: 14,
                                                                        py: 1,
                                                                        borderBottom: "none",

                                                                    }}
                                                                    key={Math.random()}
                                                                >
                                                                    {value}
                                                                </TableCell>
                                                            );
                                                        }
                                                    })}
                                                    {admin || onRow ?
                                                        <TableCell
                                                            key={Math.random()}
                                                            sx={{ py: 1, borderBottom: "none" }}
                                                        >
                                                            <ClickAwayListener touchEvent={false} onClickAway={() => setOpen(null)}>
                                                                <Box>
                                                                    <Tooltip
                                                                        arrow
                                                                        PopperProps={{
                                                                            sx: {
                                                                                "& .MuiTooltip-tooltip": {
                                                                                    borderRadius: 3,
                                                                                    background: grey[200]
                                                                                },
                                                                            }
                                                                        }}
                                                                        placement='left'
                                                                        disableFocusListener
                                                                        disableHoverListener
                                                                        disableTouchListener
                                                                        open={open == index}
                                                                        title={
                                                                            <Box py={1} minWidth={150}>

                                                                                {admin ?
                                                                                    <BotonSimple fullWidth onClick={() => router.push(`${admin}${row.id}`)} sx={{ display: 'flex', justifyContent: 'start' }} >
                                                                                        <FaEye fontSize={20} style={{ marginRight: 10 }} /> Ver
                                                                                    </BotonSimple>
                                                                                    : null
                                                                                }
                                                                                {onRow ?
                                                                                    <BotonSimple onClick={() => {
                                                                                        onRow!(row);
                                                                                        setOpen(null);
                                                                                    }} sx={{ display: 'flex', justifyContent: 'start' }} >
                                                                                        <BsCursorFill /> Realizar acción
                                                                                    </BotonSimple>
                                                                                    : null
                                                                                }
                                                                            </Box>
                                                                        }
                                                                    >
                                                                        <BotonOutline onClick={() => setOpen(index)}>
                                                                            <TbDotsVertical fontSize={18} />
                                                                        </BotonOutline>
                                                                    </Tooltip>
                                                                </Box>
                                                            </ClickAwayListener>
                                                        </TableCell>
                                                        : null
                                                    }
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                            :
                            <Normal sx={{ textAlign: 'center', py: 2 }}>Sin datos disponibles</Normal>
                    }
                </TableContainer >
            </Box>
            {
                hasPagination ?
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50]}
                        component="div"
                        count={Data.length}
                        sx={{
                            fontSize: 13,
                            fontWeight: 600
                        }}

                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage='Filas'
                        labelDisplayedRows={
                            ({ count, from, page, to }) => {
                                return (`Página ${page + 1}`)
                            }
                        }

                    />
                    : null}
        </Box >
    )
}




export default Tabla;