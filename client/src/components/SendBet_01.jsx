import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client';


export default function SendBet() {
    const [betData, setBetData] = useState(null) // data recived from the server
    const [socket, setSocket] = useState(null) // make socket global
    const [selectedAmount, setsSelectedAmount] = useState(null) // selected amount button design
    const [selectedOption, setSelectedOption] = useState(null) // selected option button design
    const [betAmount, setBetAmount] = useState(null) // selected bet amount
    const [betOption, setBetOption] = useState(null) // selected bet option
    const [timeRemaining, setTimeRemaining] = useState(8) // timebar 
    const [progress, setProgress] = useState(100) // timebar design

    // amount options
    const amounts = [1, 2, 3, 4, 5]

    useEffect(() => {
        const socket = io('http://lofalhost:3000')
        setSocket(socket)

        socket.on('data', (initData) => {
            setBetData(initData)
        })

        return () => {

        }
    }, [])

    // timebar 
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeRemaining(timeRemaining - 0.08)
            setProgress((progress) => progress - 1)
            if (timeRemaining === 0) {
                clearInterval(interval)
            }
        }, 80);

        return () => {
            clearInterval(interval)
        }
    }, [timeRemaining])


    const handleConfirm = async (e) => {
        e.preventDefauld()
        try {
            const data = {
                lineID: betData.id,
                amount: betAmount,
                option: betOption
            }

            socket.emit('sendBet', data)
        } catch (error) {

        }
    }

    return (
        <div className='modal'>
            <form onSubmit={handleConfirm}>
                <div className='modal-content'>
                    <div className='timebar'>
                        <div className='progress' style={{ width: `${progress}%` }}></div>
                    </div>
                    <h2>{betData.line_type_name}</h2>
                    <p>{betData.line_question}</p>
                    <div className='amount-options'>
                        {amounts.map((amount) => (
                            <button
                                key={amount}
                                onClick={() => {
                                    setsSelectedAmount(amount)
                                    setBetAmount(amount)
                                }}
                                className={selectedAmount === amount ? 'selected-amount' : ''}
                            >
                                {amount} $
                            </button>
                        ))}
                    </div>
                    <div className='options'>
                        {betData.odds.map((option) => (
                            <button
                                key={option}
                                onClick={() => {
                                    setSelectedOption(option)
                                    setBetOption(option)
                                }}
                                className={selectedOption === option ? 'selected-option' : ''}
                            >
                                {`${option.description} ${option.value}`}
                            </button>
                        ))}
                    </div>
                    <div>
                        <button type='submit'></button>
                    </div>
                </div>
            </form>
        </div>
    )
}
