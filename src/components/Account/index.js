import React from 'react';
import { AuthUserContext, withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import * as ROLES from '../../constants/roles';


const Account = () => (
  <AuthUserContext.Consumer>
    
    {authUser => (
      <div className="content">
        <h1>Hello {authUser.username}!</h1>
        <h3>E-mail: {authUser.email}</h3>
        <h3>Role: {authUser.roles}</h3>
        
      </div>
    )}
    
  </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser && !authUser.roles.includes(ROLES.BANNED);

export default withAuthorization(condition)(Account);