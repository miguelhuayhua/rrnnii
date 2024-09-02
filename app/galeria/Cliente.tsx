'use client';
import { Grid, Box, CircularProgress } from "@mui/material";
import { InputBox } from "../componentes/Datos";
import { BiSearch } from "react-icons/bi";
import { BotonOutline, BotonSimple } from "../componentes/Botones";
import { useEffect, useState } from "react";
import { BsArrowDown } from "react-icons/bs";
import Lightbox from "yet-another-react-lightbox";
import 'yet-another-react-lightbox/styles.css';
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";
import axios from "axios";
import parse from 'html-react-parser';
import Imagen from 'next/legacy/image';
import { Galeria } from "@prisma/client";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/captions.css";
import { ChipBox } from "../componentes/Mostrar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
const Cliente = () => {
    const [index, setIndex] = useState<any>(-1);
    const [loading, setLoading] = useState(true);
    const [Galerias, setGalerias] = useState<Galeria[]>([]);
    const params = useSearchParams();
    const orden = params.get('s');
    const router = useRouter();
    const [skip, setSkip] = useState(1);
    useEffect(() => {
        setLoading(true);
        axios.post('/api/galeria/listar', { orden, skip: 0 }).then(res => {
            setGalerias(res.data);
            setSkip(1);
            setLoading(false);
        })
    }, [params]);
    const getImageSize = (src: string) => {
        const img = new Image();
        img.src = src;
        return ({ width: img.width, height: img.height })
    }
    return (
        <>
            <Grid container px={3} spacing={1}>
                <Grid item xs={12} mb={2}>
                    <InputBox
                        size='small' sx={{ width: 200 }} placeholder='Buscar'
                        InputProps={{
                            endAdornment:
                                <BiSearch fontSize={25} />
                        }}
                    />
                    <BotonSimple
                        endIcon={<BsArrowDown size={18} style={{
                            transform: `rotateZ(${orden == '1' ? '-180deg' : '0deg'})`,
                            transition: 'transform .5s'
                        }} />}
                        onClick={() => {
                            router.replace(`/galeria?s=${params.get('s') == '1' ? '0' : '1'}`)
                        }}
                        sx={{ float: 'right', fontSize: 14 }}>
                        {
                            orden == '1' ? 'Más antiguos' : 'Más recientes'
                        }
                    </BotonSimple>
                </Grid>
            </Grid>
            <RowsPhotoAlbum
                spacing={0.5}
                photos={Galerias.map(value => {
                    return ({ src: value.imagen, ...getImageSize(value.imagen) })
                })}
                targetRowHeight={200}
                render={{
                    image: (props, context) => <Box>
                        <Imagen src={props.src} width={context.width} height={context.height} layout="intrinsic" />
                        <ChipBox
                            sx={{ position: 'absolute', top: 5, right: 5 }}
                            label={Galerias.find(value => value.imagen == props.src)?.titulo} />
                    </Box>
                }}
                onClick={({ index: current }) => setIndex(current)}
            />
            <Lightbox
                index={index}
                slides={Galerias.map(value => {
                    return ({
                        src: value.imagen, ...getImageSize(value.imagen),
                        title: value.titulo,
                        description: <Box sx={{ fontSize: 14, a: { color: 'white' } }}>{parse(value.descripcion)}</Box>
                    })
                })}
                plugins={[Captions]}
                open={index >= 0}
                close={() => setIndex(-1)}
            />
            {
                loading ?
                    <CircularProgress sx={{ display: 'block', mx: 'auto' }} /> :
                    <BotonOutline
                        sx={{ fontSize: 13, mx: 'auto', display: 'block', mt: 4 }}
                        onClick={() => {
                            setLoading(true);
                            axios.post('/api/galeria/listar', { orden, skip }).then(res => {
                                setGalerias(prev => [...prev, ...res.data]);
                                setSkip(prev => prev + 1);
                                setLoading(false);
                            })
                        }}>
                        Cargar más
                    </BotonOutline>
            }
        </>
    )
}
export default Cliente;