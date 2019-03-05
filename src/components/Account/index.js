import React from 'react';
import { AuthUserContext, withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';


const Account = () => (
  <AuthUserContext.Consumer>
    
    {authUser => (
      <div className="content">
        <h2>Hello {authUser.username}!</h2>
        <h1>E-mail: {authUser.email}</h1>
        
      </div>
    )}
    
  </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Account);