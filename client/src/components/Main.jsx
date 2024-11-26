import React, { useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client';
import BetContext from '../contexts/BetContext';
import ThemeContext from '../contexts/ThemeContext';
import Popup from './Popup';


export default function Main() {
    const [openPopup, setOpenPopup] = useState(false) // if popup open
    const [betData, setBetData] = useState(null) // data recived from the server
    const [socket, setSocket] = useState(null) // make socket global
    const [betAmount, setBetAmount] = useState(null) // selected bet amount
    const [betOption, setBetOption] = useState(null) // selected bet option
    const [userID, setUserID] = useState(null) // userId recived by operator
    const [username, setUsername] = useState(null) // username recived by operator
    const theme = useContext(ThemeContext)

    useEffect(() => {
        const socket = io('http://lofalhost:3000')
        setSocket(socket)

        const urlParams = new URLSearchParams(window.location.search);
        setUsername(urlParams.get('username'));
        setUserID(urlParams.get('userid'));

        socket.on('data', (initData) => {
            setBetData(initData)
            setOpenPopup(true)
        })

        console.log({ username, userID })

        return () => {

        }
    }, [openPopup, userID, username])

    const handleConfirm = (e) => {
        e.preventDefauld()
        try {
            const data = {
                lineID: betData.id,
                amount: betAmount,
                option: betOption
            }

            socket.emit('sendBet', data)
            setOpenPopup(false)
        } catch (error) {

        }
    }

    return (
        <div
            className='main'
            style={{ backgroundColor: theme.color, fontFamily: theme.font, backgroundImage: 'url(https://aicontentfy.com/hubfs/Blog/e2f82ed6-4180-4648-9560-949a48793661.jpg)' }}
        >
            {
                userID ?
                    (<div>
                        <h1>hello {username}</h1>
                        <h3>, ID: {userID}</h3>
                    </div>
                    )
                    :
                    (<h1>Hello guest</h1>)
            }
            {openPopup ?
                (
                    <BetContext.Provider value={{ betAmount, setBetAmount, betOption, setBetOption }}>
                        <Popup handleConfirm={handleConfirm} open={openPopup} betData={betData} />
                    </BetContext.Provider>

                )
                :
                (<h1>Waiting for a new bet...</h1>)
            }
        </div>
    )
}
