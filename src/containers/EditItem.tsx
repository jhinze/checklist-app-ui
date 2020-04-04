import React, {Component} from 'react';
import {Item} from "../types/types";
import {Redirect, RouteComponentProps, withRouter} from "react-router";
import NavBar from "../components/NavBar";
import axios from "axios";
import {config} from "../config/api";
import {Alert, Button, Container, FormControl, InputGroup, Row} from "react-bootstrap";
import LoadingSpinner from "../components/LoadingSpinner";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

interface Params {
  itemId?: string
  listId?: string
}

interface EditItemState {
  item?: Item
  alert?: string
  redirect?: string
  loading: boolean
  showConfirmDelete: boolean
}

class EditItem extends Component<RouteComponentProps<Params>, EditItemState> {

  constructor(props: RouteComponentProps<Params>) {
    super(props);
    this.state = {
      item: {
        description: ""
      },
      loading: props.match.params.itemId !== undefined,
      showConfirmDelete: false
    }
  }

  componentDidMount(): void {
    if(this.props.match.params.listId && this.props.match.params.itemId) {
      axios.get(`/list/${this.props.match.params.listId}/item/${this.props.match.params.itemId}`, config)
        .then((response) => {
          this.setState({
            item: response.data,
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

  saveItem = () => {
    if(this.state.item?.description.length === 0) {
      this.setState({
        alert: "Description is empty"
      });
      return;
    }
    this.setState({
      loading: true
    });
    if(this.state.item?.id) {
      //modify item
      axios.put(`/list/${this.state.item?.listId}/item/${this.state.item?.id}`, this.state.item, config)
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
      //add item
      axios.post(`/list/${this.props.match.params.listId}/item`, this.state.item, config)
        .then((response) => {
          this.onBack();
        })
        .catch((error) => {
          this.setState({
            alert: error.message,
            loading: false,
          });
          console.log(error)
        });
    }
  };

  deleteItem = () => {
    this.setState({
      loading: true
    });
    axios.delete(`/list/${this.state.item?.listId}/item/${this.state.item?.id}`, config)
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
  };

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

  handleDescriptionChange = (event: any) => {
    let item = Object.assign(
      this.state.item,
      {
        description: event.target.value
      });
    this.setState({
      item: item
    });
  };

  onBack = () => {
    this.redirect(`/list/${this.props.match.params.listId}`);
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
        <NavBar title={this.state.loading ? "Loading..." : (this.state.item?.id === undefined ? "Create " : "Edit ") +"Item"} back={this.onBack}/>
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
                          element={this.state.item?.description}
                          show={this.state.showConfirmDelete}
                          onConfirm={this.deleteItem}
                          onCancel={this.handleCancelDelete}/>
                        <Row className={"m-3"}>
                          <label>Description</label>
                          <InputGroup>
                            <FormControl size={"lg"} defaultValue={this.state.item?.description} onChange={this.handleDescriptionChange}
                                         placeholder={"Description"}/>
                          </InputGroup>
                        </Row>
                        <Row className={"mt-4 m-3"}>
                          <Button size={"lg"} onClick={this.saveItem} className={"col-12"} variant="success">Save</Button>
                        </Row>
                        <Row className={"mt-4 m-3"}>
                          {this.state.item?.id &&
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

export default withRouter(EditItem)