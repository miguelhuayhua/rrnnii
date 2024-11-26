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
    { continente: 'América del Norte', continenteAbrev: 'NA', pais: 'Estados Unidos', value: 'US', codigoTelefono: '1' },
    { continente: 'América del Norte', continenteAbrev: 'NA', pais: 'Canadá', value: 'CA', codigoTelefono: '1' },
    { continente: 'América del Norte', continenteAbrev: 'NA', pais: 'México', value: 'MX', codigoTelefono: '52' },
    { continente: 'América del Norte', continenteAbrev: 'NA', pais: 'Cuba', value: 'CU', codigoTelefono: '53' },
    { continente: 'América del Norte', continenteAbrev: 'NA', pais: 'Puerto Rico', value: 'PR', codigoTelefono: '1' },
    { continente: 'América del Norte', continenteAbrev: 'NA', pais: 'Honduras', value: 'HN', codigoTelefono: '504' },
    { continente: 'América del Norte', continenteAbrev: 'NA', pais: 'Guatemala', value: 'GT', codigoTelefono: '502' },
    { continente: 'América del Sur', continenteAbrev: 'SA', pais: 'Argentina', value: 'AR', codigoTelefono: '54' },
    { continente: 'América del Sur', continenteAbrev: 'SA', pais: 'Brasil', value: 'BR', codigoTelefono: '55' },
    { continente: 'América del Sur', continenteAbrev: 'SA', pais: 'Chile', value: 'CL', codigoTelefono: '56' },
    { continente: 'América del Sur', continenteAbrev: 'SA', pais: 'Perú', value: 'PE', codigoTelefono: '51' },
    { continente: 'América del Sur', continenteAbrev: 'SA', pais: 'Colombia', value: 'CO', codigoTelefono: '57' },
    { continente: 'América del Sur', continenteAbrev: 'SA', pais: 'Venezuela', value: 'VE', codigoTelefono: '58' },
    { continente: 'América del Sur', continenteAbrev: 'SA', pais: 'Paraguay', value: 'PY', codigoTelefono: '595' },
    { continente: 'América del Sur', continenteAbrev: 'SA', pais: 'Uruguay', value: 'UY', codigoTelefono: '598' },
    { continente: 'América del Sur', continenteAbrev: 'SA', pais: 'Ecuador', value: 'EC', codigoTelefono: '593' },
    { continente: 'América del Sur', continenteAbrev: 'SA', pais: 'Bolivia', value: 'BO', codigoTelefono: '591' },
    { continente: 'Europa', continenteAbrev: 'EU', pais: 'Alemania', value: 'DE', codigoTelefono: '49' },
    { continente: 'Europa', continenteAbrev: 'EU', pais: 'Francia', value: 'FR', codigoTelefono: '33' },
    { continente: 'Europa', continenteAbrev: 'EU', pais: 'Italia', value: 'IT', codigoTelefono: '39' },
    { continente: 'Europa', continenteAbrev: 'EU', pais: 'España', value: 'ES', codigoTelefono: '34' },
    { continente: 'Europa', continenteAbrev: 'EU', pais: 'Reino Unido', value: 'GB', codigoTelefono: '44' },
    { continente: 'Europa', continenteAbrev: 'EU', pais: 'Portugal', value: 'PT', codigoTelefono: '351' },
    { continente: 'Europa', continenteAbrev: 'EU', pais: 'Países Bajos', value: 'NL', codigoTelefono: '31' },
    { continente: 'Europa', continenteAbrev: 'EU', pais: 'Suiza', value: 'CH', codigoTelefono: '41' },
    { continente: 'Europa', continenteAbrev: 'EU', pais: 'Suecia', value: 'SE', codigoTelefono: '46' },
    { continente: 'Europa', continenteAbrev: 'EU', pais: 'Noruega', value: 'NO', codigoTelefono: '47' },
    { continente: 'África', continenteAbrev: 'AF', pais: 'Sudáfrica', value: 'ZA', codigoTelefono: '27' },
    { continente: 'África', continenteAbrev: 'AF', pais: 'Nigeria', value: 'NG', codigoTelefono: '234' },
    { continente: 'África', continenteAbrev: 'AF', pais: 'Egipto', value: 'EG', codigoTelefono: '20' },
    { continente: 'África', continenteAbrev: 'AF', pais: 'Kenia', value: 'KE', codigoTelefono: '254' },
    { continente: 'África', continenteAbrev: 'AF', pais: 'Marruecos', value: 'MA', codigoTelefono: '212' },
    { continente: 'África', continenteAbrev: 'AF', pais: 'Ghana', value: 'GH', codigoTelefono: '233' },
    { continente: 'África', continenteAbrev: 'AF', pais: 'Etiopía', value: 'ET', codigoTelefono: '251' },
    { continente: 'África', continenteAbrev: 'AF', pais: 'Angola', value: 'AO', codigoTelefono: '244' },
    { continente: 'África', continenteAbrev: 'AF', pais: 'Túnez', value: 'TN', codigoTelefono: '216' },
    { continente: 'África', continenteAbrev: 'AF', pais: 'Argelia', value: 'DZ', codigoTelefono: '213' },
    { continente: 'Oceanía', continenteAbrev: 'OC', pais: 'Australia', value: 'AU', codigoTelefono: '61' },
    { continente: 'Oceanía', continenteAbrev: 'OC', pais: 'Nueva Zelanda', value: 'NZ', codigoTelefono: '64' },
    { continente: 'Oceanía', continenteAbrev: 'OC', pais: 'Fiyi', value: 'FJ', codigoTelefono: '679' },
    { continente: 'Oceanía', continenteAbrev: 'OC', pais: 'Papúa Nueva Guinea', value: 'PG', codigoTelefono: '675' },
    { continente: 'Oceanía', continenteAbrev: 'OC', pais: 'Samoa', value: 'WS', codigoTelefono: '685' },
    { continente: 'Oceanía', continenteAbrev: 'OC', pais: 'Tonga', value: 'TO', codigoTelefono: '676' },
    { continente: 'Asia', continenteAbrev: 'AS', pais: 'China', value: 'CN', codigoTelefono: '86' },
    { continente: 'Asia', continenteAbrev: 'AS', pais: 'Japón', value: 'JP', codigoTelefono: '81' },
    { continente: 'Asia', continenteAbrev: 'AS', pais: 'India', value: 'IN', codigoTelefono: '91' },
    { continente: 'Asia', continenteAbrev: 'AS', pais: 'Corea del Sur', value: 'KR', codigoTelefono: '82' },
    { continente: 'Asia', continenteAbrev: 'AS', pais: 'Tailandia', value: 'TH', codigoTelefono: '66' },
    { continente: 'Asia', continenteAbrev: 'AS', pais: 'Vietnam', value: 'VN', codigoTelefono: '84' },
    { continente: 'Asia', continenteAbrev: 'AS', pais: 'Filipinas', value: 'PH', codigoTelefono: '63' },
    { continente: 'Asia', continenteAbrev: 'AS', pais: 'Indonesia', value: 'ID', codigoTelefono: '62' },
    { continente: 'Asia', continenteAbrev: 'AS', pais: 'Malasia', value: 'MY', codigoTelefono: '60' },
    { continente: 'Asia', continenteAbrev: 'AS', pais: 'Pakistán', value: 'PK', codigoTelefono: '92' },
    { continente: 'Asia', continenteAbrev: 'AS', pais: 'Rusia', value: 'RU', codigoTelefono: '7' },
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