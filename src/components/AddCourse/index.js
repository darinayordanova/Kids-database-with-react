import React, { Component } from 'react';
import { withAuthorization, AuthUserContext } from '../Session';
import { Switch, Route, Link, Redirect} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import { withFirebase } from '../Firebase';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const AddCourse=()=>(
  <AuthUserContext.Consumer>
  {authUser =>
    authUser.roles.includes(ROLES.ADMIN) && (
      
      <div className="content">
      <h1>Add Course</h1>
      <Courses />

      </div>
    ) 
  }
</AuthUserContext.Consumer>
    );

    class CoursesBase extends Component {
      constructor(props) {
        super(props);
    
    
        this.state = {
          title: '',
          description: '',
          level:'',
          loading: false,
          courses: [],
        };
      }
    
      componentDidMount() {
        this.setState({ loading: true });
    
        this.props.firebase.courses().on('value', snapshot => {
          const courseObject = snapshot.val();
    
          if (courseObject) {
            const courseList = Object.keys(courseObject).map(key => ({
              ...courseObject[key],
              uid: key,
            }));
            this.setState({
              courses: courseList,
              loading: false,
            });
          } else {
            this.setState({ courses: null, loading: false });
    
          }
        });
      }
      componentWillUnmount() {
        this.props.firebase.courses().off();
      }
    
      render() {
        const { title, description, level, courses, loading } = this.state;
        
        const isInvalid = title === '' || description === '' || level==="Choose Level..."; 
        return (
          <div>
            <Form className="forms" onSubmit={this.onCreateCourse}>
           <Form.Group controlId="formBasicEmail">
             <FormControl
               name="title"
               type="text"
               value={title}
               onChange={this.onChangeText}
               placeholder="Title"
             />
           </Form.Group>
           <Form.Group controlId="formBasicEmail">
             <FormControl
             as="textarea"
               name="description"
               type="text"
               value={description}
               onChange={this.onChangeText}
               placeholder="Description"
             />
           </Form.Group>
           <Form.Group controlId="ControlSelect">
             <Form.Control
             name="level"
             value={level}
             onChange={this.onChangeText}
              as="select">
               <option>Choose Level...</option>
               <option>1</option>
               <option>2</option>
               <option>3</option>
               <option>4</option>
               <option>Other</option>
             </Form.Control>
           </Form.Group>
           
           <Button disabled={isInvalid || level==='Choose Level...'} type="submit">Add Course</Button>
           
         </Form>
          </div>
        );
      }
      
      onChangeText = event => {
        this.setState({ [event.target.name]: event.target.value })
      }
      onCreateCourse = event => {
        this.props.firebase.courses().push({
          title: this.state.title,
          description: this.state.description,
          level: this.state.level,
        });
        
        this.setState({ title: '', description: '', level:'Choose Level...' });
        event.preventDefault();
        
        
      }
    }

const condition = authUser =>
  authUser && authUser.roles.includes(ROLES.ADMIN) && !authUser.roles.includes(ROLES.BANNED);;

  const Courses = withFirebase(CoursesBase);

export default 
  withAuthorization(condition)(AddCourse);