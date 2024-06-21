import { extendTheme } from "@chakra-ui/react"
import '@fontsource-variable/inter';

const Theme = extendTheme({
    fonts: {
        body: `"Inter Variable", sans-serif`,
        heading: `"Inter Variable", sans-serif`,
    }
}) 

export default Theme