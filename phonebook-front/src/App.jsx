import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

const Filter = ({changeFunction}) => {
  return (
    <div>
      filter shown with <input onChange={changeFunction}/>
    </div>
  )
}

const PersonForm = ({handleSubmit, handleNameChange, handleNumberChange, newName, newNumber}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div> name: <input value={newName} onChange={handleNameChange}/> </div>
      <div> number: <input type="number" value={newNumber} onChange={handleNumberChange}/> </div>
      <div>
        <button type="submit" >add</button>
      </div>
    </form>
  )
}

const Persons = ({persons, newFilter, deletePerson}) => {
  return (
    <div>
      {/* Insensitive Case of Filter */}
      {persons.filter(number => 
        number.name.toLowerCase().includes(newFilter.toLowerCase())
      )
      .map(number => 
        <div key={number.id}>
          {/* Show names, numbers and delete button */}
          <h3 >{number.name} {number.number}</h3>
          <button onClick={() => deletePerson(number.id)}>Delete</button>
        </div>
      )}
    </div>
  )
}


const App = () => {

//Declaring const

  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [newMessage, setNewMessage] = useState(null)
  const [newErrorMessage, setNewErrorMessage] = useState(null) 

//functions

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response);
      });
  }, []);

  const handleSubmit = e => {

    e.preventDefault();

    const personInfo = {
      name: newName,
      number: newNumber
    }
    //if already exist someone with the same name
    if (persons.some((person) => person.name === newName)) {
      window.confirm(`${newName} is already added to phonebook, replace the old number with the new one?`);
      const person = persons.find((person) => person.name === newName);

      personService
        .update(person.id, personInfo)
        .then(response => {
          setPersons(persons.map(p => p.id === person.id ? response : p));
          setNewName('')
          setNewNumber('')
          setNewMessage(`The Number of ${newName} has been updated`)
          setTimeout(() => setNewMessage(null), 5000)
        })
        .catch(error => setNewErrorMessage(`The number of ${newName} was already deleted from server`))
    }
    //else create person
    else {
      personService
        .create(personInfo)
        .then(response => {
          setPersons(persons.concat(response))
          setNewName('')
          setNewNumber('')
        })
      setNewMessage(`The number has been saved succesfully`)   
      setTimeout(() => setNewMessage(null), 5000)
    }
  }

  const deletePerson = (id) => {

    console.log(id)

    if (window.confirm("Do you really want to delete that number?")){
      personService
      .deletePerson(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))})
    }
  }

  const handleNameChange = (e) => {
    setNewName(e.target.value)
  }

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value)
  }

  const handleFilterChange = (e) => {
    setNewFilter(e.target.value)
  }

//The render App

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter changeFunction={handleFilterChange}/>
      <h2>Add new number</h2>
      <PersonForm handleSubmit={handleSubmit}
                  handleNameChange={handleNameChange} 
                  handleNumberChange={handleNumberChange}
                  newName={newName}
                  newNumber={newNumber}/>
      <div className="succesfulMessage">{newMessage}</div>
      <div className="errorMessage">{newErrorMessage}</div>
      <h2>Numbers</h2>
      <Persons persons={persons} newFilter={newFilter} deletePerson={deletePerson}/>
    </div>
  )
}

export default App
