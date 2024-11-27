import React from 'react';
import { Page, Text, View, Document, StyleSheet, Link, Image } from '@react-pdf/renderer';
import { fileDomain } from '@/utils/globals';

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
    videos: any[];
    modo: string;
}

const VideosPDF = ({ videos, modo }: Props) => {
    return (
        <Document
            author="rrnnii"
            creationDate={new Date()}
            language="es"
            creator="rrnnii"
        >
            <Page size="LETTER" style={{ padding: 25 }}>
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
                <View style={{ display: 'flex', justifyContent: 'center', width: "100%" }}>
                    <Text style={{ ...styles.negrita, fontSize: 14 }}>
                        Listado de Videos {modo === 'todo' ? '(Todos los videos)' :
                            modo === 'activo' ? '(Videos activos)' : '(Videos inactivos)'}
                    </Text>
                </View>
                <View fixed style={{
                    display: 'flex', flexDirection: 'row',
                    borderTop: '1px solid #212121', borderRight: "1px solid #212121",
                    marginTop: 20,
                }}>
                    <View style={{ ...styles.celda, width: "70%", paddingHorizontal: 20 }}>
                        <Text style={{ ...styles.negrita, fontSize: 14 }}>
                            Listado de Videos
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
                        <View style={{ width: "30%", ...styles.celda, backgroundColor: '#ccc' }}>
                            <Text style={styles.negrita}>Título</Text>
                        </View>
                        <View style={{ width: "15%", ...styles.celda, backgroundColor: '#ccc' }}>
                            <Text style={styles.negrita}>Estado</Text>
                        </View>
                        <View style={{ width: "40%", ...styles.celda, backgroundColor: '#ccc' }}>
                            <Text style={styles.negrita}>Video</Text>
                        </View>
                        <View style={{ width: "10%", ...styles.celda, backgroundColor: '#ccc' }}>
                            <Text style={styles.negrita}>Vistas</Text>
                        </View>
                    </View>

                    {/* Contenido Dinámico */}
                    {videos.map((video, i) => (
                        <View key={video.id} style={{ display: 'flex', flexDirection: 'row' }}>
                            <View style={{ width: "5%", ...styles.celda }}>
                                <Text style={styles.normal}>{i + 1}</Text>
                            </View>
                            <View style={{ width: "30%", ...styles.celda }}>
                                <Text style={styles.normal}>{video.titulo}</Text>
                            </View>
                            <View style={{ width: "15%", ...styles.celda }}>
                                <Text style={styles.normal}>
                                    {video.estado ? "Activo" : "Inactivo"}
                                </Text>
                            </View>
                            <View style={{ width: "40%", ...styles.celda }}>
                                <Link src={fileDomain + video.video || "#"} style={{ fontSize: 9 }}>
                                    {video.video ? fileDomain + video.video : "No disponible"}
                                </Link>
                            </View>
                            <View style={{ width: "10%", ...styles.celda }}>
                                <Text style={styles.normal}>{video.conteo}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
};

export default VideosPDF;
