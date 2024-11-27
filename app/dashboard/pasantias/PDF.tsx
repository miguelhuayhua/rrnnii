import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Link } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { Institucion, Pasantia } from '@prisma/client';

dayjs.locale('es');

const styles = StyleSheet.create({
    negrita: {
        fontSize: 11,
        color: '#212121',
        fontFamily: 'Helvetica-Bold',
        textAlign: 'center',
    },
    normal: {
        fontSize: 11,
        fontFamily: 'Helvetica',
        textAlign: 'center',
    },
    celda: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        borderBottom: '1px solid #212121',
        borderLeft: '1px solid #212121',
    },
});

interface Props {
    Pasantias: (Pasantia & { Institucion: Institucion })[];
    modo: string;
}

const PasantiasPDF = ({ Pasantias, modo }: Props) => {
    return (
        <Document
            author="rrnnii"
            creationDate={new Date()}
            language="es"
            creator="rrnnii"
        >
            <Page size="LETTER" style={{ padding: 25 }} orientation="landscape">
                <Image
                    fixed
                    src="/logorrnnii.png"
                    style={{
                        position: 'absolute',
                        left: "33%", right: 0, top: "33%", bottom: 0,
                        margin: 'auto',
                        width: 260,
                        height: 260,
                        opacity: 0.05,
                    }}
                />
                <View style={{ display: 'flex', justifyContent: 'center', width: "100%" }}>
                    <Image fixed src="/cabecera.png" style={{ width: "80%", height: 70, marginLeft: 70 }} />
                </View>
                <View fixed style={{
                    display: 'flex', flexDirection: 'row',
                    borderTop: '1px solid #212121', borderRight: "1px solid #212121",
                    marginTop: 20,
                }}>
                    <View style={{ ...styles.celda, width: "70%", paddingHorizontal: 20 }}>
                        <Text style={{ ...styles.negrita, fontSize: 14 }}>
                            Listado de Pasantías {modo == 'todo' ? '(Todas las Pasantías)' :
                                modo == 'activo' ? '(Pasantías activas)' :
                                    modo == 'inactivo' ? '(Pasantías inactivas)' :
                                        modo == 'concluido' ? '(Pasantías concluidas)' :
                                            '(Pasantías vigentes)'}
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
                    {/* Encabezados */}
                    <View style={{
                        display: 'flex', flexDirection: 'row',
                    }}>
                        <View style={{ width: "5%", ...styles.celda, backgroundColor: '#ccc' }}>
                            <Text style={styles.negrita}>Nro.</Text>
                        </View>
                        <View style={{ width: "18%", ...styles.celda, backgroundColor: '#ccc' }}>
                            <Text style={styles.negrita}>Título</Text>
                        </View>
                        <View style={{ width: "17%", ...styles.celda, backgroundColor: '#ccc' }}>
                            <Text style={styles.negrita}>Descripción Corta</Text>
                        </View>
                        <View style={{ width: "10%", ...styles.celda, backgroundColor: '#ccc' }}>
                            <Text style={styles.negrita}>Modalidad</Text>
                        </View>
                        <View style={{ width: "7%", ...styles.celda, backgroundColor: '#ccc' }}>
                            <Text style={styles.negrita}>Estado</Text>
                        </View>
                        <View style={{ width: "10%", ...styles.celda, backgroundColor: '#ccc' }}>
                            <Text style={styles.negrita}>Fecha de Finalización</Text>
                        </View>
                        <View style={{ width: "10%", ...styles.celda, backgroundColor: '#ccc' }}>
                            <Text style={styles.negrita}>Institución</Text>
                        </View>
                        <View style={{ width: "23%", ...styles.celda, backgroundColor: '#ccc' }}>
                            <Text style={styles.negrita}>Enlace</Text>
                        </View>
                    </View>

                    {/* Contenido Dinámico */}
                    {Pasantias.map((row, i) => (
                        <View key={row.id} style={{ display: 'flex', flexDirection: 'row' }}>
                            <View style={{ width: "5%", ...styles.celda }}>
                                <Text style={styles.normal}>{i + 1}</Text>
                            </View>
                            <View style={{ width: "18%", ...styles.celda }}>
                                <Text style={styles.normal}>{row.titulo}</Text>
                            </View>
                            <View style={{ width: "17%", ...styles.celda }}>
                                <Text style={styles.normal}>{row.descripcionCorta}</Text>
                            </View>
                            <View style={{ width: "10%", ...styles.celda }}>
                                <Text style={styles.normal}>
                                    {row.modalidad === 'more' ? 'Más de 6 meses' : `${row.modalidad} meses`}
                                </Text>
                            </View>
                            <View style={{ width: "7%", ...styles.celda }}>
                                <Text style={styles.normal}>
                                    {row.estado ? "Activo" : "Inactivo"}
                                </Text>
                            </View>
                            <View style={{ width: "10%", ...styles.celda }}>
                                <Text style={styles.normal}>
                                    {row.finalizacion}
                                </Text>
                            </View>
                            <View style={{ width: "10%", ...styles.celda }}>
                                <Text style={styles.normal}>
                                    {row.Institucion?.nombre || "Sin institución"}
                                </Text>
                            </View>
                            <View style={{ width: "23%", ...styles.celda }}>
                                <Link href={`https://rrnnii.upea.bo/pasantias/${row.id}`} style={styles.normal}>
                                    {`https://rrnnii.upea.bo/pasantias/${row.id}`}
                                </Link>
                            </View>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
};

export default PasantiasPDF;
