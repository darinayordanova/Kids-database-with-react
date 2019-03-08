import React, { Component } from 'react';
import { withAuthorization, AuthUserContext } from '../Session';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import { withFirebase } from '../Firebase';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



const CoursesPage = () => (
  <AuthUserContext.Consumer>
    {authUser =>
      authUser.roles.includes(ROLES.ADMIN) ? (

        <div className="content">
          <Courses />
          <Link to={ROUTES.ADD_COURSE}><FontAwesomeIcon icon="plus-circle" size='3x' /></Link>
        </div>
      ) : (
          <div className="content">


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
      level: '',
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

  onRemoveCourse = (uid) => {
    console.log(this.props.firebase.course(uid))
    this.props.firebase.course(uid).remove();
  }

  onEditCourse = (course, title, description, level) => {
    console.log(course.uid);
    this.props.firebase.course(course.uid).set({
      ...course,
      title,
      description,
      level,
    });

  };

  render() {
    const { title, description, level, courses, loading } = this.state;

    const isInvalid = title === '' || description === '' || level === "Choose Level...";
    return (
      <div>

        {loading && <div>Loading ...</div>}
        {courses ? (
          <CourseList
            courses={courses}
            onEditCourse={this.onEditCourse}
            onRemoveCourse={this.onRemoveCourse}
          />) : (
            <div>There are no courses yet..</div>)}
      </div>
    );
  }


}


const CourseList = ({ courses, onRemoveCourse, onEditCourse }) => (
  <div className="coursesList">
    {courses.map(course => (
      <CourseItem
        key={course.uid}
        course={course}
        onEditCourse={onEditCourse}
        onRemoveCourse={onRemoveCourse}
      />
    ))
    }
  </div>
);

class CourseItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      editTitle: this.props.course.title,
      editDescription: this.props.course.description,
      editLevel: this.props.course.level,
    };
  }
  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      editTitle: this.props.course.title,
      editDescription: this.props.course.description,
      editLevel: this.props.course.level,
    }))
  }
  onChangeEditCourse = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  onSaveEditCourse = () => {
    console.log(this.props.course)
    this.props.onEditCourse(this.props.course, this.state.editTitle, this.state.editDescription, this.state.editLevel);

    this.setState({ editMode: false });
  }
  render() {
    const { course, onRemoveCourse } = this.props;
    const { editMode, editTitle, editDescription, editLevel } = this.state;

    return (
      <AuthUserContext.Consumer>
        {authUser =>
          authUser.roles.includes(ROLES.ADMIN) ? (

            <div className={'level' + course.level}>
              {editMode ? (
                <Form className="forms">

                  <Form.Group controlId="formBasicEmail">
                    <Form.Control
                      type="text"
                      name="editTitle"
                      value={editTitle}
                      onChange={this.onChangeEditCourse}
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Control
                      type="text"
                      name="editDescription"
                      value={editDescription}
                      onChange={this.onChangeEditCourse}
                    />
                  </Form.Group>
                  <Form.Group controlId="ControlSelect">
                    <Form.Control
                      as="select"
                      name="editLevel"
                      value={editLevel}
                      onChange={this.onChangeEditCourse}>
                      <option>Choose Level...</option>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>Other</option>
                    </Form.Control>
                  </Form.Group>
                  <Button variant="success" onClick={this.onSaveEditCourse}>Save</Button>
                  <Button onClick={this.onToggleEditMode}>Cancel</Button>

                </Form>
              ) : (
                  <div className="courseTitileAndDescr">
                    <h3>{course.title}</h3> 
                    <p>{course.description}</p>
                  </div>)}
              <div className="buttonsCourse">
                {editMode ? (
                  <span>
                  </span>
                ) : (
                    <Button variant="warning" onClick={this.onToggleEditMode}>Edit</Button>
                  )}

                {!editMode && (<Button variant="danger" type="button"
                  onClick={() => onRemoveCourse(course.uid)}>
                  Delete
    </Button>
                )}
              </div>
            </div>
          ) : (
              <div className={'level' + course.level}>
                <div className="courseTitileAndDescr">
                  <h3>{course.title}</h3> 
                  <p>{course.description}</p>
                </div>
              </div>

            )}

      </AuthUserContext.Consumer>

    )

  }
}
const Courses = withFirebase(CoursesBase);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(CoursesPage);