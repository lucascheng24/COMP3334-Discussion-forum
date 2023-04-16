import React, { Component } from "react";
import { Link } from "react-router-dom";
import Pagination from "../common/pagination";
import ListGroup from "../listgroup";
import { paginate } from "../../utils/paginate";
import { api } from "../../config.js";
import http from "../../services/httpService";
import Jumotron from "../common/jumbotron";

class UserLifelogDashboard extends Component {
  state = {
    alllifelogs: [],
    currentPage: 1,
    pageSize: 4,
    tags: [],
    selectedTag: { _id: "1", name: "All lifelogs" },
  };
  async componentDidUpdate() {
    console.log('enter UserLifelogDashboard')
  }

  async componentDidUpdate(prevProps) {
    const { selectedUser } = this.props.match.params;
  
    if (prevProps.match.params.selectedUser !== selectedUser) {
      console.log('enter UserLifelogDashboard');
      const lifelogs = await this.getlifelogs(selectedUser);
      this.setState({ ...this.state, alllifelogs: lifelogs });
    }
  }

  async componentDidMount() {
    const selectedUser = this.props.match.params.selectedUser;
    const { data: lifelogs } = await http.get(api.lifelogEndPoint + selectedUser);
    // const { data: replies } = await http.get(api.repliesEndPoint  + id);
    this.setState({ ...this.state, alllifelogs: lifelogs });
  }
  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };
  handlePostDelete = (post) => {};
  handleTagSelect = (tag) => {
    this.setState({ selectedTag: tag, currentPage: 1 });
  };
  async getlifelogs(selectedUser) {
    console.log('get life logs from ', selectedUser)
    const { data: lifelogs } = await http.get(`${api.lifelogEndPoint}${selectedUser}`);

    this.setState({
      ...this.state,
      alllifelogs: lifelogs
    });

    return lifelogs
  }
  render() {

    const current_path = window.location.pathname
    const selectedUser = current_path.replace('/lifelog/', '')

    console.log('selectedUser: ', selectedUser)

    const { user } = this.props;
    const { alllifelogs, pageSize, currentPage, tags, selectedTag } = this.state;
    const filtered = alllifelogs && alllifelogs.length > 1 ? alllifelogs : this.getlifelogs(selectedUser);
    const lifelogs = paginate(filtered, currentPage, pageSize);


    console.log('UserLifelogDashboard')


    if (alllifelogs.length === 0)
      return <p>There are no lifelogs in the database!
        <div className="d-flex w-100 justify-content-between m-3">
                {(user && user.username == selectedUser) && (
                  <Link to="/new-post">
                    <button
                      type="button"
                      className="btn btn-success"
                      style={{ marginBottom: 20 }}
                    >
                      New Post
                    </button>
                  </Link>
                )}
              </div>
      </p>;
    return (
      <React.Fragment>
        <Jumotron />
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="d-flex w-100 justify-content-between m-3">
                Showing {filtered.length} lifelogs.
                {user && (
                  <Link to="/new-post">
                    <button
                      type="button"
                      className="btn btn-success"
                      style={{ marginBottom: 20 }}
                    >
                      New Post
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-9">
              <lifelogs lifelogs={lifelogs} onDelete={this.handlePostDelete} />
            </div>
            <div className="col-3">
              <ListGroup
                items={tags}
                selectedTag={this.state.selectedTag}
                onTagSelect={this.handleTagSelect}
              />
            </div>
            <Pagination
              itemCount={filtered.length}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={this.handlePageChange}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default UserLifelogDashboard;
