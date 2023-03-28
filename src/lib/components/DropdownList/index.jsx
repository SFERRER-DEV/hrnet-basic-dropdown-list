import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useFetchList } from "../../api";
import Loader from "../Loader";

/** @type {Object} Le libéllé associé à la liste déroulante est une balise `<label>` */
const ListLabel = styled.label`
	padding: 0.3125em;
	margin: 0.3125em;
	display: inline-block;
	min-width: 7em;
`;

/** @type {Object} La liste déroulante est une balise `<select>` */
const List = styled.select`
	border: 0.125em solid black;
	border-radius: 0.25em;
	padding: 0.3125em;
	margin: 0.3125em;
	width: 15em;
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
	return id.slice(2, 11); // id.substr(2, 9);
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

	/**
	 * Déclare une variable d'état "list" qui contient une liste vide et une fonction "setList"
	 * qui peut être utilisée pour mettre à jour la variable d'état "list".
	 *
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

	/**
	 * @type {string}
	 * @description Identifiant unique de la liste pour lier son label (participe à la props key des éléments de liste)
	 */
	const idDropdown = uniqueId();

	// Récupérer les variables et fonctions utiles
	const { data, isDataLoading, error } = useFetchList(
		jsonUrl,
		namedKey,
		namedValue,
		message
	);

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

	/**
	 *
	 */
	const handleChange = (event) => {
		console.log(event.target.value);
		// 🧽💬 Effacer le bubble message ?
		event.target.setCustomValidity("");
		event.target.reportValidity();
		props.onSelectedChange(event.target.value);
	};

	/**
	 *
	 * @param {*} event
	 * @param {*} message
	 */
	const handleInvalid = (event, message) => {
		event.target.setCustomValidity(message);
	};

	return (
		<div className="select-wrapper formData">
			<ListLabel htmlFor={idDropdown}>{labelText}</ListLabel>
			{isDataLoading === true || seconds > 0 ? (
				<React.Fragment>
					<List id={idDropdown} disabled>
						<option key={`${1001}-${idDropdown}`} value={1}>
							Chargement des données ...
						</option>
					</List>
					<Loader seconds={seconds} setSeconds={setSeconds} />
				</React.Fragment>
			) : error ? (
				<p>Error</p>
			) : (
				<List
					id={idDropdown}
					value={props.selectedValue !== "" ? props.selectedValue : ""}
					onChange={(e) => handleChange(e)}
					onInvalid={(e) => handleInvalid(e, message)}
					className="list-control"
					required
				>
					{list.map((option, index) =>
						index === -0 ? (
							<option
								key={`${1000 + index}-${idDropdown}`}
								value={option.id}
								disabled
							>
								{option.name}
							</option>
						) : (
							<option key={`${1000 + index}-${idDropdown}`} value={option.id}>
								{option.name}
							</option>
						)
					)}
				</List>
			)}
		</div>
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
	labelText: "Choisir une option :",
	namedKey: "id",
	namedValue: "name",
	message: "Veuillez choisir une option",
	selectedValue: "",
	timing: 0,
};

export default DropdownList;
