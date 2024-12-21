const express = require('express')
var morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

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

//morgan methods
app.use(morgan('tiny'));
//app methods

app.get('/info', (request, response) => {
    console.log(response)
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
        <p>${Date()}</p>`);
})

app.get('/api/persons/', (request, response) => {
    response.json(persons) 
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person) 
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const getId = () => {
    const id = persons.length > 0
        ? Math.round(Math.random() * 10000)
        : 0
    return id
}

app.post("/api/persons", (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    } else if (persons.find((person => person.name === body.name))) {
        return response.status(401).json({
            error: 'name already exists'
        })
    }

    const person = {
        id: getId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person);
    response.json(person)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
