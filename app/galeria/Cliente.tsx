'use client';
import { Grid } from "@mui/material";
import { InputBox } from "../componentes/Datos";
import { BiSearch } from "react-icons/bi";
import { BotonSimple } from "../componentes/Botones";
import { useState } from "react";
import Galeria from "../componentes/items/Galeria";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";
const Cliente = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Grid container px={3} spacing={1}>
                <Grid item xs={12} mb={2}>
                    <InputBox sx={{ width: 200 }} placeholder='Buscar'
                        InputProps={{
                            startAdornment:
                                <BiSearch fontSize={25} />
                        }}
                    />
                    <BotonSimple
                        onClick={() => {
                            setOpen(true);
                        }}
                        sx={{ height: 52.5, float: 'right' }}>Orden: <BsArrowDown style={{ marginLeft: 5, position: 'relative', top: 1 }} /> </BotonSimple>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <Galeria />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <Galeria />
                </Grid>
            </Grid>
        </>
    )
}
export default Cliente;