import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { th } from 'vuetify/locale'

export const vuetify = createVuetify({
  locale: {
    locale: 'th',
    messages: { th },
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          background: '#1f1f1f',
          surface: '#2d2d2d',
          primary: '#ff2b12',
        },
      },
    },
  },
})
