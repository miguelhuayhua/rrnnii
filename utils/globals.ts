const domain = 'http://localhost:3000';
const fileDomain = 'http://localhost:4000';

const paises = {
    americaNorte: [
        { pais: 'Estados Unidos', value: 'US' },
        { pais: 'Canadá', value: 'CA' },
        { pais: 'México', value: 'MX' },
        { pais: 'Cuba', value: 'CU' },
        { pais: 'Puerto Rico', value: 'PR' },
        { pais: 'Honduras', value: 'HN' },
        { pais: 'Guatemala', value: 'GT' }
    ],
    americaSur: [
        { pais: 'Argentina', value: 'AR' },
        { pais: 'Brasil', value: 'BR' },
        { pais: 'Chile', value: 'CL' },
        { pais: 'Perú', value: 'PE' },
        { pais: 'Colombia', value: 'CO' },
        { pais: 'Venezuela', value: 'VE' },
        { pais: 'Paraguay', value: 'PY' },
        { pais: 'Uruguay', value: 'UY' },
        { pais: 'Ecuador', value: 'EC' }
    ],
    europa: [
        { pais: 'Alemania', value: 'DE' },
        { pais: 'Francia', value: 'FR' },
        { pais: 'Italia', value: 'IT' },
        { pais: 'España', value: 'ES' },
        { pais: 'Reino Unido', value: 'GB' },
        { pais: 'Portugal', value: 'PT' },
        { pais: 'Países Bajos', value: 'NL' },
        { pais: 'Suiza', value: 'CH' },
        { pais: 'Suecia', value: 'SE' },
        { pais: 'Noruega', value: 'NO' },
    ],
    africa: [
        { pais: 'Sudáfrica', value: 'ZA' },
        { pais: 'Nigeria', value: 'NG' },
        { pais: 'Egipto', value: 'EG' },
        { pais: 'Kenia', value: 'KE' },
        { pais: 'Marruecos', value: 'MA' },
        { pais: 'Ghana', value: 'GH' },
        { pais: 'Etiopía', value: 'ET' },
        { pais: 'Angola', value: 'AO' },
        { pais: 'Túnez', value: 'TN' },
        { pais: 'Argelia', value: 'DZ' }
    ],
    oceania: [
        { pais: 'Australia', value: 'AU' },
        { pais: 'Nueva Zelanda', value: 'NZ' },
        { pais: 'Fiyi', value: 'FJ' },
        { pais: 'Papúa Nueva Guinea', value: 'PG' },
        { pais: 'Samoa', value: 'WS' },
        { pais: 'Tonga', value: 'TO' }
    ],
    asia: [
        { pais: 'China', value: 'CN' },
        { pais: 'Japón', value: 'JP' },
        { pais: 'India', value: 'IN' },
        { pais: 'Corea del Sur', value: 'KR' },
        { pais: 'Tailandia', value: 'TH' },
        { pais: 'Vietnam', value: 'VN' },
        { pais: 'Filipinas', value: 'PH' },
        { pais: 'Indonesia', value: 'ID' },
        { pais: 'Malasia', value: 'MY' },
        { pais: 'Pakistán', value: 'PK' },
        { pais: 'Rusia', value: 'RU' }

    ]
};


export { domain, fileDomain, paises };