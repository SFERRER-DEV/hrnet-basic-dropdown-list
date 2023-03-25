import React, { useEffect } from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";

const colors = {
	primary: "#000000",
	secondary: "#FFFFFF",
	tertiary: "#FF0101", // rouge #FF7F7F #FF0101
};

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

/** @type {Object} Un conteneur pour afficher et centrer l'animation d'attente dans une balise `<div>` */
const LoaderWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-content: center;
`;

/** @type {Object} Un cercle en rotation est animé dans une balise `<div>` */
const LoaderHourGlass = styled.div`
	border: 0.25em solid ${colors.tertiary};
	border-bottom-color: transparent;
	border-radius: 1em;
	height: 1em;
	width: 1em;
	animation: ${rotate} 1s infinite linear;
`;

/**
 * Un composant pour afficher un sablier d'attente de quelques secondes
 * @param {Object} props
 * @param {number} props.seconds Un nombre de secondes pour intialiser l'attente
 * @param {Function} props.setSeconds
 * @returns {React.ReactElement} Loader
 */
function Loader(props) {
	/**
	 * @typedef {number} seconds Le nombre de seconde(s) à attendre
	 */
	const {
		/** @type {seconds} */
		seconds,
		setSeconds,
	} = props;

	/**
	 * Temporiser avant d'afficher les données de l'utilisateur
	 */
	useEffect(() => {
		const interval = setInterval(() => {
			if (seconds > 0) setSeconds((seconds) => seconds - 1);
		}, 750);
		return () => clearInterval(interval);
	}, [seconds, setSeconds]);

	return (
		<LoaderWrapper>
			<LoaderHourGlass />
		</LoaderWrapper>
	);
}

Loader.propTypes = {
	seconds: PropTypes.number.isRequired,
	setSeconds: PropTypes.func.isRequired,
};

Loader.defaultProps = {
	seconds: 0, // Pas délais supplémentaire
};

export default Loader;
