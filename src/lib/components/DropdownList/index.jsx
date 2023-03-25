import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { fetchJsonData } from "../../api";
import Loader from "../Loader";

const Container = styled.div`
	display: flex;
`;

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
	return Math.random().toString(36).substr(2, 9);
};

/**
 * @description Afficher une liste déroulante
 * @param {Object} props
 * @param {string} props.labelText - Texte du libellé associé
 * @param {number|string|null} props.value - Valeur pré-sélectionnée de la liste
 * @param {string} props.jsonUrl - Url du fichier json contenant les éléments de liste
 * @param {string} props.timing - Nombre de secondes à attendre
 * @param {string} props.namedKey - Nom de la propriété utilisée comme clé d'item dans ce json
 * @param {string} props.namedValue - Nom de la propriété pour la valeur d'item dans ce json
 * @param {function} props.onChange - La fonction à appeler lorsqu'un changement se produit.
 * @returns {JSX.Element} DropdownList
 */
function DropdownList(props) {
	const { labelText, value, jsonUrl, timing, namedKey, namedValue, onChange } =
		props;

	/**
	 * Etat des données chargées à partir du fichier json
	 * @typedef jsonData - Tableau d'objets json contenant les éléments pour la liste
	 * @typedef setJsonData - Fonction qui permet de mettre à jour le tableau de données.
	 */
	const [jsonData, setJsonData] = useState(null);

	/**
	 * Etat pour mémoriser les données avec des propriétés json normalisées en id et name
	 * @typedef data - Tableau d'objets json contenant les éléments pour la liste
	 * @typedef setData - Fonction qui permet de mettre à jour le tableau de données.
	 */
	const [data, setData] = useState([]);

	/**
	 * État de la valeur active sélectionnée dans la liste déroulante.
	 * @typedef activeValue - La nouvelle valeur active.
	 * @typedef setActiveValue - Fonction qui permet de mettre à jour la valeur active.
	 */
	const [activeValue, setActiveValue] = useState(value);

	/**
	 * État du compte à rebours.
	 * @typedef seconds - Temps restant.
	 * @typedef setSeconds - Fonction qui décrémente le compte à rebours jusqu'à -1.
	 */
	const [seconds, setSeconds] = useState(timing);

	/**
	 * État de chargement indiquant si les données sont en cours de chargement ou non.
	 * @typedef isDataLoading - Indique si les données sont en cours de chargement ou non.
	 * @typedef setDataLoading - Fonction qui permet de mettre à jour l'état de chargement de données.
	 */
	const [isDataLoading, setDataLoading] = useState(false);

	/**
	 * État d'erreur.
	 * @typedef error - Indique s'il y a une erreur ou non.
	 * @typedef setError - Fonction qui permet de mettre à jour l'état d'erreur.
	 */
	const [error, setError] = useState(false);

	/**
	 * @type {string}
	 * @description Identifiant unique de la liste pour lier son label (participe à la props key des éléments de liste)
	 */
	const idDropdown = uniqueId();

	useEffect(() => {
		fetchJsonData(jsonUrl, setDataLoading, setError, setJsonData);
	}, [jsonUrl]);

	useEffect(() => {
		if (isDataLoading === false && jsonData !== null && data.length === 0) {
			jsonData.forEach((element) => {
				data.push(
					Object.assign({
						id: element[namedKey],
						name: element[namedValue],
					})
				);
			});

			if (activeValue === null) {
				setActiveValue(data[0].id);
			}
		}
	}, [
		isDataLoading,
		jsonData,
		data,
		namedKey,
		namedValue,
		activeValue,
		setActiveValue,
	]);

	/**
	 * Temporiser avant d'afficher les données de l'utilisateur
	 */
	useEffect(() => {
		const interval = setInterval(() => {
			if (seconds >= 0) setSeconds((seconds) => seconds - 1);
		}, 1000);
		return () => clearInterval(interval);
	}, [seconds, setSeconds]);

	return (
		<Container>
			<ListLabel htmlFor={idDropdown}>{labelText}</ListLabel>
			{isDataLoading === true || seconds >= 0 ? (
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
					value={activeValue}
					onChange={(e) => {
						onChange(e.target.value);
						setActiveValue(e.target.value);
					}}
				>
					{data.map((option, index) => (
						<option key={`${1000 + index}-${idDropdown}`} value={option.id}>
							{option.name}
						</option>
					))}
				</List>
			)}
		</Container>
	);
}

DropdownList.propTypes = {
	jsonUrl: PropTypes.string.isRequired,
	namedKey: PropTypes.string,
	namedValue: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	timing: PropTypes.number,
};

DropdownList.defaultProps = {
	labelText: "Choisir une option :",
	value: null,
	timing: 0,
	namedKey: "id",
	namedValue: "name",
};

export default DropdownList;
