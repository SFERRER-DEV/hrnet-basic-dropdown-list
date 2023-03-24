import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

/** @type {Object} La liste déroulante est une balise `<select>` */
const Dropdown = styled.select`
	border: 0.125em solid black;
	border-radius: 0.25em;
	padding: 0.3125em;
	margin: 0.3125em;
	min-width: 15em;
`;

/** @type {Object} Le libéllé associé à la liste déroulante est une balise `<label>` */
const ListLabel = styled.label`
	padding: 0.3125em;
	margin: 0.3125em;
	display: inline-block;
	min-width: 7em;
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
 * @param {string} props.label Le texte du libellé associé
 * @param {string} props.value La valeur à afficher dans la liste
 * @param {Array.<String>} props.options Les éléments de la liste déroulante
 * @returns {JSX.Element} DropdownList
 */
function DropdownList(props) {
	const { labelText, value, options } = props;

	const [activeValue, setActiveValue] = useState(
		value === "" ? options[0] : value
	);

	/**
	 * @type {string}
	 * @description L'identifiant unique de la liste permet de lier son label et participe dans les keys des options
	 */
	const idDropdown = uniqueId();

	return (
		<React.Fragment>
			<ListLabel htmlFor={idDropdown}>{labelText}</ListLabel>
			<Dropdown
				id={idDropdown}
				value={activeValue}
				onChange={(e) => {
					console.log(e.target.value);
					setActiveValue(e.target.value);
				}}
			>
				{options.map((option, index) => (
					<option key={`${1000 + index}-${idDropdown}`} value={option}>
						{option}
					</option>
				))}
			</Dropdown>
		</React.Fragment>
	);
}

DropdownList.propTypes = {
	value: PropTypes.string,
	options: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

DropdownList.defaultProps = {
	labelText: "Choisir une option :",
	value: "",
};

export default DropdownList;
