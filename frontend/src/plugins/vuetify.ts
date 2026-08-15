import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

import { createVuetify } from "vuetify";

export default createVuetify({
  theme: {
    defaultTheme: "dark",

    themes: {
      dark: {
        colors: {
          background: "#141414",
          surface: "#181818",
          primary: "#E50914",
        },
      },
    },
  },
});
