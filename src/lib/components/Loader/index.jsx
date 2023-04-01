import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import { useTimer } from '../../hooks';

const colors = {
  primary: '#000000',
  secondary: '#FFFFFF',
  tertiary: '#FF0101', // rouge #FF7F7F #FF0101
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
  width: max-content;
  margin: 0.3125em;
`;

/** @type {Object} Un cercle en rotation est animé dans une balise `<div>` */
const LoaderHourGlass = styled.div`
  border: 0.25em solid ${colors.tertiary};
  border-bottom-color: transparent;
  border-radius: 50%;
  height: 0.75em;
  width: 0.75em;
  animation: ${rotate} 0.65s infinite linear;
`;

/**
 * Un composant pour afficher un sablier d'attente de quelques secondes
 * @param {Object} props
 * @param {number} props.seconds Un nombre de secondes pour intialiser l'attente
 * @param {Function} props.setSeconds
 * @returns {React.ReactElement} Loader
 */
function Loader({ seconds, setSeconds }) {
  /**
   * @typedef {number} seconds Le nombre de seconde(s) à attendre
   */
  const timer = useTimer(seconds, setSeconds);

  return timer > 0 ? (
    <LoaderWrapper>
      <LoaderHourGlass />
    </LoaderWrapper>
  ) : null;
}

Loader.propTypes = {
  seconds: PropTypes.number,
};

Loader.defaultProps = {
  seconds: 0,
};

export default Loader;
