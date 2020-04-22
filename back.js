const express = require('express')
const path = require('path')
const routes = require('express').Router()
const Sequelize = require('sequelize')

//MODEL
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'storage.sqlite'
})

const Text = sequelize.define('text', {
    text: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

sequelize.sync()

//CONTROLLER
function AppController() {

    this.middlewares = () => {
        this.app.use(express.static(path.join(__dirname)))
        this.app.use(express.json())
        this.app.use((req, res, next) => {
            console.log(`Access ${req.url} at ${new Date().toISOString()}`)
            next()
        })
    }

    this.routes = () => {
        routes.get('/', (req, res) => {
            res.sendFile(path.join(__dirname + '/index.html'));
        })
        routes.get('/list', listText)
        routes.post('/create', createText)
        routes.delete('/delete/:id', deleteText)
        this.app.use(routes)
    }

    this.app = express()
    this.middlewares()
    this.routes()
}

//CRUD
listText = async (req, res) => {
    return res.json(await Text.findAll({ raw: true }))
}

createText = async (req, res) => {
    const { text } = req.body
    console.log("iu", text)
    return text ? res.json(await Text.create({ text })) : res.json({ message: "text cannot be null" })
}

deleteText = async (req, res) => {
    const id = req.params.id
    return res.json(await Text.destroy({ where: { id } }))
}

//RUN SERVER
new AppController().app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running...')
})