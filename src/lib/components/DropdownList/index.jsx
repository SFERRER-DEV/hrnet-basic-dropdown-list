import React from 'react';
import PropTypes from 'prop-types';

/**
 * @description Afficher un div qui présente une fonctionnalité
 * @param {Object} props
 * @param {string} props.value
 * @param {Function} props.onchange
 * @param {Array.<String>} props.options
 * @returns {JSX.Element} DropdownList
 */
function DropdownList(props) {
  const { value, onChange, options } = props;
  return (
    <select onChange={(e) => onChange(e.target.value)} value={value}>
      {options.map((option) => (
        <option value={option} key={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

DropdownList.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
};

export default DropdownList;
