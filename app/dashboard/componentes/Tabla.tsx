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
import { BiEdit, BiSearch } from 'react-icons/bi';
import { PiEyeBold } from "react-icons/pi";
import Image from 'next/legacy/image';
import { BsCursorFill } from "react-icons/bs"; import { useRouter } from 'next/navigation';
import { Normal } from '@/app/componentes/Textos';
import { ChipBox } from '@/app/componentes/Mostrar';
import { InputBox } from '@/app/componentes/Datos';
import { BotonFilled, BotonOutline, BotonSimple } from '@/app/componentes/Botones';
import { FaPenToSquare } from 'react-icons/fa6';
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
    onEdit?: (item: any) => void | undefined;
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
    onEdit = undefined,
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
            {
                hasSearch ?
                    <Box my={1}>
                        <InputBox
                            sx={{
                                width: "30%",
                                minWidth: 200
                            }}
                            onChange={(ev: any) => {
                                setData(filtrarValorEnArray(data, ev.target.value));
                            }}
                            placeholder='Buscar'
                            InputProps={{
                                startAdornment:
                                    <BiSearch color='#666' fontSize={25} />
                            }}
                        />
                    </Box>
                    : null
            }
            <Box>
                <TableContainer sx={{ maxHeight: 500 }} >
                    {
                        Data.length > 0 ?
                            <Table
                                stickyHeader
                                aria-label="sticky table"
                            >
                                <TableHead >
                                    <TableRow key={'head'}>
                                        {cols.map((column) => {
                                            return (
                                                <TableCell
                                                    style={{
                                                        textTransform: 'capitalize',
                                                        fontSize: 13,
                                                        fontWeight: 600,
                                                        color: '#637381',
                                                        border: 'none'
                                                    }}
                                                    key={Math.random()}
                                                    align={'left'}
                                                >
                                                    {column.label == 'avatar' ? '' : column.label}
                                                </TableCell>
                                            );
                                        })}
                                        {
                                            onEdit ?
                                                <TableCell
                                                    style={{
                                                        textTransform: 'capitalize',
                                                        fontSize: 14,
                                                        fontWeight: 500,
                                                        color: '#637381',
                                                        border: 'none'
                                                    }}
                                                    key={Math.random()}
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
                                                <TableRow hover key={Math.random()} >
                                                    {cols.map((column) => {
                                                        let value = row[column.id];
                                                        if (typeof value == 'boolean') {
                                                            return (
                                                                <TableCell
                                                                    sx={{ py: 0, borderBottom: "none" }}
                                                                    key={Math.random()}
                                                                >
                                                                    {
                                                                        value ?
                                                                            <ChipBox label="Sí" sx={{ background: '#22c55e22', color: '#22c55e' }} />
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
                                                        else {
                                                            return (
                                                                <TableCell
                                                                    sx={{
                                                                        fontWeight: 500,
                                                                        fontSize: 14,
                                                                        py: 2,
                                                                        borderBottom: "none",

                                                                    }}
                                                                    key={Math.random()}
                                                                >
                                                                    {value}
                                                                </TableCell>
                                                            );
                                                        }
                                                    })}
                                                    {
                                                        onEdit ?
                                                            <TableCell
                                                                key={Math.random()}
                                                                sx={{
                                                                    py: 2,
                                                                    borderBottom: "none",
                                                                    width: 50
                                                                }}
                                                            >
                                                                <BotonOutline onClick={() => onEdit(row)}>
                                                                    <FaPenToSquare fontSize={15} />
                                                                </BotonOutline>
                                                            </TableCell>
                                                            : null
                                                    }
                                                    {admin || onRow ?
                                                        <TableCell
                                                            key={Math.random()}
                                                            sx={{ py: 2, borderBottom: "none" }}

                                                        >
                                                            <ClickAwayListener touchEvent={false} onClickAway={() => setOpen(null)}>
                                                                <Box>
                                                                    <Tooltip
                                                                        arrow
                                                                        PopperProps={{
                                                                            sx: {
                                                                                "& .MuiTooltip-tooltip": {
                                                                                    background: 'linear-gradient(25deg, rgba(255,245,245,1) 0%, rgba(255,255,255,1) 51%, rgba(255,255,255,1) 72%, rgba(244,247,255,1) 100%)',
                                                                                    px: 0,
                                                                                    borderRadius: 3,
                                                                                    border: "1px solid #f1f1f1",
                                                                                    boxShadow: '-10px 10px 30px #ddd'
                                                                                }
                                                                            }
                                                                        }}
                                                                        placement='left'
                                                                        disableFocusListener
                                                                        disableHoverListener
                                                                        disableTouchListener
                                                                        open={open == index}
                                                                        title={
                                                                            <Box >

                                                                                {admin ?
                                                                                    <BotonSimple fullWidth onClick={() => router.push(`${admin}${row.id}`)} >
                                                                                        <PiEyeBold /> Administrar
                                                                                    </BotonSimple>
                                                                                    : null
                                                                                }
                                                                                {onRow ?
                                                                                    <BotonSimple onClick={() => {
                                                                                        onRow!(row);
                                                                                        setOpen(null);
                                                                                    }}>
                                                                                        <BsCursorFill /> Realizar acción
                                                                                    </BotonSimple>
                                                                                    : null
                                                                                }
                                                                            </Box>
                                                                        }
                                                                    >
                                                                        <BotonFilled variant="contained" onClick={() => setOpen(index)}>
                                                                            <TbDotsVertical fontSize={20} />
                                                                        </BotonFilled>
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
                            <Box border='1px solid #ddd' p={2} borderRadius={2}>
                                <Normal sx={{ textAlign: 'center', py: 2 }}>Sin datos disponibles</Normal>
                            </Box>
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