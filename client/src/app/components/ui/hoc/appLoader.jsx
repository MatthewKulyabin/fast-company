import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { loadProfessionsList } from '../../../store/professions';
import { loadQualitiesList } from '../../../store/qualities';
import {
  getIsLoggedIn,
  getUsersLoadingStatus,
  loadUsersList,
} from '../../../store/users';

const AppLoader = ({ children }) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(getIsLoggedIn());
  const usersLoadingStatus = useSelector(getUsersLoadingStatus());

  useEffect(() => {
    dispatch(loadQualitiesList());
    dispatch(loadProfessionsList());
    isLoggedIn && dispatch(loadUsersList());
  }, [isLoggedIn]);

  if (usersLoadingStatus) return 'Loading';

  // console.log(useSelector(getCurrentUserData()));

  return children;
};

AppLoader.propTypes = {
  children: PropTypes.oneOfType(
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ),
};

export default AppLoader;
