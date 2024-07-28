import { Chip, Typography, styled } from "@mui/material";
const Normal = styled(Typography)(() =>
({
    fontWeight: 400,
    fontSize: 14
}));

const Titulo = styled(Typography)(({ theme }) =>
({
    color: '#212b36',
    fontSize: 25,
    fontWeight: 800,
    [theme.breakpoints.down('sm')]: {
        fontSize: 20
    }
}));
const Negrita = styled(Typography)(() =>
({
    fontSize: 14,
    fontWeight: 800,
}));



export { Normal, Titulo, Negrita };