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
    Noticias: any[];
    modo: string;
}

const NoticiasPDF = ({ Noticias, modo }: Props) => {
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
                            Listado de Noticias {modo === 'todo' ? '(Todas las Noticias)' :
                                modo === 'activo' ? '(Noticias Activas)' :
                                    '(Noticias Inactivas)'}
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
                        <View style={{ width: "35%", ...styles.celda, backgroundColor: '#ccc' }}>
                            <Text style={styles.negrita}>Título</Text>
                        </View>
                        <View style={{ width: "15%", ...styles.celda, backgroundColor: '#ccc' }}>
                            <Text style={styles.negrita}>Creado</Text>
                        </View>
                        <View style={{ width: "15%", ...styles.celda, backgroundColor: '#ccc' }}>
                            <Text style={styles.negrita}>Estado</Text>
                        </View>
                        <View style={{ width: "30%", ...styles.celda, backgroundColor: '#ccc' }}>
                            <Text style={styles.negrita}>Link</Text>
                        </View>
                    </View>

                    {/* Contenido Dinámico */}
                    {Noticias.map((noticia, i) => (
                        <View key={noticia.id} style={{ display: 'flex', flexDirection: 'row' }}>
                            <View style={{ width: "5%", ...styles.celda }}>
                                <Text style={styles.normal}>{i + 1}</Text>
                            </View>
                            <View style={{ width: "35%", ...styles.celda }}>
                                <Text style={styles.normal}>{noticia.titulo}</Text>
                            </View>
                            <View style={{ width: "15%", ...styles.celda }}>
                                <Text style={styles.normal}>
                                    {new Date(noticia.createdAt).toLocaleDateString('es-ES')}
                                </Text>
                            </View>
                            <View style={{ width: "15%", ...styles.celda }}>
                                <Text style={styles.normal}>
                                    {noticia.estado ? "Activo" : "Inactivo"}
                                </Text>
                            </View>
                           
                            <View style={{ width: "30%", ...styles.celda }}>
                                <Link 
                                    src={`https://rrnnii.upea.bo/noticias/${noticia.id}`} 
                                    style={{ fontSize: 9 }}
                                >
                                    {`https://rrnnii.upea.bo/noticias/${noticia.id}`}
                                </Link>
                            </View>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
};

export default NoticiasPDF;
