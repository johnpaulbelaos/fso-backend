import { useState, useEffect } from 'react';
import axios from 'axios';
import phonebookServices from './services/phonebook';
import Notification from './components/Notification';

const Person = ({ name, number, id, onClick }) => 
  <>{name} {number} <Erase name={name} value={id} onClick={onClick} /><br></br></>;

const Filter = ({ value, onChange }) => {
  return (
    <div>
      filter shown with: <input value={value} onChange={onChange} />
    </div>
  );
};

const Erase = ({ onClick, name, value }) => 
  <button name={name} value={value} onClick={onClick}>delete</button>;

const PersonForm = (props) => {
  const { value1, value2, onChange1, onChange2, onSubmit } = props;

  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={value1} onChange={onChange1} />
      </div>
      <div>
        number: <input value={value2} onChange={onChange2} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>    
  );
};

const Display = ({ persons, onClick }) => {
  return (persons.map(person => 
    <Person key={person.id} name={person.name} number={person.number} 
      id ={person.id} onClick={onClick} />
  ));
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notif, setNotif] = useState(null);

  useEffect(() => {
    phonebookServices
      .getAll()
      .then(initialPersons => 
        {setPersons(initialPersons)
      });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find(p => p.name === newName);
    if (!newName) return;
    if (existingPerson && existingPerson.number === newNumber) {
      alert(`${newName} is already added to phonebook`);
    } else if (existingPerson) {
      const id = existingPerson.id;
      const popUpMessage = `${existingPerson.name} is already added to phonebook, replace the old number with a new one?`;
      if (window.confirm(popUpMessage)) {
        const changedNumber = { ...existingPerson, number: newNumber };
        phonebookServices
          .update(id, changedNumber)
          .then(updatedNumber => {
            setPersons(persons.map(p => p.id === id ? updatedNumber : p));
            setNotif(`${updatedNumber.name} number updated`);
          })
          .catch(error => {setNotif(`Information of ${existingPerson.name} already removed from server`);})         
      }
    } else {
      const personObject = {name: newName, number: newNumber};
      phonebookServices
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNotif(`Added ${returnedPerson.name}`);
        }); 
    }
    setTimeout(() => {setNotif(null);}, 2000); 
    setNewName('');
    setNewNumber(''); 
  };

  const erasePerson = (event) => {
    const id = event.target.value;
    if (window.confirm(`Delete ${event.target.name} ?`)) {
      phonebookServices
        .erase(id)
        .then(erasedPerson => {setPersons(persons.filter(p => p.id !== id))});
    }
  }

  const handlePersonChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const personsToShow = filter
    ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      
      <Notification message={notif} />
      
      <Filter value={filter} onChange={handleFilterChange} />

      <h3>add a new</h3>

      <PersonForm value1={newName} value2={newNumber} 
        onChange1={handlePersonChange} onChange2 ={handleNumberChange} 
        onSubmit={addPerson} />

      <h3>Numbers</h3>
      
      <p>
        <Display persons={personsToShow} onClick={erasePerson} />
      </p>
    </div>
  );
};

export default App;