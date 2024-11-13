'use client';
import React, { useState } from 'react';
import { Grid, CircularProgress, Backdrop, Box } from '@mui/material';
import { Video, Video as VideoType } from '@prisma/client';
import { Normal, Titulo } from '@/app/componentes/Textos';
import { Controller, useForm } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
import { useModal } from '@/providers/ModalProvider';
import EditorSkeleton from '@/app/skeletons/EditorSkeleton';
import dynamic from 'next/dynamic';
import ReactPlayer from 'react-player/lazy'
import axios from 'axios';
import { Uploader, Modal, Form, Button, Input } from 'rsuite';
import { fileDomain } from '@/utils/globals';
interface Props {
    setVideo: any;
    video: Video;
}
import parser from 'html-react-parser';
import { grey } from '@mui/material/colors';

export default function ModalVideo({ setVideo, video }: Props) {



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
                    <ReactPlayer
                        width="100%"
                        controls
                        playing
                        url={`${fileDomain}${video.video}`} />
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