'use client';
import Box from '@mui/material/Box';
import { useRouter } from 'next/navigation';
import { MdDiscount, MdInventory } from "react-icons/md";
import { ClickAwayListener } from "@mui/material";
import { useState } from 'react';
import { IoBag } from "react-icons/io5";
import { useSession } from 'next-auth/react';
import { FaStoreAlt } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { PiNotebookFill } from "react-icons/pi";
import { FaHammer } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { GrConfigure } from 'react-icons/gr';
import Link from 'next/link';
import { MdOutlineAttachMoney } from "react-icons/md";
//SECCIÓN DE BOTONES PARA EL SIDEBAR

const SideBar = () => {
    const router = useRouter();
    const [label, setLabel] = useState('');
    const { data } = useSession();
    return (
        <ClickAwayListener onClickAway={() => setLabel('')}>
            <Box position='sticky' bgcolor='white' top={55} width={70} height={"calc(100vh - 58px)"} zIndex={20}>
                <Box display='flex' flexDirection='column' justifyContent='center'>


                    <Box mx='auto' width={"100%"}>
                        <Link href='/dashboard/configuracion/informacion' >

                        </Link>
                    </Box>
                </Box>
                <Box
                    onMouseLeave={() => setLabel('')}
                    display={label != '' ? 'block' : 'none'}
                    position='absolute'
                    left={"100%"}
                    top={0}
                    bgcolor='white'
                    height={"100%"}
                    borderRight="1px solid #ddd"
                    borderLeft="1px solid #ddd"
                >
                    {
                        label == 'tienda' ?
                            <Box width={210} >


                            </Box>
                            : null
                    }
                    {
                        label == 'servicio' ?
                            <Box width={210} >

                            </Box>
                            : null
                    }
                </Box>
            </Box>
        </ClickAwayListener>

    )
}


export default SideBar;