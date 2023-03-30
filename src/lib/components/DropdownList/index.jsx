import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useFetchList } from '../../api';
import './index.css';
import Loader from '../Loader';

/** @type {Object} Le libéllé associé à la liste déroulante est une balise `<label>` */
const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

/** @type {Object} Le libéllé associé à la liste déroulante est une balise `<label>` */
const ListLabel = styled.label`
  flex-basis: 20%;
  margin: 0.3125em;
  min-width: 5em;
`;

/** @type {Object} La liste déroulante est une balise `<select>` */
const List = styled.select`
  flex-basis: 40%;
  min-width: 5em;
  border: 0.125em solid black;
  border-radius: 0.25em;
  margin: 0.3125em;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

/**
 * Générer un identifiant unique
 * @returns {string} Une chaîne aléatoire de caractères alphanumériques "uzkttrvnc"
 */
const uniqueId = () => {
  const id = Math.random().toString(36);
  return id.slice(2, 11);
};

/**
 * @description Afficher une liste déroulante
 * @param {Object} props
 * @param {string} props.labelText - Texte du libellé associé
 * @param {string} props.namedKey - Nom de la propriété utilisée comme clé d'item dans ce json
 * @param {string} props.namedValue - Nom de la propriété pour la valeur d'item dans ce json
 * @param {string} props.message - Message de validation & message affiché par la première option inactive
 * @param {function} props.onListChange - Une fonction pour mettre à jour l'état des éléments de liste (à remonter au parent).
 * @param {function} props.onSelectedChange - La fonction à appeler lorsqu'un changement se produit.
 * @param {string |number} props.selectedValue - La valeur sélectionnée dans la liste déroulante
 * @param {string} props.timing - Nombre de secondes à attendre
 * @returns {JSX.Element} DropdownList
 */
function DropdownList(props) {
  const { labelText, jsonUrl, namedKey, namedValue, message, timing } = props;

  const refSelect = useRef(null);

  /**
   * La valeur actuelle de l'identifiant de classe sous forme de chaîne de caractères
   * @typedef {string} idSelect -L'identifiant de classe qui est une chaîne de caractères
   * @typedef {Function} setIdSelect -  Une fonction pour mettre à jour la valeur de l'identifiant de classe
   */
  const [idSelect, setIdSelect] = useState('');
  /**
   * Déclare une variable d'état "list" qui contient une liste vide et une fonction "setList"
   * qui peut être utilisée pour mettre à jour la variable d'état "list".
   * @typedef {Array.<Object>} list - Cette variable de State contient les éléments de la liste
   * @typedef {Function} setList - Cette fonction met à jour le State local
   */
  const [list, setList] = useState([]);

  /**
   * État du compte à rebours.
   * @typedef seconds - Temps restant.
   * @typedef setSeconds - Fonction qui décrémente le compte à rebours jusqu'à -1.
   */
  const [seconds, setSeconds] = useState(timing);

  // Récupérer les variables et fonctions utiles
  const { data, isDataLoading, error } = useFetchList(
    jsonUrl,
    namedKey,
    namedValue,
    message
  );

  /**
   * Fonction qui gère le changement de valeur dans liste déroulante
   *@param {object} event - L'événement de changement de valeur déclenché par la liste.
   *@param {string} event.target.value - La nouvelle valeur de l'élément de liste.
   *@returns {void}
   */
  const handleChange = (event) => {
    console.log(event.target.value);
    event.target.reportValidity();
    props.onSelectedChange(event.target.value);
  };

  /**
   * Empêche l'affichage des messages des infobulles de l'API HTML lorsqu'un événement invalide se produit sur un élément DOM.
   *
   * @param {Event} event - L'événement qui a déclenché la fonction.
   * @returns {void}
   */
  const handleInvalid = (event) => {
    // Empêche l'affichage des messages des infobulles de l'API HTML
    event.preventDefault();
    const formData = refSelect.current.parentNode;
    if (
      formData === null ||
      formData === undefined ||
      !formData.classList.contains('formData')
    ) {
      return;
    }

    if (refSelect.current.validity.valueMissing) {
      refSelect.current.setCustomValidity(message);
      formData.setAttribute('data-error', message);
      formData.setAttribute('data-error-visible', true);
    } else {
      // 🧽 Remise à blanc des erreurs de validation
      refSelect.current.setCustomValidity('');
      formData.setAttribute('data-error', '');
      formData.setAttribute('data-error-visible', false);
    }
  };

  useEffect(() => {
    // Générer identifiant balise <select> 🆔
    setIdSelect(uniqueId());
    //
    if (refSelect.current) {
      refSelect.current.addEventListener('invalid', handleInvalid);
    }
    return () => {
      if (refSelect.current) {
        refSelect.current.removeEventListener('invalid', handleInvalid);
      }
    };
  }, []);

  // Renseigner le state local avec les éléments obtenus pour la liste
  useEffect(() => {
    if (!isDataLoading && !error && data && data.length > 0) {
      props.onListChange(data);
      setList(data);
    }
  }, [data, isDataLoading, error, setList, props]);

  // Temporiser avant d'afficher les données de l'utilisateur ⏳
  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) setSeconds((seconds) => seconds - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds, setSeconds]);

  return (
    <Wrapper className="select-wrapper formData">
      <ListLabel htmlFor={idSelect}>{labelText}</ListLabel>
      <List
        id={idSelect}
        ref={refSelect}
        value={props.selectedValue !== '' ? props.selectedValue : ''}
        onChange={handleChange}
        className="list-control"
        required
      >
        {isDataLoading === true || seconds > 0 ? (
          <option key={`${9999}-${idSelect}`} value="" disabled>
            Loading ..
          </option>
        ) : error ? (
          <option key={`${9999}-${idSelect}`} value="" disabled>
            Loading error
          </option>
        ) : (
          list.map((option, index) =>
            index === 0 ? (
              <option
                key={`${1000 + index}-${idSelect}`}
                value={option.id}
                disabled
              >
                {option.name}
              </option>
            ) : (
              <option key={`${1000 + index}-${idSelect}`} value={option.id}>
                {option.name}
              </option>
            )
          )
        )}
      </List>
      {isDataLoading === true || seconds > 0 ? (
        <Loader seconds={seconds} setSeconds={setSeconds} />
      ) : null}
    </Wrapper>
  );
}

DropdownList.propTypes = {
  labelText: PropTypes.string,
  jsonUrl: PropTypes.string.isRequired,
  namedKey: PropTypes.string,
  namedValue: PropTypes.string,
  message: PropTypes.string,
  onListChange: PropTypes.func.isRequired,
  onSelectedChange: PropTypes.func.isRequired,
  selectedValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  timing: PropTypes.number,
};

DropdownList.defaultProps = {
  labelText: 'Choose an option :',
  namedKey: 'id',
  namedValue: 'name',
  message: 'Please choose an option',
  selectedValue: '',
  timing: 0,
};

export default DropdownList;
