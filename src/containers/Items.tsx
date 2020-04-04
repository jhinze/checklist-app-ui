import React, {Component} from 'react';
import {Item, List} from "../types/types";
import Add from "../components/Add";
import ItemCard from "../components/ItemCard";
import axios from "axios";
import {config} from "../config/api";
import {Redirect, RouteComponentProps, withRouter} from "react-router";
import {Alert} from "react-bootstrap";
import NavBar from "../components/NavBar";
import LoadingSpinner from "../components/LoadingSpinner";


interface Params {
  listId?: string
}

interface ItemsState {
  list: List
  error?: string
  redirect?: string
  loading: boolean
  toggling: Map<string, boolean>
  showOnlyTodo?: string | null
}

class Items extends Component<RouteComponentProps<Params>, ItemsState> {

  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      list: {
        title: "",
        category: "",
        items: [],
      },
      loading: true,
      toggling: new Map<string, boolean>(),
    };
  }

  componentDidMount(): void {
    axios.get(`/list/${this.props.match.params.listId}?withItems=true`, config)
      .then((response) => {
        const list :List = response.data;
        if(list.items) {
          list.items = list.items.sort((a: Item, b: Item) =>
            a.updatedAt && b.updatedAt ?
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
              : 0
          );
        }
        this.setState({
          list: list,
          error: undefined,
          loading: false,
          showOnlyTodo: localStorage.getItem(this.localStorageShowOnlyTodoKey(list))
        });
      })
      .catch((error) => {
        this.setState({
          error: error.message,
          loading: false
        });
        console.log(error)
      });
  }

  localStorageShowOnlyTodoKey = (list: List) => {
    return `showOnlyTodo-${list.id}`
  };

  toggleShowAll = (checked: boolean) => {
    if(!checked) {
      localStorage.setItem(this.localStorageShowOnlyTodoKey(this.state.list), `${!checked}`);
    } else {
      localStorage.removeItem(this.localStorageShowOnlyTodoKey(this.state.list));
    }
    this.setState({
      showOnlyTodo: checked ? undefined : "true"
    })
  };

  getItems = () => {
    return this.state.list.items ? this.state.list.items : [];
  };

  toggleCompleteItem = (item: Item) => {
    this.setState({
      toggling: this.updateIsToggling(item, true)
    });
    this.setItemComplete(item, item.doneAt);
  };

  setItemComplete = (item: Item, complete: Date | undefined | null) => {
    axios.put(`/list/${this.props.match.params.listId}/item/${item.id}/${complete ? "incomplete" : "complete"}`, '', config)
      .then((response) => {
        this.setState({
          list: this.updateItemInList(item, complete ? undefined : response.data.doneAt),
          error: undefined,
          toggling: this.updateIsToggling(item, false)
        });
      })
      .catch((error) => {
        this.setState({
          error: error.message
        });
        console.log(error)
      });
  };

  updateItemInList = (item: Item, doneAt: Date | undefined): List => {
    let items = this.getItems();
    let index = items.indexOf(item);
    item.doneAt = doneAt;
    items[index] = item;
    let list = this.state.list;
    list.items = items;
    return list;
  };

  updateIsToggling = (item: Item, isToggling: boolean): Map<string, boolean> => {
    const toggling = this.state.toggling;
    if(item.id) {
      toggling.set(item.id, isToggling);
    }
    return toggling
  };

  onClickItem = (item: Item) => {
    this.redirect(`/list/${this.props.match.params.listId}/item/${item.id}`)
  };

  onClickAdd = () => {
    this.redirect(`/list/${this.props.match.params.listId}/item/add`)
  };

  onClickListTitle = (list: List) => {
    this.redirect(`/list/${this.props.match.params.listId}/edit`);
  };

  backToLists = () => {
    this.redirect("/");
  };

  redirect = (to: string) => {
    this.props.history.push(`/list/${this.props.match.params.listId}`);
    this.setState({
      redirect: to
    })
  };

  itemCard = (item: Item) => {
    return <ItemCard
            item={item}
            onClick={() => this.onClickItem(item)}
            key={item.id}
            toggleComplete={() => this.toggleCompleteItem(item)}
            toggling={item.id && this.state.toggling.has(item.id) && this.state.toggling.get(item.id)}
          />;
  };

  render() {

    if(this.state.redirect) {
      return <Redirect to={this.state.redirect}/>
    }

    const items = this.state.list.items ? this.state.list.items : [];

    return (
      <div>
        <NavBar
          title={this.state.loading ? "Loading..." : this.state.list.title}
          onClickTitle={() => this.onClickListTitle(this.state.list)}
          back={this.backToLists}
          onToggle={this.toggleShowAll}
          toggleChecked={this.state?.showOnlyTodo !== "true"}
        />
        {
          this.state.loading
            ?
              <LoadingSpinner/>
            :
              <div>
                <div hidden={this.state.error !== undefined}>
                  {
                    items.map((item) => {
                      return (
                        this.state.showOnlyTodo
                          ?
                            !item.doneAt && this.itemCard(item)
                          :
                            this.itemCard(item)
                      )
                    })
                  }
                    < Add onClick={this.onClickAdd}/>
                </div>
                <Alert className={"col-12"} variant={"danger"} show={this.state.error !== undefined}>
                  { this.state.error }
                </Alert>
              </div>
        }
      </div>
    )
  }

}

export default withRouter(Items);