'use client';
import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { Video, Video as VideoType } from '@prisma/client';
import { Titulo } from '@/app/componentes/Textos';
import 'react-quill/dist/quill.snow.css';
import ReactPlayer from 'react-player/lazy'
import { Modal } from 'rsuite';
import { fileDomain } from '@/utils/globals';
interface Props {
    setVideo: any;
    video: Video;
}
import parser from 'html-react-parser';
import axios from 'axios';

export default function ModalVideo({ setVideo, video }: Props) {
    useEffect(() => {
        if (video) {
            axios.post('/api/video/count', { id: video.id });
        }
    }, []);
    return (
        <>
            <Modal
                overflow
                size='md'
                open={!!video}
                onClose={() => { setVideo(null) }}
            >
                <Modal.Header>
                    <Titulo mb={2}>
                        {video.titulo}
                    </Titulo>
                </Modal.Header>
                <Modal.Body>
                    {
                        video ?
                            <ReactPlayer
                                width="100%"
                                controls
                                playing
                                url={`${fileDomain}${video.video}`} /> : null
                    }
                    <Box sx={{ fontSize: 17 }}>
                        {
                            parser(video.descripcion)
                        }
                    </Box>
                </Modal.Body>

            </Modal >

        </>
    );
}