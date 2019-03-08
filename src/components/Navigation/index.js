import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Collapse from 'react-bootstrap/Collapse'
import { AuthUserContext } from '../Session';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import logo from '../../kidsLogo.png';

const Navigation = () => (
  <AuthUserContext.Consumer>
    {authUser =>
      authUser && !authUser.roles.includes(ROLES.BANNED) ? (
        <NavigationAuth authUser={authUser} />
      ) : (
          <NavigationNonAuth />
        )
    }
  </AuthUserContext.Consumer>
);
const NavigationAuth = ({ authUser }) => (
  <Navbar className="navBarmain" expand="md">
    <Link to={ROUTES.LANDING}><img src={logo} alt="Logo" className="logoImage" /></Link>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
      <Nav className="ml-auto">
        <Link className="navElement" to={ROUTES.COURSES}>Courses</Link>
        <Link className="navElement" to={ROUTES.ACCOUNT}>Account</Link>
        {authUser.roles.includes(ROLES.ADMIN) && (
          <Link className="navElement" to={ROUTES.ADMIN}>Admin</Link>
        )}
        <SignOutButton />
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

const NavigationNonAuth = () => (
  <Navbar className="navBarmain">

    <Link className="navElement" to={ROUTES.LANDING}><img src={logo} alt="Logo" className="logoImage" /></Link>
    <Nav className="ml-auto">
      <Link className="navElement" to={ROUTES.SIGN_IN} >Sign In</Link>
    </Nav>
  </Navbar>
);

export default Navigation;