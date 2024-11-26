import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { Beca, Convenio, ParticipanteBeca } from '@prisma/client';
dayjs.locale('es');
const styles = StyleSheet.create({
    negrita: {
        fontSize: 13,
        color: '#222',
        fontFamily: 'Helvetica-Bold'
    },
    titulo: {
        fontSize: 18,
        color: '#222',
        fontFamily: 'Helvetica-Bold'
    },
    normal: {
        fontSize: 13,
        fontFamily: 'Helvetica'
    },
    textoInfo: {
        color: 'gray',
        fontSize: 9,
        marginVertical: 1
    },
    celda: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    }
});

interface Props {
    Convenios: Convenio[]
}
const ParticipantesPDF = ({ Convenios }: Props) => {
    return (
        <Document author='rrnnii'
            creationDate={new Date()}
            language='es'
            creator='rrnnii'
        >
            <Page size="LETTER" style={{ padding: 20 }} orientation='landscape'>
                <Text style={styles.textoInfo}>
                    Generado el: {dayjs().format('DD [de] MMMM [del] YYYY [a las] HH:mm:ss')}
                </Text>
                <View style={{
                    display: 'flex',
                    justifyContent: 'center', alignItems: 'center',
                    width: "100%", marginTop: 10
                }}>
                    <Image fixed source='/assets/head.png' style={{
                        width: 700, height: 70,
                    }} />
                </View>
                <Text style={{
                    ...styles.titulo, marginTop: 10,
                    textAlign: 'center', paddingHorizontal: 20
                }}>
                    Listado de Convenios
                </Text>
                <View style={{
                    border: '1px solid #ddd',
                    marginVertical: 20, marginHorizontal: 20
                }}>
                    <View style={{
                        display: 'flex', flexDirection: 'row',
                        borderBottom: '1px solid #ddd'
                    }}>
                        <View style={{ width: "5%", ...styles.celda }}>
                            <Text style={styles.negrita}>
                                Nro.
                            </Text>
                        </View>
                        <View style={{ width: "35%", ...styles.celda }}>
                            <Text style={styles.negrita}>
                                Nombre completo
                            </Text>
                        </View>
                        <View style={{ width: "22.5%", ...styles.celda }}>
                            <Text style={styles.negrita}>
                                Registro universitario
                            </Text>
                        </View>
                        <View style={{ width: "22.5%", ...styles.celda }}>
                            <Text style={styles.negrita}>
                                Cédula de identidad
                            </Text>
                        </View>
                        <View style={{ width: "15%", ...styles.celda }}>
                            <Text style={styles.negrita}>
                                Aceptado
                            </Text>
                        </View>
                    </View>
                    {
                        Convenios.map((value, i) => (
                            <View key={value.id} style={{
                                display: 'flex', flexDirection: 'row',
                                borderBottom: '1px solid #ddd',
                                borderRadius: 2
                            }}>
                                <View style={{ width: "5%", ...styles.celda }}>
                                    <Text style={styles.normal}>
                                        {i + 1}
                                    </Text>
                                </View>
                                <View style={{ width: "35%", ...styles.celda }}>
                                    <Text style={styles.normal}>
                                        {value.titulo}
                                    </Text>
                                </View>
                                <View style={{ width: "22.5%", ...styles.celda }}>
                                    <Text style={styles.normal}>
                                        {value.pais}
                                    </Text>
                                </View>
                                <View style={{ width: "22.5%", ...styles.celda }}>
                                    <Text style={styles.normal}>
                                        {value.descripcion}
                                    </Text>
                                </View>
                                <View style={{ width: "15%", ...styles.celda }}>
                                    <Text style={styles.normal}>
                                        {
                                            value.estado ? 'Activo' : 'Inactivo'
                                        }
                                    </Text>
                                </View>
                            </View>
                        ))
                    }
                </View>
                <Text style={{ position: 'absolute', bottom: 10, right: 10, fontSize: 10, color: '#888' }} render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed />
            </Page>
        </Document>
    );
}
export default ParticipantesPDF;

