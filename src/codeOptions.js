const codeOptions = [
    {
        id: 2,
        multiples: 1,
        text: `datamatrix small`,
        options: {
            bcid: "datamatrix",
            version: "48x48",
            format: "square",
        },
    },
    {
        id: 1,
        multiples: 1,
        text: `datamatrix medium`,
        options: {
            bcid: "datamatrix",
            version: "96x96",
            format: "square",
        },
    },
    {
        id: 2,
        multiples: 1,
        text: `datamatrix large square`,
        options: {
            bcid: "datamatrix",
            format: "square",
            version: "144x144",
        },
    },
    {
        id: 2,
        multiples: 1,
        text: `datamatrix large rect`,
        options: {
            bcid: "datamatrixrectangularextension",
            rotate: "R",
            version: "8x120",
            /* format: "rectangle",
            columns: 144,
            rows: 96, */
        },
    },
    {
        id: 2,
        multiples: 8,
        text: `datamatrix large multiple`,
        options: {
            bcid: "datamatrixrectangularextension",

            version: "8x120",
            /* format: "rectangle",
            columns: 144,
            rows: 96, */
        },
    },
    {
        id: 3,
        multiples: 1,
        text: `codablock large`,
        options: {
            bcid: "codablockf",
            version: "192x192",
            columns: 20,
            rows: 28,
            rowheight: 6,
            sepheight: 1,
            rotate: "R",
        },
    },
    {
        id: 5,
        multiples: 1,
        text: `Code One small`,
        options: {
            bcid: "codeone",
            version: "C",
        },
    },
    {
        id: 6,
        multiples: 1,
        text: `Code One large`,
        options: {
            bcid: "codeone",
            version: "H",
        },
    },
];

export default codeOptions