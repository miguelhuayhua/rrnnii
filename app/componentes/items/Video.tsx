'use client';
import { Avatar, Box } from "@mui/material";
import Link from "next/link";
import Image from 'next/legacy/image';
import { TbWorld } from "react-icons/tb";
import { ChipBox } from "../Mostrar";
import { Negrita, Normal } from "../Textos";
import { blue, green, grey } from "@mui/material/colors";
import { Video } from "@prisma/client";
import { Icon } from '@iconify/react';
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import 'dayjs/locale/es';
import { fileDomain } from "@/utils/globals";
import { FaUserGroup } from "react-icons/fa6";
import ReactPlayer from "react-player";

dayjs.locale('es');

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
                <ChipBox
                    sx={{
                        background: "#212121bb",
                        borderRadius: 1,
                        padding: 0.5,
                        color: grey[50],
                        position: 'absolute',
                        bottom: 10,
                        left: 5
                    }}
                    label={duration}
                />
                <video
                    onClick={() => {
                        setVideo(value);
                    }}
                    preload="metadata"
                    id={value.id}
                    disablePictureInPicture
                    controlsList="nodownload"
                    style={{
                        width: "100%",
                        borderRadius: 16,
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
