import personService from "../services/person";

const PersonForm = ({
  persons,
  setPersons,
  newName,
  setNewName,
  newNumber,
  setNewNumber,
  handleNameChange,
  handleNumberChange,
  setSuccessMessage,
  setErrorMessage,
}) => {

  const successNotification = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  const errorNotification = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  const addName = (event) => {
    event.preventDefault();

    const nameObject = {
      name: newName,
      number: newNumber,
    };

    if (!persons.some((person) => person.name === newName)) {
      personService.create(nameObject).then((response) => {
        setPersons(persons.concat(response));
        successNotification(`Added ${response.name}`);
      });
    } else {
      personService
        .getAll()
        .then((response) => {

          let confirmation = confirm(
            `${newName} is already added to phonebook, replace the old number with a new one?`
          );
          if (confirmation) {
            let targetId = 0
            persons.map((person) => person.name === newName ? targetId = person.id : targetId = targetId)
            personService
              .update(targetId, nameObject)
              .then((updateResponse) => {
                setPersons(
                  persons.map((updatePerson) =>
                    updatePerson.name === updateResponse.name
                      ? updateResponse
                      : updatePerson
                  )
                );
                successNotification(`Updated ${updateResponse.name}`);
              })
              .catch((error) => {
                console.log(error);
                personService.getAll()
                .then((response) => setPersons(response))
      
                errorNotification(
                  `Information of ${newName} has already been removed from server`
                );
              });
          }
        })
    }

    setNewName("");
    setNewNumber("");
  };

  return (
    <div>
      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameChange} /> <br />
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  );
};

export default PersonForm;
