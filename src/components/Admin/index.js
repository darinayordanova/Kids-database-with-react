import React, { Component } from 'react';
import { compose } from 'recompose';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';

class AdminPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.users().on('value', snapshot => {
      const usersObject = snapshot.val();

      const usersList = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key,
      }));

      this.setState({
        users: usersList,
        loading: false,
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  render() {
    const { users, loading } = this.state;

    return (
      <div className="content">
        <h1>Admin</h1>
        <p>
          The Admin Page is accessible by every signed in admin user.
        </p>

        {loading && <div>Loading ...</div>}

        <UserList users={users} />
      </div>
    );
  }
}

const UserList = ({ users }) => (
  <Table striped hover className="table">
    <thead>
      <tr>
        <th>Username</th>
        <th>E-mail</th>
        <th>User ID</th>
        <th>Ban User</th>
      </tr>
    </thead>
    <tbody>
      {users.map(user => (
        
        <tr key={user.uid} className={(user.roles.includes(ROLES.ADMIN)? 'admin' : (user.roles.includes(ROLES.BANED)) ? 'ban': 'user')}>
          <td>
          {user.username}
          </td>
          <td>
            {user.email}
          </td>
          <td>
          {user.uid}
          </td>
          <td>
          {(!user.roles.includes(ROLES.BANED)) ?
      (<Button variant="danger" onClick={() => user.roles.push(ROLES.ADMIN)}>BANana me </Button>):(<p> This user is bananed</p>)}
          </td>
        </tr>
      ))}
    </tbody>
  </Table >
);

const condition = authUser =>
  authUser && authUser.roles.includes(ROLES.ADMIN);

export default compose(
  withAuthorization(condition),
  withFirebase,
)(AdminPage);