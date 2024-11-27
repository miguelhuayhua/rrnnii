'use client';
import { Box } from "@mui/material";
import { ChipBox } from "../Mostrar";
import { Negrita } from "../Textos";
import { grey } from "@mui/material/colors";
import { Video } from "@prisma/client";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import 'dayjs/locale/es';
import { fileDomain } from "@/utils/globals";

dayjs.locale('es');
import { Icon } from '@iconify/react';
interface Props {
    value: Video,
    setVideo: any
}

const VideoItem = ({ value, setVideo }: Props) => {
    const [duration, setDuration] = useState("00:00");

    useEffect(() => {
        const video = document.getElementById(value.id) as HTMLVideoElement;

        video.addEventListener('loadeddata', () => {
            const totalSeconds = Math.floor(video.duration);
            const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
            const seconds = (totalSeconds % 60).toString().padStart(2, '0');
            setDuration(`${minutes}:${seconds}`);
        }, false);
    }, []);

    return (
        <Box>

            <Box position='relative'>
                <Box
                    onClick={() => {
                        setVideo(value);
                    }}
                    sx={{
                        position: 'absolute', width: "100%", height: "96%", background: '#00000055',
                        top: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: 3, cursor: 'pointer'
                    }}>
                    <Icon icon='line-md:play' fontSize={50} color="white" />
                </Box>
                <ChipBox
                    sx={{
                        background: "#212121bb",
                        borderRadius: 1,
                        padding: 0.5,
                        color: grey[50],
                        position: 'absolute',
                        bottom: 20,
                        left: 10
                    }}
                    label={duration}
                />
                <ChipBox
                    sx={{
                        background: "#212121bb",
                        borderRadius: 1,
                        padding: 0,
                        color: grey[50],
                        position: 'absolute',
                        top: 1,
                        right: 1
                    }}
                    label={<Box sx={{ display: 'flex', alignItems: 'center', }}>{value.conteo} <Icon icon='basil:eye-solid' fontSize={17} style={{ marginLeft: 5}} /></Box>}
                />
                <video

                    preload="metadata"
                    id={value.id}
                    disablePictureInPicture
                    controlsList="nodownload"
                    style={{
                        width: "100%",
                        borderRadius: 12,
                        cursor: 'pointer'
                    }}
                    src={`${fileDomain}${value.video}#t=1`}
                ></video>
            </Box>
            <Negrita sx={{ fontSize: 18 }}>
                {value.titulo}
            </Negrita>
        </Box>
    );
};

export default VideoItem;
