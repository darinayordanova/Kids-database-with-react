import React from 'react';
import { withAuthorization, AuthUserContext } from '../Session';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Courses = () => (
  <AuthUserContext.Consumer>
    {authUser =>
      authUser.roles.includes(ROLES.ADMIN) ? (
        <div className="content">
    <Link to={ROUTES.LANDING}><FontAwesomeIcon icon="plus-circle" size='3x' /></Link>
  </div>
      ) : (
        <div className="content">
        <h1>I am not Admin</h1>
        </div>
        )
    }
  </AuthUserContext.Consumer>
);
const condition = authUser => !!authUser;

export default withAuthorization(condition)(Courses);