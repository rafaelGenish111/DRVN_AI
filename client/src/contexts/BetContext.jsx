import { createContext } from 'react';

const BetContext = createContext({
    openPopup: false,
    betAmount: null,
    betOption: null,
    setOpenPopup: () => {},
    setBetAmount: () => {}, 
    setBetOption: () => {}
})

export default BetContext;