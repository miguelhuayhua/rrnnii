'use client';
import Box from '@mui/material/Box';
import { Avatar, ClickAwayListener, Divider, Tooltip } from "@mui/material";
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { BotonSimple } from '@/app/componentes/Botones';
import { PiSignOutBold } from 'react-icons/pi';
const Navbar = () => {
    const [open, setOpen] = useState(false);
    const { data } = useSession();
    return (
        <Box position={'sticky'} top={0} zIndex={18} width="100%" px={1}>
            <Box className='blur-style' p={2} height={30} bgcolor='transparent' position={'relative'} >
                <ClickAwayListener onClickAway={() => setOpen(false)}>
                    <Tooltip
                        PopperProps={{
                            sx: {
                                "& .MuiTooltip-tooltip": {
                                    background: 'linear-gradient(25deg, rgba(255,245,245,1) 0%, rgba(255,255,255,1) 51%, rgba(255,255,255,1) 72%, rgba(244,247,255,1) 100%)',
                                    px: 0,
                                    borderRadius: 3,
                                    border: "1px solid #f1f1f1",
                                    boxShadow: '-10px 10px 30px #00000022',
                                    ".MuiTooltip-arrow": {
                                        color: 'white'
                                    }
                                }
                            }
                        }}
                        placement='bottom-start'
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        open={open}
                        onClose={() => setOpen(false)}
                        title={
                            <Box p={0.5}>
                                <BotonSimple
                                    startIcon={<PiSignOutBold />}
                                    onClick={() => {
                                        signOut({
                                            redirect: true,
                                            callbackUrl: '/'
                                        });
                                    }}>
                                    Cerrar sesión
                                </BotonSimple>
                            </Box>
                        }
                    >
                        <Avatar
                            onClick={() => setOpen(true)}
                            sx={{ "&:hover": { cursor: 'pointer' }, position: 'absolute', right: 10, top: 10, bgcolor: '#0074be' }}
                            src={data?.user.image!}
                        />
                    </Tooltip>
                </ClickAwayListener>
            </Box>
        </Box >
    )
}


export default Navbar;