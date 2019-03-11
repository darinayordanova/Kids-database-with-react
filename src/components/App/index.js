import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Navigation from '../Navigation';
import Footer from '../Footer';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import CoursesPage from '../Courses';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import AddCourse from '../AddCourse';
import CourseItemView from '../Courses'

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIgloo, faPlusCircle } from '@fortawesome/free-solid-svg-icons'

library.add(faIgloo, faPlusCircle)

const App = () => (
  <Router>
    <div className="mainDiv">
      <Navigation />


      
        <Route exact path={ROUTES.LANDING} component={LandingPage} />
        <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
        <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
        <Route exact path={ROUTES.COURSES} component={CoursesPage} />
        <Route exact path={ROUTES.ACCOUNT} component={AccountPage} />
        <Route exact path={ROUTES.ADMIN} component={AdminPage} />
        <Route exact path={ROUTES.ADD_COURSE} component={AddCourse} />
        <Route exact path={ROUTES.COURSE_VIEW} component={CourseItemView } />

      <Footer />
    </div>
  </Router>
);

export default withAuthentication(App);