import React, { useContext, useEffect, useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Backdrop, Box, Grid2 } from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';
import TimerTwoToneIcon from '@mui/icons-material/TimerTwoTone';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import PopupContext from '../contexts/PopupContext';
import ThemeContext from '../contexts/ThemeContext';



export default function Popup({ betData, open, handleConfirm }) {
    const [timeRemaining, setTimeRemaining] = useState(100) // timebar 
    const [progress, setProgress] = useState(100) // timebar design
    const [selectedAmount, setsSelectedAmount] = useState(null) // selected amount button design
    const [selectedOption, setSelectedOption] = useState(null) // selected option button design
    const [color, setColor] = useState('green') // timebar color state
    const { setOpenPopup, setBetAmount, setBetOption } = useContext(PopupContext)
    const theme = useContext(ThemeContext)

    const changeColor = (progress) => {
        if (progress < 10) {
            setColor('red')
        } else if (progress < 40) {
            setColor('yellow')
        } else {
            setColor('green')
        }
    }

    // amount options
    const amounts = [1, 2, 3, 4, 5]

    // timebar 
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeRemaining(timeRemaining - 0.5)
            setProgress((prevProgress) => Math.max(0, prevProgress - 0.5));
            changeColor(progress);
            if (timeRemaining === 0) {
                setOpenPopup(false)
                clearInterval(interval)
            }
        }, 80);

        return () => {
            clearInterval(interval)
        }
    }, [setOpenPopup, progress, timeRemaining])

    const renderIcon = () => {
        switch (theme.icon) {
          case 'TimerIcon':
            return <TimerIcon />
          case 'TimerTwoToneIcon':
            return <TimerTwoToneIcon />
          case 'TimerOutlinedIcon':
            return <TimerOutlinedIcon />
          default:
            return null;
        }
      }

    return (
        <Dialog open={Boolean(open)} onClose={handleConfirm}>
            <Backdrop
                sx={{ color: '#000', zIndex: (theme) => theme.zIndex.drawer + 1, opacity: 0.8 }}
                open={open}
                onClick={handleConfirm}
            >
                {
                    betData ?
                        (
                            <div className='modal'
                                style={{ backgroundColor: theme.color, fontFamily: theme.font }}
                            >
                                <Box sx={{ display: 'flex', flexDirection: 'column', height: '400px' }}>
                                    <Grid2 container justifyContent="center" alignItems="left" sx={{ height: '50px' }}>
                                        <div className='timebar'>
                                            <Box
                                                sx={{
                                                    width: `${progress}%`,
                                                    backgroundColor: color,
                                                    transition: 'background-color 0.3s ease-in-out',
                                                }}
                                            />
                                            <div className='progress' style={{
                                                width: `${progress}%`,
                                                backgroundColor: color
                                            }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                                                    <div style={{ color: "black" }}>{renderIcon()}</div>
                                                </Box>
                                            </div>
                                        </div>
                                    </Grid2>
                                    <DialogTitle>
                                        <h2>{betData.line_type_name}</h2>
                                    </DialogTitle>
                                    <DialogContent>
                                        <div>
                                            <p>{betData.line_question}</p>
                                            <DialogActions>
                                                <div className='amount-options'>
                                                    {amounts.map((amount) => (
                                                        <Button
                                                            Ï key={amount}
                                                            onClick={() => {
                                                                setsSelectedAmount(amount)
                                                                setBetAmount(amount)
                                                            }}
                                                            className={selectedAmount === amount ? 'selected-amount' : ''}
                                                        >
                                                            {amount} $
                                                        </Button>
                                                    ))}
                                                </div>
                                            </DialogActions>
                                            <DialogActions>
                                                <div className='options'>
                                                    {betData.odds.map((option) => (
                                                        <Button
                                                            key={option}
                                                            onClick={() => {
                                                                setSelectedOption(option)
                                                                setBetOption(option)
                                                            }}
                                                            className={selectedOption === option ? 'selected-option' : ''}
                                                        >
                                                            {`${option.description} ${option.value}`}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </DialogActions>
                                            <Grid2 container justifyContent="right" alignItems="center">
                                                <DialogActions>
                                                    <Button
                                                        onClick={handleConfirm}
                                                        variant="contained" sx={{ mb: 2 }}
                                                    >
                                                        place bet {selectedAmount}
                                                    </Button>
                                                </DialogActions>
                                            </Grid2>
                                        </div>
                                    </DialogContent>
                                </Box>
                            </div>
                        )
                        :
                        (<h1>Wait for a new bet...</h1>)
                }
            </Backdrop>
        </Dialog>
    )
}
