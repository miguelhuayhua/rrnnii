import { Typography, styled } from "@mui/material";
import Link from "next/link";
const Normal = styled(Typography)(() =>
({
    fontWeight: 500,
    color: '#687885',
    fontSize: 13
}));

const Titulo = styled(Typography)(({ theme }) =>
({
    color: '#212b36',
    fontSize: 35,
    fontWeight: 800,
    [theme.breakpoints.down('sm')]: {
        fontSize: 20
    }
}));
const Negrita = styled(Typography)(() =>
({
    color: '#919eab',
    fontSize: 12,
    fontWeight: 800,
}));
export { Normal, Titulo, Negrita };