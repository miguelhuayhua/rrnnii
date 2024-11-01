import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font, } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { Beca, ParticipanteBeca } from '@prisma/client';
dayjs.locale('es');
const styles = StyleSheet.create({
    negrita: {
        fontSize: 13,
        color: '#222'
    },
    titulo: {
        fontSize: 18,
        color: '#222'
    },
    normal: {
        fontSize: 13
    },
    textoInfo: {
        color: 'gray',
        fontSize: 11,
        marginVertical: 1
    },
});

interface Props {
    Participantes: ParticipanteBeca[],
    Beca: Beca
}
const MovimientosPDF = ({ Participantes, Beca }: Props) => {
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
                <Text style={{ ...styles.titulo, marginVertical: 10 }}>
                    Lista participantes a la beca {Beca.titulo}
                </Text>
                <Image fixed source='/light-mode.png' style={{ height: 25, width: 90, position: 'absolute', top: 10, right: 10 }} />
                <View style={{ display: 'flex', marginVertical: 20, flexDirection: 'row' }}>
                    <View style={{ width: "45%" }}>
                        <Text style={styles.negrita}>
                            Nombre completo
                        </Text>
                    </View>
                    <View style={{ width: "15%" }}>
                        <Text style={styles.negrita}>
                            Registro universitario
                        </Text>
                    </View>
                    <View style={{ width: "15%" }}>
                        <Text style={styles.negrita}>
                            Cédula de identidad
                        </Text>
                    </View>
                    <View style={{ width: "12.5%" }}>
                        <Text style={styles.negrita}>
                            Publicado
                        </Text>
                    </View>
                    <View style={{ width: "12.5%" }}>
                        <Text style={styles.negrita}>Aceptado</Text>
                    </View>
                </View>

                <Text style={{ position: 'absolute', bottom: 5, right: 5, fontSize: 10, color: '#888' }} render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed />
            </Page>
        </Document>
    );
}
export default MovimientosPDF;

