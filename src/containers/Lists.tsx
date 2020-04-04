import React, {Component} from 'react';
import {List} from "../types/types";
import ListCard from "../components/ListCard";
import Add from "../components/Add";
import {Redirect, RouteComponentProps, withRouter} from "react-router";
import axios from "axios";
import {config} from "../config/api";
import {Alert} from "react-bootstrap";
import NavBar from "../components/NavBar";
import LoadingSpinner from "../components/LoadingSpinner";

interface Params {

}

interface ListsState {
  lists: List[]
  loading: boolean
  redirect?: string
  error?: string
}

class Lists extends Component<RouteComponentProps<Params>, ListsState> {

  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      loading: true,
      lists: [],
    };
  }

  componentDidMount(): void {
    axios.get('/list?withItemsSummary=true', config)
      .then((response) => {
        this.setState({
          loading: false,
          lists: response.data.sort((a: List, b: List) =>
              a.itemsSummary?.lastUpdated && b.itemsSummary?.lastUpdated ?
                new Date(b.itemsSummary?.lastUpdated).getTime() - new Date(a.itemsSummary?.lastUpdated).getTime()
                : 0
              )
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
          error: error.message
        });
        console.log(error)
      });
  }

  onClickAdd = () => {
    this.redirect("/list/add")
  };

  onClickList = (listId: string) => {
    this.redirect(`/list/${listId}`)
  };

  redirect = (to: string) => {
    this.props.history.push("/");
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
        <NavBar title={this.state.loading ? "Loading..." : "Checklists"}/>
        { this.state.loading
          ?
            <LoadingSpinner/>
          :
            <div>
            {
              this.state.error ?
                <div>
                  <br/>
                  <br/>
                  <Alert className={"col-12"} variant={"danger"} show={true}>
                    {this.state.error}
                  </Alert>
                </div>
                :
                <div>
                  {
                    this.state.lists.map((list) => {
                      return (
                        <ListCard
                          list={list}
                          onClick={this.onClickList}
                          key={list.id}
                        />
                      )
                    })
                  }
                  < Add onClick={this.onClickAdd}/>
                </div>
            }
            </div>
        }
      </div>
    )
  }
}

export default withRouter(Lists)