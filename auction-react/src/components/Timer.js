import React from 'react';
import { Typography, Box } from '@mui/material';
import { purple, deepOrange } from '@mui/material/colors';

function Timer({ startDate, setIsAuctionStarted }) {
    const calculateTimeLeft = () => {
        let nowIST = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
        let startDateIST = new Date(new Date(`${startDate}T00:00:00`).toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));

        let difference = +startDateIST - +nowIST;
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = React.useState(calculateTimeLeft());

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
            if (Object.keys(timeLeft).length === 0) {
                setIsAuctionStarted(true);
            }
        }, 1000);
        return () => clearTimeout(timer);
    });

    if (Object.keys(timeLeft).length === 0) {
        // when the countdown is finished
        return null; // or display a default message here
    }

    return (
        <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
            <Box bgcolor="yellow" borderRadius={1} p={1}>
                <Typography variant="h5" sx={{color: deepOrange[500]}}>{timeLeft.days}</Typography>
                <Typography variant="body1">days</Typography>
            </Box>
            <Box bgcolor="yellow" borderRadius={1} p={1}>
                <Typography variant="h5" sx={{color: purple[500]}}>{timeLeft.hours}</Typography>
                <Typography variant="body1">hours</Typography>
            </Box>
            <Box bgcolor="yellow" borderRadius={1} p={1}>
                <Typography variant="h5" sx={{color: deepOrange[500]}}>{timeLeft.minutes}</Typography>
                <Typography variant="body1">minutes</Typography>
            </Box>
            <Box bgcolor="yellow" borderRadius={1} p={1}>
                <Typography variant="h5" sx={{color: purple[500]}}>{timeLeft.seconds}</Typography>
                <Typography variant="body1">seconds</Typography>
            </Box>
            <Typography variant="body1">To Start.</Typography>
        </Box>
    );
}

export default Timer;
