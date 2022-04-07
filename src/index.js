const path = require('path')
const express = require('express')
const morgan = require('morgan')
const cors =require('cors')

const app = express()

app.set('port', process.env.PORT || 4000)

app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb'}))
app.use(cors())

app.listen(app.get('port'), ()=>{
    console.log('Server On Port ',app.get('port'))
})

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,'./Interfaz/index.html'))
})

//static files
app.use(express.static(path.join(__dirname, 'public')))