const parseNumber = (value: any) => {
    return value ? isNaN(value) || value == 0 ?
        value.toString().substring(0, value.toString().length - 1)
        : value.toString() : ''
}
const parsePhone = (value: any) => {
    return value ? isNaN(value) || value == 0 || value == '.' || value.endsWith('.') ?
        value.toString().substring(0, value.toString().length - 1)
        : value.toString() : ''
}
function compartirEnlaceEnWhatsApp(url: string, mensaje: string) {
    const encodedMessage = encodeURIComponent(`${mensaje}\n${url}`);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}
const compartirEnFacebook = (url: string) => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank');
};

const compartirEnX = (url: string, mensaje: string) => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(mensaje)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
};

function parseLetter(input: string) {
    // Eliminamos cualquier carácter que no sea letra usando una expresión regular
    const letrasEspacios = input.replace(/[^a-zA-Z\s]/g, '');
    // Convertimos las letras a mayúsculas
    return letrasEspacios.toUpperCase();
}

const toUpperCase = (value: string) => {
    return value ? value.toUpperCase() : '';
}
function filtrarValorEnArray(array: any, valorBuscado: string) {
    let resultados: any[] = [];
    // Iterar sobre cada objeto en el array
    array.forEach((objeto: any) => {
        // Iterar sobre cada atributo del objeto
        for (let clave in objeto) {
            // Verificar si el valor del atributo no es un objeto
            if (clave != 'imagen' && clave != 'logo') {
                if (typeof objeto[clave] !== 'object' && objeto[clave].toString().toLowerCase().includes(valorBuscado.toLocaleLowerCase())) {
                    resultados.push(objeto); // Si el valor coincide, agregar al resultado
                    break; // Romper el bucle para pasar al siguiente objeto
                }
            }
        }
    });

    return resultados;
}


export {
    parseNumber,
    compartirEnlaceEnWhatsApp,
    compartirEnFacebook,
    compartirEnX,
    parsePhone, toUpperCase, filtrarValorEnArray, parseLetter
};