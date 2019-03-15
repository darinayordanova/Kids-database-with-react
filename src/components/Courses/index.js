import React, { Component } from 'react';
import { withAuthorization, AuthUserContext } from '../Session';
import { Switch, Route, Link, Router } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import { withFirebase } from '../Firebase';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



const CoursesPage = () => (
  <div className="content">

    <Route exact path={ROUTES.COURSES} component={CoursesList} />
    <Route path={ROUTES.COURSE_VIEW} component={CourseItemView} />
  </div>
);

class CoursesList extends Component {
  render() {
    return (
      <AuthUserContext.Consumer>
        {authUser =>
          authUser.roles.includes(ROLES.ADMIN) ? (

            <div id="coursesList">
              <h1>Courses</h1>
              <Courses />
              <Link to={ROUTES.ADD_COURSE}><FontAwesomeIcon icon="plus-circle" size='3x' /></Link>
            </div>
          ) : (
              <div id="coursesList">
                <h1>Courses</h1>
                <Courses />
              </div>
            )
        }
      </AuthUserContext.Consumer>
    );
  }
}
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
    
    this.props.firebase.course(uid).remove();
  }

  onEditCourse = (course, title, description, level) => {
    
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
    
    this.props.onEditCourse(this.props.course, this.state.editTitle, this.state.editDescription, this.state.editLevel);

    this.setState({ editMode: false });
  }
  showThisCourseAndHideCoursesList() {
    
    
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
                    
                    <span className="link"><Link to={{ pathname: `${ROUTES.COURSES}/${course.uid}`, state: { course }, }} onClick={this.showThisCourseAndHideCoursesList}> View</Link></span>
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
                  {/* <p>{course.description}</p> */}
                  <Link to={{ pathname: `${ROUTES.COURSES}/${course.uid}`, state: { course }, }} onClick={this.showThisCourseAndHideCoursesList}> View</Link>
                </div>
              </div>

            )}

      </AuthUserContext.Consumer>

    )

  }
}

class CourseItemBase extends Component {

  constructor(props) {
    
    super(props);

    this.state = {
      loading: false,
      course: props.location.state,
    };

  }

  componentDidMount() {
    if (this.state.course) {
      return;
    }
    this.setState({ loading: true });

    this.props.firebase.course(this.props.match.params.id).on('value', snapshot => {
      this.setState({
        course: snapshot.val(),
        loading: false,
      })
      
    })

  }

  componentWillUnmount() {
    this.props.firebase.course(this.props.match.params.id).off();
  }

  
  render() {
    const { course, loading } = this.state;

    return (
      <div className="content">
        <div id="ViewCourse">
          <h1>{this.props.location.state.course.title}</h1>
          <h3>Level {this.props.location.state.course.level}</h3>
          
          <p>{this.props.location.state.course.description}</p>

          <Link to={ROUTES.COURSES}><Button >Back to courses</Button></Link>
        </div>
      </div>
    )
  }
}
const Courses = withFirebase(CoursesBase);
const CourseItemView = withFirebase(CourseItemBase);
const condition = authUser => !!authUser && !authUser.roles.includes(ROLES.BANNED);

export default withAuthorization(condition)(CoursesPage);