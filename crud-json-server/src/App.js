import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Lists from "./Lists";
import CreateList from "./CreateList";

class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: false,
        alldata: [],
        singledata: {
          title: "",
          author: ""
        }
      };
    }

    getLists = () =>{
      fetch("http://localhost:5000/posts")
      .then(res => res.json())
      .then(result =>
        this.setState({
          loading:false,
          alldata: result
        } )
      )
      .catch(console.log)
    }

    handleChange = (event) => {
      let title = this.state.singledata.title;
      let author = this.state.singledata.author;
      if (event.target.name === "title") title = event.target.value;
      if (event.target.name === "author") author = event.target.value;
      this.setState({ singledata: { title, author } });
    }

    postList = () => {
      fetch("http://localhost:5000/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: this.state.singledata.title,
          author: this.state.singledata.author
        })
      })
        .then(res => res.json())
        .then(result => {
          this.setState({
            singledata: { title: "", author: "" }
          });
          this.getLists();
        })
        .catch(console.log);
    }

    getSingleItem = (event, id) => {
      this.setState({
        singledata: { title: "Loading...", author: "Loading..." }
      });
      fetch("http://localhost:5000/posts/" + id)
        .then(res => res.json())
        .then(result =>
          this.setState({
            singledata: {
              title: result.title,
              author: result.author
            }
          })
        )
        .catch(console.log);
    }

    updateList = (event, id) => {
      fetch("http://localhost:5000/posts/" + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: this.state.singledata.title,
          author: this.state.singledata.author
        })
      })
        .then(res => res.json())
        .then(result => {
          this.setState({ singledata: { title: "", author: "" } });
          this.getLists();
        })
        .catch(console.log);
    }

    deleteList = (event, id) => {
      fetch("http://localhost:5000/posts/" + id, {
        method: "DELETE"
      })
        .then(() => this.getLists())
        .catch(console.log);
    }

    render() {
      const listTable = this.state.loading ?(
        <span>Loading Data....Please be patient</span>
      ):(
        <Lists
              alldata={this.state.alldata}
              getLists={this.getLists}
              getSingleItem={this.getSingleItem}
              updateList={this.updateList}
              deleteList={this.deleteList}
              singledata={this.state.singledata}
              handleChange={this.handleChange}
            />
      );
      return (
        <div className="container">
          <span className="title-bar">
            <button
            type="button"
            className="btn btn-primary"
            onClick={this.getLists}>
              Get Lists
            </button>
            <CreateList
              singledata={this.state.singledata}
              handleChange={this.handleChange}
              postList={this.postList}
            />
            {listTable}
          </span>
        </div>
      )
    }
  }

export default App;