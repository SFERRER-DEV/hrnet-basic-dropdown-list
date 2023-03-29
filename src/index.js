import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import styled from 'styled-components';
import DropdownList from './lib/components/DropdownList';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1em;
  margin: 2em;
`;

const Tag = styled.span`
  display: inline-block;
  padding: 0.5em 0.85em;
  margin-right: 0.85em;
  margin-bottom: 0.85em;
  background-color: #d2e8f5;
  border-radius: 0.5em;
  font-size: 0.75em;
  color: #039;
  & > span {
    text-transform: uppercase;
    font-weight: bold;
    color: 0f056b;
  }
`;

const root = ReactDOM.createRoot(document.getElementById('root'));

function Tags({ listTags, start }) {
  return (
    <div>
      {listTags.map((element, index) =>
        element.id !== '' ? (
          <Tag key={start + index}>
            <span>{`${element.id}`}</span> - {` ${element.name}`}
          </Tag>
        ) : (
          ''
        )
      )}
    </div>
  );
}

function DepartementList() {
  /**
   * Déclare une variable d'état 'list' et une fonction de mise à jour 'setList'
   * qui initialise la valeur initiale de 'list' à un tableau avec un objet vide.
   */
  const [list, setList] = useState([{}]);
  const [selectedValue, setSelectedValue] = useState('');

  return (
    <Container>
      <DropdownList
        labelText={'Departement'}
        jsonUrl={'/data/departements.json'}
        message={'You must choose your department'}
        onListChange={(newState) => setList(newState)}
        onSelectedChange={(newState) => setSelectedValue(newState)}
        selectedValue={selectedValue}
      />
      <Tags listTags={list} start={1000} />
    </Container>
  );
}

function StateList() {
  /**
   * Déclare une variable d'état 'list' et une fonction de mise à jour 'setList'
   * qui initialise la valeur initiale de 'list' à un tableau avec un objet vide.
   */
  const [list, setList] = useState([{}]);
  const [selectedValue, setSelectedValue] = useState('');

  return (
    <Container>
      <DropdownList
        labelText={'State'}
        jsonUrl={'/data/states.json'}
        namedKey="abbreviation"
        message="Please select a state"
        onListChange={(newState) => setList(newState)}
        onSelectedChange={(newState) => setSelectedValue(newState)}
        selectedValue={selectedValue}
        timing={2}
      />
      <Tags listTags={list} start={2000} />
    </Container>
  );
}

function LisensesList() {
  /**
   * Déclare une variable d'état 'list' et une fonction de mise à jour 'setList'
   * qui initialise la valeur initiale de 'list' à un tableau avec un objet vide.
   */
  const [list, setList] = useState([{}]);
  const [selectedValue, setSelectedValue] = useState('');

  return (
    <Container>
      <DropdownList
        labelText={'Licenses Github'}
        jsonUrl={'https://api.github.com/licenses'}
        namedKey="key"
        message="Please choose a license"
        onListChange={(newState) => setList(newState)}
        onSelectedChange={(newState) => setSelectedValue(newState)}
        selectedValue={selectedValue}
      />
      <Tags listTags={list} start={3000} />
    </Container>
  );
}

/**
 * Tester si un champ de formulaire a des erreurs de validation 🚨
 * @param {HTMLInputElement} field
 * @returns {boolean} Ce champ est-il validé ?
 */
const validateField = (field) => {
  /**
   * @type {Object}
   * @description Les états de validité de toutes les contraintes d'un champ de formulaire
   */
  const validityState = field.validity;
  return validityState.valid;
};

/**
 * Tester des champs du formulaire à valider 👮‍♂️
 * @param {NodeList} fields - La NodeList des éléments DOM à traiter.
 */
const checkValidity = (fields) => {
  /**
   * @type {boolean}
   * @description Est-ce que le formulaire et tous ses champs sont valides ?
   */
  let ok = true;
  // parcourir les élements du formulaire à valider
  for (let input of fields) {
    ok &= validateField(input);
  }
  return ok;
};

const handleSubmit = (event) => {
  /**
   * Sélectionner toutes les listes déroulantes à valider et se trouvant dans un élément ayant une classe "formData".
   *  @type {NodeList}
   */
  const fields = document.querySelectorAll('.formData select');

  /**
   * @type {boolean}
   * @description est-ce que les champs de formulaire respectent leurs contraintes de validité ?
   */
  const valid = checkValidity(fields);
  if (!valid) {
    // ⛔
    return;
  } else {
    // ✅
    event.preventDefault();
    console.log('Formulaire soumis 👍');
  }
};

root.render(
  <React.StrictMode>
    <main>
      <h1>HRnet - dropdown component </h1>
      <form onSubmit={handleSubmit}>
        <button type="submit" onClick={handleSubmit}>
          submit
        </button>
        <DepartementList />
        <LisensesList />
        <StateList />
      </form>
    </main>
  </React.StrictMode>
);
