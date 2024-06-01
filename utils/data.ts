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

export { parseNumber, parsePhone, toUpperCase, filtrarValorEnArray };