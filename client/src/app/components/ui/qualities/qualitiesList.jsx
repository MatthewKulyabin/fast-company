import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Quality from './quality';
import { useSelector, useDispatch } from 'react-redux';
import { getQualities, loadQualitiesList } from '../../../store/qualities';

const QualitiesList = ({ userQualities }) => {
  const dispatch = useDispatch();

  const qualities = useSelector(getQualities());

  useEffect(() => {
    dispatch(loadQualitiesList());
  }, []);

  return (
    <>
      {qualities.map((qual) =>
        userQualities.map(
          (userQual) =>
            qual._id === userQual && <Quality key={qual._id} {...qual} />
        )
      )}
    </>
  );
};

QualitiesList.propTypes = {
  userQualities: PropTypes.array,
};

export default QualitiesList;
