const express = require('express')
const morgan = require('morgan')

morgan.token('type', function (req, res) {
    return JSON.stringify(req.body)
})

const app = express()

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))


let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    console.log(persons)
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(
        `<div>
            Phonebook has info for ${persons.length} people<br>
             ${new Date()}
        </div>`
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const res = persons.find(p => p.id === id)

    res === undefined ? response.status(404).json({ error: 'Not found' }) : response.json(res)

})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    if (persons.find(p => p.id === id) !== undefined) {
        persons = persons.filter(p => p.id !== id)
        response.status(204).end()
    }

    return response.status(404).json({ error: `${id} not found` })

})


const randNumber = (min, max) => {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}


app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    if (persons.find(p => p.name === body.name) !== undefined) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: randNumber(1, 100),
        name: body.name,
        number: body.number
    }

    console.log(person)
    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`,)
}) 