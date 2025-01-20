import { useEffect } from "react";
import personService from "../services/person";

const Delete = ({ deletePerson, persons, setPersons }) => {
  const deleteName = () => {

    const confirmationResult = confirm(`are you sure you want to delete ${deletePerson.name}`)
    
    if(confirmationResult) {
      personService
      .deleteId(deletePerson.id)
      .then((returned) => {
        // setPersons(persons.filter((person) => person.id !== returned.id))
        setPersons(returned)
      })
      .catch( error => {
        console.log(`${deletePerson.name} has already been deleted - ${error}`)
        setPersons(persons.filter((person) => person.id !== id))
      })
    } 
  };

  return <button onClick={deleteName}>delete</button>;
};

export default Delete;
