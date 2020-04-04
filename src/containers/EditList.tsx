import React, {Component} from 'react';
import {List} from "../types/types";
import {Button, Container, FormControl, InputGroup, Row, Alert} from "react-bootstrap";
import axios from "axios";
import {config} from "../config/api";
import {Redirect, RouteComponentProps, withRouter} from "react-router";
import NavBar from "../components/NavBar";
import LoadingSpinner from "../components/LoadingSpinner";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";


interface Params {
  listId?: string
}

interface EditListState {
  list?: List
  alert?: string
  redirect?: string
  loading: boolean
  showConfirmDelete: boolean
}

const CATEGORIES = [
  "Grocery",
  "Chores",
  "Dog",
  "Travel",
  "Household",
  "Gifts",
  "Work",
  "Other"
];

class EditList extends Component<RouteComponentProps<Params>, EditListState> {

  constructor(props: RouteComponentProps<Params>) {
    super(props);
    this.state = {
      list: {
        category: CATEGORIES[0],
        title: "",
      },
      loading: props.match.params.listId !== undefined,
      showConfirmDelete: false
    }
  }

  componentDidMount(): void {
    if(this.props.match.params.listId) {
      axios.get(`/list/${this.props.match.params.listId}`, config)
        .then((response) => {
          this.setState({
            list: response.data,
            alert: undefined,
            loading: false
          });
        })
        .catch((error) => {
          this.setState({
            alert: error.message,
            loading: false
          });
          console.log(error)
        });
    }
  }

  handleDeleteClick = () => {
    this.setState({
      showConfirmDelete: true
    })
  };

  handleCancelDelete = () => {
    this.setState({
      showConfirmDelete: false
    })
  };

  handleTitleInput = (event: any) => {
    let list = Object.assign(
      this.state.list,
      {
        title: event.target.value
      });
    this.setState({
      list: list
    });
  };

  handleCategorySelect = (event: any) => {
    let list = Object.assign(
      this.state.list,
      {
        category: event.target.value
      });
    this.setState({
      list: list
    });
  };

  saveList = () => {
    if(this.state.list?.title.length === 0) {
      this.setState({
        alert: "Title is empty"
      });
      return;
    }
    this.setState({
      loading: true
    });
    if(this.state.list?.id) {
      //modify list
      axios.put(`/list/${this.state.list?.id}`, this.state.list, config)
        .then((response) => {
          this.onBack();
        })
        .catch((error) => {
          this.setState({
            alert: error.message,
            loading: false
          });
          console.log(error)
        });
    } else {
      //add list
      axios.post('/list', this.state.list, config)
        .then((response) => {
          this.onBack();
        })
        .catch((error) => {
          this.setState({
            alert: error.message,
            loading: false
          });
          console.log(error)
        });
    }
  };

  deleteList = () => {
    this.setState({
      loading: true
    });
    axios.delete(`/list/${this.state.list?.id}`, config)
      .then((response) => {
        this.redirect("/")
      })
      .catch((error) => {
        this.setState({
          alert: error.message,
          loading: false
        });
        console.log(error)
      });
  };

  onBack = () => {
    if(this.props.match.params.listId){
      this.redirect(`/list/${this.props.match.params.listId}`);
    } else {
      this.redirect("/");
    }
  };

  redirect = (to: string) => {
    this.setState({
      redirect: to
    })
  };

  render() {

    if(this.state.redirect) {
      return <Redirect to={this.state.redirect}/>
    }

    return (
      <div>
        <NavBar title={this.state.loading ? "Loading..." : (this.state.list?.id === undefined ? "Create " : "Edit ") +"List"} back={this.onBack}/>
        {
          this.state.loading
            ?
              <LoadingSpinner/>
            :
              <Container>
                {
                this.state.alert
                  ?
                    <div>
                      <Row className={"m-3"}>
                          <Alert className={"col-12"} variant={"danger"}>
                            {this.state.alert}
                          </Alert>
                      </Row>
                    </div>
                  :
                    <div>
                      <ConfirmDeleteModal
                        element={this.state.list?.title}
                        show={this.state.showConfirmDelete}
                        onConfirm={this.deleteList}
                        onCancel={this.handleCancelDelete}/>
                      <Row className={"m-3"}>
                        <label>Title</label>
                        <InputGroup>
                          <FormControl size={"lg"} defaultValue={this.state.list?.title} onChange={this.handleTitleInput}
                                       placeholder={"Title"}/>
                        </InputGroup>
                      </Row>
                      <Row className={"m-3"}>
                        <label>Category</label>
                        <InputGroup>
                          <select defaultValue={this.state.list?.category} onChange={this.handleCategorySelect}
                                  className="custom-select" style={{fontSize: "20px", paddingTop: "8px", paddingBottom: "8px"}} required>
                            {
                              CATEGORIES.map((category, index) => {
                                return (
                                  <option key={index} value={category}>{category}</option>
                                )
                              })
                            }
                          </select>
                        </InputGroup>
                      </Row>
                      <Row className={"mt-4 m-3"}>
                        <Button size={"lg"} onClick={this.saveList} className={"col-12"} variant="success">Save</Button>
                      </Row>
                      <Row className={"mt-4 m-3"}>
                        {this.state.list?.id &&
                        <Button size={"lg"} onClick={this.handleDeleteClick} className={"col-12"} variant="danger">Delete</Button>
                        }
                      </Row>
                      <Row className={"m-3"}>
                        <Alert className={"col-12"} variant={"danger"} show={this.state.alert !== undefined}>
                          {this.state.alert}
                        </Alert>
                      </Row>
                    </div>
                  }
              </Container>
        }
      </div>
    )
  }

}

export default withRouter(EditList)