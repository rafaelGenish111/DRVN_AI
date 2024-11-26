const express = require('express');
const cors = require('cors');
const app = express()
app.use(cors())
const redis = require('redis');
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3001'
    }
})
const client = redis.createClient({

})

client.connect()
    .then(() => console.log('connect to Redis!'))
    .catch(error => console.error('connection error: ', error))

    console.log('Redis client object:', client);
    console.log('Available methods in Redis client:', Object.keys(client));
    
let currentLine = ''

io.on("connection", (socket) => {
    console.log("connection to socket");
})

const getDataFromWebhook = async () => {
    try {
        const line = await fetch('webhook')
        const data = await line.json()
        currentLine = data

        await client.set(data.id, JSON.stringify(data))
        socket.emit('data', data)
        console.log('data fetched and stored on Redis!');
    } catch (error) {
        console.error('error fetching data from API: ', error)
    }
}

const lineResultRequest = async () => {
    const recivedData = socket.on('sendBet', (data) => {
    const data = recivedData.json()
    })
    try {
        await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization:': '26(+(ui007hvavi^4ii_4a%n&!9^1h5lmdyy&ybu359bx6#f)1'
            },
            body: JSON.stringify(data)
        })
        return console.log('line results have been sended!')
    } catch (error) {
        console.error('error sending results: ', error)
    }
}

const checkIfLineOpen = async (key) => {
    try {
        const selectedLine = await client.get(key)
        // close bet return true, open return false
        if (selectedLine && selectedLine.action === 'close') {
            await client.set(`closed_${key}`, selectedLine.result_code) // ?
            await client.del(key)
        } else {
            return false
        }
    } catch (error) {
        console.error('error: ', error)
    }
}


app.get('/', (req, res) => {
    res.send("welcome")
})

app.post('/webhook/lines/', async (req, res) => {
    try {
        if (checkIfLineOpen(currentLine.id) === false) {
            await getDataFromWebhook()
            req.json("Received line: " + req.id
                + " match: " + req.home_team + " (home) " + " VS. " + req.away_team + " (away) "
                + " line action: " + req.action
                + " market: " + req.line_type
                + " line name: " + req.line_type_name
                + " question: " + req.line_question
                + " competition: " + req.competition
                + " odds: " + req.odds
            )
        } else {
            res.status(400).json({ err: true, msg: "line closed!" })
        }
    } catch (error) {
        console.error('error: ', error)
        res.status(500).json({ err: true, msg: "failed to fetch data" })
    }
})

app.post('/api/v1/line/result/', async (req, res) => {
    try {
        if (checkIfLineOpen(currentLine.id) === true) {
            const response = await lineResultRequest()
            res.status(200).json({err: false, response})
        } else {
            res.status(400).json({err: true, msg: "the line is steel open"})
        }
    } catch (error) {
        console.error('error: ', error)
        res.status(500).json({ err: true, msg: "failed to send data" })
    }
})

const port = process.env.PORT || 3000

server.listen(port, () => {
    console.log(`listening on port :${port}`);
})