import { createContext } from "react";


const ThemeContext = createContext({
    icon: "TimerIcon",
    color: "paleturquoise",
    font: "Arial, Helvetica, sans-serif"
})

export default ThemeContext