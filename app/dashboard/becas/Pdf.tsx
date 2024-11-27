import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Link } from '@react-pdf/renderer';
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
    Becas: (Beca & { Participantes: ParticipanteBeca[] })[],
    modo: string;
}
const BecaPDF = ({ Becas, modo }: Props) => {
    return (
        <Document author='rrnnii'
            creationDate={new Date()}
            language='es'
            creator='rrnnii'
        >
            <Page size="LETTER" style={{ padding: 25 }} orientation='landscape'>
                <Image fixed
                    src='/logorrnnii.png'
                    style={{
                        position: 'absolute',
                        left: "33%", right: 0, top: "33%", bottom: 0,
                        margin: 'auto',
                        width: 260,
                        height: 260,
                        opacity: 0.05
                    }} />
                <View style={{ display: 'flex', justifyContent: 'center', width: "100%" }}>
                    <Image fixed src='/cabecera.png' style={{ width: "80%", height: 70, marginLeft: 70 }} />
                </View>
                <View fixed style={{
                    display: 'flex', flexDirection: 'row',
                    borderTop: '1px solid #212121', borderRight: "1px solid #212121",
                    marginTop: 20
                }}>
                    <View style={{ ...styles.celda, width: "70%", paddingHorizontal: 20 }}>
                        <Text style={{ ...styles.negrita, fontSize: 14 }}>
                            Listado de Becas {modo == 'todo' ? '(Todas las becas)' :
                                modo == 'activo' ? '(Becas activas)' :
                                    modo == 'inactivo' ? '(Becas inactivas)' :
                                        modo == 'concluido' ? '(Becas concluídas)' :
                                            '(Becas Vigentes)'}
                        </Text>
                    </View>
                    <View style={{ ...styles.celda, width: "30%" }}>
                        <Text style={styles.negrita} render={({ pageNumber, totalPages }) => (
                            `Pág. ${pageNumber} de ${totalPages}`
                        )} />
                        <Text style={{ ...styles.normal, fontSize: 9 }}>
                            {dayjs().format('DD [de] MMMM [del] YYYY [a las] HH:mm:ss')}
                        </Text>
                    </View>
                </View>
                <View style={{
                    borderTop: '1px solid #212121',
                    borderRight: '1px solid #212121',
                }}>
                    <View style={{
                        display: 'flex', flexDirection: 'row',
                    }}>
                        <View style={{ width: "5%", ...styles.celda, backgroundColor: '#ccc' }}>
                            <Text style={styles.negrita}>
                                Nro.
                            </Text>
                        </View>
                        <View style={{ width: "25%", ...styles.celda, backgroundColor: '#ccc' }}>
                            <Text style={styles.negrita}>
                                Título de Beca
                            </Text>
                        </View>
                        <View style={{ width: "5%", ...styles.celda, backgroundColor: '#ccc' }}>
                            <Text style={styles.negrita}>
                                País
                            </Text>
                        </View>
                        <View style={{ width: "8%", ...styles.celda, backgroundColor: '#ccc' }}>
                            <Text style={styles.negrita}>
                                Participantes
                            </Text>
                        </View>
                        <View style={{ width: "17%", ...styles.celda, backgroundColor: "#ccc" }}>
                            <Text style={styles.negrita}>
                                Descripción Corta
                            </Text>
                        </View>
                        <View style={{ width: "15%", ...styles.celda, backgroundColor: "#ccc" }}>
                            <Text style={styles.negrita}>
                                Encargado
                            </Text>
                        </View>
                        <View style={{ width: "25%", ...styles.celda, backgroundColor: "#ccc" }}>
                            <Text style={styles.negrita}>
                                Enlace
                            </Text>
                        </View>
                    </View>
                    {
                        Becas.map((value, i) => (
                            <View key={value.id} style={{
                                display: 'flex', flexDirection: 'row'
                            }}>
                                <View style={{ width: "5%", ...styles.celda }}>
                                    <Text style={styles.normal}>
                                        {i + 1}
                                    </Text>
                                </View>
                                <View style={{ width: "25%", ...styles.celda }}>
                                    <Text style={styles.normal}>
                                        {value.titulo}
                                    </Text>
                                </View>
                                <View style={{ width: "5%", ...styles.celda }}>
                                    <Text style={styles.normal}>
                                        {value.pais}
                                    </Text>
                                </View>
                                <View style={{ width: "8%", ...styles.celda }}>
                                    <Text style={styles.normal}>
                                        {value.Participantes.length}
                                    </Text>
                                </View>
                                <View style={{ width: "17%", ...styles.celda }}>
                                    <Text style={styles.normal}>
                                        {value.descripcionCorta}
                                    </Text>
                                </View>
                                <View style={{ width: "15%", ...styles.celda }}>
                                    <Text style={styles.normal}>
                                        {value.encargado}
                                    </Text>
                                </View>
                                <View style={{ width: "25%", ...styles.celda }}>
                                    <Link href={`https://rrnnii.upea.bo/becas/${value.id}`} style={styles.normal}>
                                        {`https://rrnnii.upea.bo/becas/${value.id}`}
                                    </Link>
                                </View>
                            </View>
                        ))
                    }
                </View>
            </Page>
        </Document>
    );
}
export default BecaPDF;

