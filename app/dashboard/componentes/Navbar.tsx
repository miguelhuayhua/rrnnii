'use client';
import Box from '@mui/material/Box';
import { Avatar, Button, ClickAwayListener, Divider, Tooltip } from "@mui/material";
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/legacy/image';
import { useRouter } from 'next/navigation';
const Navbar = () => {
    const [open, setOpen] = useState(false);
    const { data } = useSession();
    const router = useRouter();
    return (
        <Box position={'sticky'} top={0} zIndex={18} width="100%" >
            <Box className='blur-style' p={2} bgcolor='#071a28' position={'relative'} >
                <Image width={85} height={18} layout='fixed' src="/logo-principal.png" />
                <ClickAwayListener onClickAway={() => setOpen(false)}>
                    <Box sx={{ position: 'absolute', right: 10, top: 7 }}>
                        <Tooltip
                            arrow
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
                                <Box p={1}>

                                    <Divider orientation='horizontal' flexItem sx={{ my: 1 }} />

                                </Box>
                            }
                        >
                            <Avatar
                                sx={{
                                    cursor: 'pointer'
                                }}
                                onClick={() => setOpen(true)}
                                src={data?.user.image!}
                            />
                        </Tooltip>
                    </Box>
                </ClickAwayListener>
            </Box>
        </Box >
    )
}


export default Navbar;