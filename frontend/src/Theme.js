import { extendTheme } from "@chakra-ui/react"
import '@fontsource-variable/inter';

{/* Importing Inter Variable font from fontsource */}
const Theme = extendTheme({
    fonts: {
        body: `"Inter Variable", sans-serif`,
        heading: `"Inter Variable", sans-serif`,
    }
}) 

export default Theme