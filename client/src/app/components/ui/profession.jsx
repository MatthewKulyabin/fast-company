import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getProfessionById, getProfessionsList } from '../../store/professions';

const Proffesion = ({ id }) => {
  const isLoading = useSelector(getProfessionsList());
  const prof = useSelector(getProfessionById(id));
  return (isLoading && <p>{prof.name}</p>) || 'loading...';
};

Proffesion.propTypes = {
  id: PropTypes.string,
};

export default Proffesion;
