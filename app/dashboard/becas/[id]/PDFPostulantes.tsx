import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { Beca, ParticipanteBeca } from '@prisma/client';
dayjs.locale('es');
const styles = StyleSheet.create({
    negrita: {
        fontSize: 11,
        color: '#212121',
        fontFamily: 'Helvetica-Bold',
        textAlign: 'center'
    },
    normal: {
        fontSize: 11,
        fontFamily: 'Helvetica',
        textAlign: 'center'
    },
    celda: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        borderBottom: '1px solid #212121',
        borderLeft: '1px solid #212121'
    }
});

interface Props {
    Participantes: ParticipanteBeca[],
    Beca: Beca
}
const ParticipantesPDF = ({ Participantes, Beca }: Props) => {
    return (
        <Document author='rrnnii'
            creationDate={new Date()}
            language='es'
            creator='rrnnii'
        >
            <Page size="LETTER" style={{ padding: 25 }}>
                <Image fixed
                    src='/logorrnnii.png'
                    style={{
                        position: 'absolute',
                        left: "30%", right: 0, top: "40%", bottom: 0,
                        margin: 'auto',
                        width: 260,
                        height: 260,
                        opacity: 0.05
                    }} />
                <Image fixed src='/cabecera.png' style={{ width: "100%", height: 60 }} />
                <View fixed style={{
                    display: 'flex', flexDirection: 'row',
                    borderTop: '1px solid #212121', borderRight: "1px solid #212121",
                    marginTop: 20
                }}>
                    <View style={{ ...styles.celda, width: "70%", paddingHorizontal: 20 }}>
                        <Text style={{ ...styles.negrita, fontSize: 14 }}>
                            Lista participantes a la beca: {Beca.titulo}
                        </Text>
                    </View>
                    <View style={{ ...styles.celda, width: "30%" }}>
                        <Text style={styles.negrita} render={({ pageNumber, totalPages }) => (
                            `Pág. ${pageNumber} de ${totalPages}`
                        )} />
                        <Text style={{ ...styles.normal, fontSize: 10 }}>
                            {dayjs().format('DD [de] MMMM [del] YYYY [a las] HH:mm:ss')}
                        </Text>
                    </View>
                </View>
                <Text style={{ ...styles.normal, marginVertical: 20 }}>
                    {Beca.descripcionCorta}
                </Text>
                <View style={{
                    borderTop: '1px solid #212121',
                    borderRight: '1px solid #212121'
                }}>
                    <View style={{
                        display: 'flex', flexDirection: 'row',
                    }}>
                        <View style={{ width: "8%", ...styles.celda, backgroundColor: '#ccc' }}>
                            <Text style={styles.negrita}>
                                Nro.
                            </Text>
                        </View>
                        <View style={{ width: "32%", ...styles.celda, backgroundColor: '#ccc' }}>
                            <Text style={styles.negrita}>
                                Nombre completo
                            </Text>
                        </View>
                        <View style={{ width: "22.5%", ...styles.celda, backgroundColor: '#ccc' }}>
                            <Text style={styles.negrita}>
                                Registro universitario
                            </Text>
                        </View>
                        <View style={{ width: "22.5%", ...styles.celda, backgroundColor: "#ccc" }}>
                            <Text style={styles.negrita}>
                                Cédula de identidad
                            </Text>
                        </View>
                        <View style={{ width: "15%", ...styles.celda, backgroundColor: "#ccc" }}>
                            <Text style={styles.negrita}>
                                Aceptado
                            </Text>
                        </View>
                    </View>
                    {
                        Participantes.map((value, i) => (
                            <View key={value.id} style={{
                                display: 'flex', flexDirection: 'row'
                            }}>
                                <View style={{ width: "8%", ...styles.celda }}>
                                    <Text style={styles.normal}>
                                        {i + 1}
                                    </Text>
                                </View>
                                <View style={{ width: "32%", ...styles.celda }}>
                                    <Text style={styles.normal}>
                                        {value.nombre_completo.toUpperCase()}
                                    </Text>
                                </View>
                                <View style={{ width: "22.5%", ...styles.celda }}>
                                    <Text style={styles.normal}>
                                        {value.ru}
                                    </Text>
                                </View>
                                <View style={{ width: "22.5%", ...styles.celda }}>
                                    <Text style={styles.normal}>
                                        {value.ci}
                                    </Text>
                                </View>
                                <View style={{ width: "15%", ...styles.celda }}>
                                    <Text style={styles.normal}>
                                        {
                                            value.aceptado ? 'Sí' : 'A la espera'
                                        }
                                    </Text>
                                </View>
                            </View>
                        ))
                    }
                </View>
            </Page>
        </Document>
    );
}
export default ParticipantesPDF;

