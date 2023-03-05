export const globalCSS = {
    // Theme cannot be disabled with classes so we disable it here and set the config on styles.global
    components: {
        Button: {
            baseStyle: {
                fontWeight: '',
                borderRadius: 'full',
            },
            defaultProps: {
                colorScheme: '',
                size: '',
            },
        },
        Modal: {
            baseStyle: {
                dialogContainer: {
                    '@supports(height: -webkit-fill-available)': {},
                },
            },
        },
        Table: {
            baseStyle: {
                td: {
                    textAlign: 'center',
                },
                th: {
                    textAlign: 'center',
                },
            },
        },
    },
    semanticTokens: {
        colors: {
            'chakra-body-bg': {
                _light: '#02040F',
            },
            'chakra-body-text': {
                _light: '#F6F8FF',
            },
        },
    },
    // Change custom chakra css, see notation @see{https://chakra-ui.com/docs/styled-system/css-variables}
    shadows: {
        outline: 'none',
    },
    styles: {
        global: {
            '.column-short': {
                padding: '16px 0 !important',
                width: '10% !important',
            },
            'html, body': {
                color: '#F6F8FF',
                background: '#02040F',
                padding: 0,
                margin: 0,
                position: 'auto',
                fontFamily:
                    'Calibre,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
            },
            'input, textarea, button, select, a': {
                WebkitTapHighlightColor: 'transparent',
            },
            a: {
                textDecoration: 'none',
            },
            button: {
                border: '1px solid #2d2d2d',
                padding: '8px 22px',
                background: 'transparent',
                fontWeight: 'bold',
            },
            '.chakra-alert > button': {
                border: '1px solid white',
            },
            '@media only screen and (min-width: 1025px)': {
                'button:hover': {
                    border: '1px solid white',
                },
            },
            '.remove-scrollbar::-webkit-scrollbar': {
                display: 'none',
            },
            '@media only screen and (min-width: 1025px)': {
                '.hover-link:hover': {
                    textDecoration: 'underline',
                },
            },
        },
    },
};
//blueish black background #00070f
