import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useFetchList } from '../../api';
import GlobalStyle from '../../styles';
import Loader from '../Loader';

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
 * @param {string} props.name - Le nom du champ input (submit form)
 * @param {string} props.labelText - Texte du libellé associé
 * @param {string} props.namedKey - Nom de la propriété utilisée comme clé d'item dans ce json
 * @param {string} props.namedValue - Nom de la propriété pour la valeur d'item dans ce json
 * @param {string} props.message - Message de validation & message affiché par la première option inactive
 * @param {function} props.onListChange - Une fonction pour mettre à jour l'état des éléments de liste (à remonter au parent).
 * @param {function} props.onSelectedChange - La fonction à appeler lorsqu'un changement se produit.
 * @param {string |number} props.selectedValue - La valeur sélectionnée dans la liste déroulante
 * @param {string} props.initialSeconds - Nombre de secondes à attendre
 * @returns {JSX.Element} DropdownList
 */
function DropdownList(props) {
  const {
    name,
    labelText,
    jsonUrl,
    namedKey,
    namedValue,
    message,
    initialSeconds,
  } = props;

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
  const [seconds, setSeconds] = useState(initialSeconds);

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

  /**
   * Déclare une variable d'état "selectedValue" qui correspond à l'identifiant
   * d'un élément de la liste déroulante.
   * Soit vide => "" pour le 1er élément desactivé qui indique "Loading ..."
   * Soit un id par défaut d'un élément spécifique de la liste
   * @typedef {string} selectedValue - Vide ou un id d'un élément
   * @typedef {Function} setSelectedValue - Cette fonction met à jour le State local
   */
  const [selectedValue, setSelectedValue] = useState('');
  // Quand l'attente et le chargement seront passés ...
  useEffect(() => {
    if (isDataLoading === false && seconds === 0) {
      // ... alors il faut que la liste déroulante sélectionne son premier élément ou un élément choisi par défaut
      setSelectedValue(props.selectedValue !== '' ? props.selectedValue : '');
    }
  }, [isDataLoading, seconds, setSelectedValue, props.selectedValue]);

  return (
    <div className="select-wrapper formData">
      <GlobalStyle />
      <label htmlFor={idSelect}>{labelText}</label>
      <select
        id={idSelect}
        name={name}
        ref={refSelect}
        value={selectedValue}
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
      </select>

      <Loader seconds={seconds} setSeconds={setSeconds} />
    </div>
  );
}

DropdownList.propTypes = {
  name: PropTypes.string.isRequired,
  labelText: PropTypes.string,
  jsonUrl: PropTypes.string.isRequired,
  namedKey: PropTypes.string,
  namedValue: PropTypes.string,
  message: PropTypes.string,
  onListChange: PropTypes.func.isRequired,
  onSelectedChange: PropTypes.func.isRequired,
  selectedValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  initialSeconds: PropTypes.number,
};

DropdownList.defaultProps = {
  labelText: 'Choose an option :',
  namedKey: 'id',
  namedValue: 'name',
  message: 'Please choose an option',
  selectedValue: '',
  initialSeconds: 0,
};

export default DropdownList;
