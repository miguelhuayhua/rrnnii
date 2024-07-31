"use client";
import React, { useState } from "react";
import 'react-quill/dist/quill.snow.css';
import { BotonFilled } from "../componentes/Botones";
import axios from "axios";
import { Normal } from "../componentes/Textos";
export default function Layout({ children }: any) {
    const [descripcion, setDescripcion] = useState('');
    return (
        <>
            <Normal>
                {descripcion}
            </Normal>
            <BotonFilled onClick={() => {
                axios.post('/api/ai').then(res => {
                    console.log(res.data)
                    setDescripcion(res.data.descripcion);
                })
            }} >
                click
            </BotonFilled>
        </>
    )
}