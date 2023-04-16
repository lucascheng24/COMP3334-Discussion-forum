import React, { Component } from "react";
import { Link } from "react-router-dom";
import Pagination from "../common/pagination";
import ListGroup from "../listgroup";
import UserItems from "./userItems";
import { paginate } from "../../utils/paginate";
import { api } from "../../config.js";
import http from "../../services/httpService";
import Jumotron from "../common/jumbotron";

class UserListDashboard extends Component {
  state = {
    allusers: [],
    currentPage: 1,
    pageSize: 4,
  };
  async componentDidMount() {
    const { data: allusers } = await http.get(`${api.lifelogEndPoint}all`);

    this.setState({
      allusers: [...allusers],
    });
  }
  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };
  handlePostDelete = (post) => {};

  async getUsers() {
    const { data: allusers } = await http.get(`${api.lifelogEndPoint}all`);

    this.setState({
      allusers: [...allusers],
    });
  }
  render() {
    const { user } = this.props;
    const { allusers, pageSize, currentPage } = this.state;
    // const filtered = allusers && allusers.length > 1 ? allusers : this.getPosts();
    const allusersList = allusers && allusers.length > 1 ? allusers : this.getUsers();
    // const users = paginate(allusersList, currentPage, pageSize);



    // const { data: allusers } = await getAllUsers(user.) 
    // http.get(api.postsEndPoint);
    // const { data: jwt } = await login(data.email, data.password);
    // const { data: tags } = await http.get(api.tagsEndPoint);




    if (allusers.length === 0)
      return <p>There are no user here!</p>;
    return (
      <React.Fragment>
        <Jumotron />
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="d-flex w-100 justify-content-between m-3">
                Showing {allusersList.length} users.
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-9">
              <UserItems users={allusersList}  />
            </div>
            <div className="col-3">
              {/* <ListGroup
                items={tags}
                selectedTag={this.state.selectedTag}
                onTagSelect={this.handleTagSelect}
              /> */}
            </div>
            {/* <Pagination
              itemCount={users.length}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={this.handlePageChange}
            /> */}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default UserListDashboard;
