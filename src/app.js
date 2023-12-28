import __dirname from './utils.js'
import path from 'path'
import express from 'express'
import {engine} from 'express-handlebars'
import mongoose from 'mongoose'
import sessions from 'express-session'
import mongoStore from 'connect-mongo'
import passport from 'passport'
import initializePassport from './config/passport.config.js'

import { router as vistasRouter } from './routes/vistas.routes.js'
import { router as sessionRouter } from './routes/session.routes.js'

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({extended:true}))

// Conectar a la base de datos con Mongoose
app.use(sessions(
    {
        secret:"PremiuM89",
        resave: true, saveUninitialized:true,
        store: mongoStore.create(
            {
                mongoUrl:'mongodb+srv://Gabcisterna:PremiuM89@cluster0.4ar3f5n.mongodb.net/?retryWrites=true&w=majority',
                mongoOptions: {dbName:'sessions'},
                ttl:3600
            }
        )
    }
))

//Conectar las vistas 
app.engine('handlebars', engine({ allowProtoMethodsByDefault: true }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname,'/views'))

app.use(express.static(path.join(__dirname,'/public')))

//
initializePassport()

app.use(passport.initialize())
app.use(passport.session())

app.use('/', vistasRouter)
app.use('/api/sessions', sessionRouter)

const server= app.listen(PORT, ()=>{
    console.log(`Server escuchando en puerto ${PORT}`)
})

try {
    await mongoose.connect('mongodb+srv://Gabcisterna:PremiuM89@cluster0.4ar3f5n.mongodb.net/?retryWrites=true&w=majority',
    {dbName:'sessions'})
    console.log("DBonline...!!!")
} catch (error) {
    console.log(error.message)
}