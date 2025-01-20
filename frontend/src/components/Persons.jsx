import { useEffect } from "react";
import DeletePerson from "./Delete";

const Persons = ({ persons, setPersons, query }) => {
  const FilteredPersons = persons.map((person) =>
    person.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <ul>
        {persons.map((person, i) =>
          FilteredPersons[i] ? (
            <li key={person.id}>
              {person.name} {person.number} <DeletePerson deletePerson={person} persons={persons} setPersons={setPersons} />
            </li>
          ) : null
        )}
      </ul>
    </div>
  );
};

export default Persons;
