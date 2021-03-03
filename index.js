const express = require('express')
const fs = require('fs')
const { resolve } = require('path')

const app = express()

app.get('/', (req, res) => {
    return res.sendFile(__dirname + '/index.html')
})

app.get('/stream', (req, res) => {

    const range = req.headers.range
    const songPath = resolve(__dirname, 'video', 'video.mp4')

    /**
     * pegar o tamanho do arquivo, 
     * pois quando trabalhamos com stream
     * é interessante que façamos a leitura
     *  do nosso arquivo em pedaços
     *  */

    const songSize = fs.statSync(songPath).size

    const start = Number(range.replace(/\D/g, ''))

    const CHUNK_SIZE = 10000
    const end = Math.min(start + CHUNK_SIZE, songSize - 1)

    const headers = {
        'Content-Range': `bytes ${start}-${end}/${songSize}`,
        'Accept-Ranges': 'bytes',
        'Content-type': 'video/mp4'
    }

    res.writeHead(206, headers)

    const songStream = fs.createReadStream(songPath, { start, end })

    songStream.pipe(res)
})

app.listen(3334)