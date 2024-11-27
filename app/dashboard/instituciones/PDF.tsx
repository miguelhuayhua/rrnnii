import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Link } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    negrita: {
        fontSize: 11,
        color: '#212121',
        fontFamily: 'Helvetica-Bold',
        textAlign: 'center',
    },
    normal: {
        fontSize: 10,
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
    instituciones: any[];
    modo: string;
}

const InstitucionesPDF = ({ instituciones, modo }: Props) => {
    return (
        <Document
            author="rrnnii"
            creationDate={new Date()}
            language="es"
            creator="rrnnii"
        >
            <Page orientation='landscape' size="LETTER" style={{ padding: 25 }}>
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
                            Listado de Instituciones {modo == 'todo' ? '(Todas las instituciones)' :
                                modo == 'activo' ? '(Instituciones activas)' : '(Instituciones inactivas)'}
                        </Text>
                    </View>
                    <View style={{ ...styles.celda, width: "30%" }}>
                        <Text style={styles.negrita} render={({ pageNumber, totalPages }) => (
                            `Pág. ${pageNumber} de ${totalPages}`
                        )} />
                        <Text style={{ ...styles.normal, fontSize: 9 }}>
                            {new Date().toLocaleString('es-ES')}
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
                        <View style={{ width: "20%", ...styles.celda, backgroundColor: '#ccc' }}>
                            <Text style={styles.negrita}>Nombre</Text>
                        </View>
                        <View style={{ width: "10%", ...styles.celda, backgroundColor: '#ccc' }}>
                            <Text style={styles.negrita}>Estado</Text>
                        </View>
                        <View style={{ width: "15%", ...styles.celda, backgroundColor: '#ccc' }}>
                            <Text style={styles.negrita}>Ubicación</Text>
                        </View>
                        <View style={{ width: "10%", ...styles.celda, backgroundColor: '#ccc' }}>
                            <Text style={styles.negrita}>Contacto</Text>
                        </View>
                        <View style={{ width: "20%", ...styles.celda, backgroundColor: '#ccc' }}>
                            <Text style={styles.negrita}>Video</Text>
                        </View>
                        <View style={{ width: "20%", ...styles.celda, backgroundColor: '#ccc' }}>
                            <Text style={styles.negrita}>Web</Text>
                        </View>
                    </View>

                    {/* Contenido Dinámico */}
                    {instituciones.map((institucion, i) => (
                        <View key={institucion.id} style={{ display: 'flex', flexDirection: 'row' }}>
                            <View style={{ width: "5%", ...styles.celda }}>
                                <Text style={styles.normal}>{i + 1}</Text>
                            </View>
                            <View style={{ width: "20%", ...styles.celda }}>
                                <Text style={styles.normal}>{institucion.nombre}</Text>
                            </View>
                            <View style={{ width: "10%", ...styles.celda }}>
                                <Text style={styles.normal}>
                                    {institucion.estado ? "Activo" : "Inactivo"}
                                </Text>
                            </View>
                            <View style={{ width: "15%", ...styles.celda }}>
                                <Text style={styles.normal}>{institucion.ubicacion}</Text>
                            </View>
                            <View style={{ width: "10%", ...styles.celda }}>
                                <Text style={styles.normal}>{institucion.contacto || "Sin contacto"}</Text>
                            </View>
                            <View style={{ width: "20%", ...styles.celda }}>
                                <Link src={institucion.video || "#"} style={{ fontSize: 9 }}>
                                    {institucion.video ? institucion.video : "No disponible"}
                                </Link>
                            </View>
                            <View style={{ width: "20%", ...styles.celda }}>
                                <Link src={institucion.web || "#"} style={{ fontSize: 9 }}>
                                    {institucion.web ? institucion.web : "No disponible"}
                                </Link>
                            </View>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
};

export default InstitucionesPDF;
