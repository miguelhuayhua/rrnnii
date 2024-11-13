'use client';
import { Box, Grid } from "@mui/material";
import Image from 'next/legacy/image';
import { Negrita, Normal } from "../Textos";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { Noticia } from "@prisma/client";
import dayjs from "dayjs";
import parser from 'html-react-parser';
import ShowMoreText from "react-show-more-text";
import 'dayjs/locale/es';
import { fileDomain } from "@/utils/globals";
import { Panel } from "rsuite";
dayjs.locale('es');
interface Props {
    value: Noticia;
}
const NoticiaItem = ({ value }: Props) => {
    return (
        <Panel shaded style={{ background: 'white' }}>
            <Grid container>
                <Grid item xs={8} mx='auto' sm={4} md={3}>
                    <Zoom>
                        <Image style={{ zIndex: 20, borderRadius: 10 }}
                            src={fileDomain + value.imagen}
                            width={100} height={100}
                            layout="responsive" objectFit="cover" />
                    </Zoom>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                    <Box p={2}>
                        <Normal sx={{ color: '#888' }}>
                            Publicado el:  {dayjs(value.createdAt).format('DD [de] MMMM [del] YYYY')}
                        </Normal>
                        <Negrita sx={{ fontSize: 16, mt: 2 }}>
                            {value.titulo}
                        </Negrita>

                        <ShowMoreText
                            /* Default options */
                            lines={3}
                            more="Mostrar más"
                            less="Mostrar menos"
                            className="content-css"
                            anchorClass="show-more-less-clickable"
                            expanded={false}
                            truncatedEndingComponent={"... "}
                        >
                            <Box sx={{ fontSize: 14 }}>
                                {
                                    parser(value.descripcion)
                                }
                            </Box>
                        </ShowMoreText>
                    </Box>
                </Grid>

            </Grid>
        </Panel>
    )
}
export default NoticiaItem;