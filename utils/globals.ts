const domain = 'http://localhost:3000';
const fileDomain = 'http://localhost:4000';

function makeid(size: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < size) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
const paises = [
    { continente: 'América del Norte', continenteAbrev: 'NA', pais: 'Estados Unidos', value: 'US' },
    { continente: 'América del Norte', continenteAbrev: 'NA', pais: 'Canadá', value: 'CA' },
    { continente: 'América del Norte', continenteAbrev: 'NA', pais: 'México', value: 'MX' },
    { continente: 'América del Norte', continenteAbrev: 'NA', pais: 'Cuba', value: 'CU' },
    { continente: 'América del Norte', continenteAbrev: 'NA', pais: 'Puerto Rico', value: 'PR' },
    { continente: 'América del Norte', continenteAbrev: 'NA', pais: 'Honduras', value: 'HN' },
    { continente: 'América del Norte', continenteAbrev: 'NA', pais: 'Guatemala', value: 'GT' },
    { continente: 'América del Sur', continenteAbrev: 'SA', pais: 'Argentina', value: 'AR' },
    { continente: 'América del Sur', continenteAbrev: 'SA', pais: 'Brasil', value: 'BR' },
    { continente: 'América del Sur', continenteAbrev: 'SA', pais: 'Chile', value: 'CL' },
    { continente: 'América del Sur', continenteAbrev: 'SA', pais: 'Perú', value: 'PE' },
    { continente: 'América del Sur', continenteAbrev: 'SA', pais: 'Colombia', value: 'CO' },
    { continente: 'América del Sur', continenteAbrev: 'SA', pais: 'Venezuela', value: 'VE' },
    { continente: 'América del Sur', continenteAbrev: 'SA', pais: 'Paraguay', value: 'PY' },
    { continente: 'América del Sur', continenteAbrev: 'SA', pais: 'Uruguay', value: 'UY' },
    { continente: 'América del Sur', continenteAbrev: 'SA', pais: 'Ecuador', value: 'EC' },
    { continente: 'América del Sur', continenteAbrev: 'SA', pais: 'Bolivia', value: 'BO' },
    { continente: 'Europa', continenteAbrev: 'EU', pais: 'Alemania', value: 'DE' },
    { continente: 'Europa', continenteAbrev: 'EU', pais: 'Francia', value: 'FR' },
    { continente: 'Europa', continenteAbrev: 'EU', pais: 'Italia', value: 'IT' },
    { continente: 'Europa', continenteAbrev: 'EU', pais: 'España', value: 'ES' },
    { continente: 'Europa', continenteAbrev: 'EU', pais: 'Reino Unido', value: 'GB' },
    { continente: 'Europa', continenteAbrev: 'EU', pais: 'Portugal', value: 'PT' },
    { continente: 'Europa', continenteAbrev: 'EU', pais: 'Países Bajos', value: 'NL' },
    { continente: 'Europa', continenteAbrev: 'EU', pais: 'Suiza', value: 'CH' },
    { continente: 'Europa', continenteAbrev: 'EU', pais: 'Suecia', value: 'SE' },
    { continente: 'Europa', continenteAbrev: 'EU', pais: 'Noruega', value: 'NO' },
    { continente: 'África', continenteAbrev: 'AF', pais: 'Sudáfrica', value: 'ZA' },
    { continente: 'África', continenteAbrev: 'AF', pais: 'Nigeria', value: 'NG' },
    { continente: 'África', continenteAbrev: 'AF', pais: 'Egipto', value: 'EG' },
    { continente: 'África', continenteAbrev: 'AF', pais: 'Kenia', value: 'KE' },
    { continente: 'África', continenteAbrev: 'AF', pais: 'Marruecos', value: 'MA' },
    { continente: 'África', continenteAbrev: 'AF', pais: 'Ghana', value: 'GH' },
    { continente: 'África', continenteAbrev: 'AF', pais: 'Etiopía', value: 'ET' },
    { continente: 'África', continenteAbrev: 'AF', pais: 'Angola', value: 'AO' },
    { continente: 'África', continenteAbrev: 'AF', pais: 'Túnez', value: 'TN' },
    { continente: 'África', continenteAbrev: 'AF', pais: 'Argelia', value: 'DZ' },
    { continente: 'Oceanía', continenteAbrev: 'OC', pais: 'Australia', value: 'AU' },
    { continente: 'Oceanía', continenteAbrev: 'OC', pais: 'Nueva Zelanda', value: 'NZ' },
    { continente: 'Oceanía', continenteAbrev: 'OC', pais: 'Fiyi', value: 'FJ' },
    { continente: 'Oceanía', continenteAbrev: 'OC', pais: 'Papúa Nueva Guinea', value: 'PG' },
    { continente: 'Oceanía', continenteAbrev: 'OC', pais: 'Samoa', value: 'WS' },
    { continente: 'Oceanía', continenteAbrev: 'OC', pais: 'Tonga', value: 'TO' },
    { continente: 'Asia', continenteAbrev: 'AS', pais: 'China', value: 'CN' },
    { continente: 'Asia', continenteAbrev: 'AS', pais: 'Japón', value: 'JP' },
    { continente: 'Asia', continenteAbrev: 'AS', pais: 'India', value: 'IN' },
    { continente: 'Asia', continenteAbrev: 'AS', pais: 'Corea del Sur', value: 'KR' },
    { continente: 'Asia', continenteAbrev: 'AS', pais: 'Tailandia', value: 'TH' },
    { continente: 'Asia', continenteAbrev: 'AS', pais: 'Vietnam', value: 'VN' },
    { continente: 'Asia', continenteAbrev: 'AS', pais: 'Filipinas', value: 'PH' },
    { continente: 'Asia', continenteAbrev: 'AS', pais: 'Indonesia', value: 'ID' },
    { continente: 'Asia', continenteAbrev: 'AS', pais: 'Malasia', value: 'MY' },
    { continente: 'Asia', continenteAbrev: 'AS', pais: 'Pakistán', value: 'PK' },
    { continente: 'Asia', continenteAbrev: 'AS', pais: 'Rusia', value: 'RU' }
];
const continentes = [
    { value: 'na', label: 'América Norte', image: '/assets/america-norte.png' },
    { value: 'sa', label: 'América Sur', image: '/assets/america-sur.png' },
    { value: 'as', label: 'Asia', image: '/assets/asia.png' },
    { value: 'eu', label: 'Europa', image: '/assets/europa.png' },
    { value: 'af', label: 'África', image: '/assets/africa.png' },
    { value: 'oc', label: 'Oceanía', image: '/assets/oceania.png' },
];

export { domain, fileDomain, paises, makeid, continentes };