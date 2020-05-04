const path = require('path') 
const express = require('express')
const hbs = require('hbs')
const geoCode = require('./utils/geoCode')
const forecast = require('./utils/forecast')

const app = express()

// Define paths 
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handbars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

//app.com 
//app.com/help
//app.com/about
//app.com/weather

app.get('', (req,res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Rajvi Shah'
    })
})

app.get('/about', (req,res) => {
    res.render('about', {
        title: 'About',
        name: 'Rajvi Shah'
    })
})

app.get('/help', (req,res) => {
    res.render('help', {
        title: 'Help Page',
        msg: 'This is the help page for weather app.',
        name: 'Rajvi Shah'
    })
})

app.get('/weather', (req,res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geoCode (req.query.address, (error, {latitude, longitude, location}= {}) => {
        if (error) {
            return res.send({ error} )
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send( {error} )
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term.'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        msg: 'Help article not found.',
        name: 'Rajvi Shah'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        msg: 'Page not found.',
        name: 'Rajvi Shah'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})