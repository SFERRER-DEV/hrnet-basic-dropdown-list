import React from 'react';
import { createGlobalStyle } from 'styled-components';
import colors from './color';

const StyledGlobalStyle = createGlobalStyle`
  .formData {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    & label {
      display: flex;
      align-items: center;
      flex-basis: 20%;
      margin: 0.3125em;
      min-width: 5em;
    }
    & select {
      flex-basis: 40%;
      min-width: 5em;
      border: 0.125em solid black;
      border-radius: 0.25em;
      margin: 0.3125em;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  /* Afficher les erreurs de contrainte de validation 🛑 */
  .formData[data-error]::after {
    display: block;
    width: 100%;
    line-height: 1em;
    font-size: 0.875em;
    text-indent: 0.5em;
    margin: 0.5em 0.25em;
    opacity: 0;
    content: attr(data-error);
    text-align: left;
    color: ${colors.secondary};
  }
  /* Montrer erreur de validation >>> */
  .formData[data-error-visible='true']::after {
    opacity: 1;
  }
  .formData[data-error-visible='true'] .list-control {
    border: 2px solid ${colors.secondary};
  }
  .formData[data-error-visible='false']::after {
    opacity: 0;
  }
  .formData[data-error-visible='false'] .list-control {
    border: 1px solid  ${colors.primary};
  }
`;

function GlobalStyle() {
  return <StyledGlobalStyle />;
}

export default GlobalStyle;
