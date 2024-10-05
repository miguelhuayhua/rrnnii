"use client";
import React, { useState } from "react";
import 'react-quill/dist/quill.snow.css';
import { BotonFilled } from "../componentes/Botones";
import axios from "axios";
import { Normal, Titulo } from "../componentes/Textos";
import { useSession } from "next-auth/react";
export default function Layout({ children }: any) {
    const [descripcion, setDescripcion] = useState('');
    const { data } = useSession();
    return (
        <>
            <Normal>
                {descripcion}
            </Normal>
            <Titulo>
                Bienvenido {data?.user.name}
            </Titulo>
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