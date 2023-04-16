import React, { Component } from "react";
import { Link } from "react-router-dom";
import Pagination from "../common/pagination";
import ListGroup from "../listgroup";
import Posts from "../dashboard/posts";
import { paginate } from "../../utils/paginate";
import { api } from "../../config.js";
import http from "../../services/httpService";
import Jumotron from "../common/jumbotron";

class UserListDashboard extends Component {
  state = {
    allusers: [],
    currentPage: 1,
    pageSize: 4,
    // tags: [],
    // selectedTag: { _id: "1", name: "All Posts" },
  };
  async componentDidMount() {
    const { data: allusers } = await http.get(api.postsEndPoint);
    // const { data: tags } = await http.get(api.tagsEndPoint);

    this.setState({
      allusers: [...allusers],
      // tags: [
      //   {
      //     _id: "1",
      //     name: "All Posts",
      //   },
      //   ...tags,
      // ],
    });
  }
  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };
  handlePostDelete = (post) => {};
  // handleTagSelect = (tag) => {
  //   this.setState({ selectedTag: tag, currentPage: 1 });
  // };
  
  getPosts() {
    const { allusers } = this.state;
    const filtered = [];
    for (let i in allusers) {
      const post = allusers[i];
      // const { tags } = post;
      // for (let j in tags) {
      //   if (tags[j].name === selectedTag.name) {
      //     filtered.push(post);
      //     break;
      //   }
      // }
    }
    console.log(filtered);
    return filtered;
  }
  render() {
    const { user } = this.props;
    const { allusers, pageSize, currentPage } = this.state;
    const filtered = allusers && allusers.length > 1 ? allusers : this.getPosts();
    const posts = paginate(filtered, currentPage, pageSize);
    if (allusers.length === 0)
      return <p>There are no user here!</p>;
    return (
      <React.Fragment>
        <Jumotron />
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="d-flex w-100 justify-content-between m-3">
                Showing {filtered.length} posts.
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
              <Posts posts={posts} onDelete={this.handlePostDelete} />
            </div>
            <div className="col-3">
              {/* <ListGroup
                items={tags}
                selectedTag={this.state.selectedTag}
                onTagSelect={this.handleTagSelect}
              /> */}
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

export default Dashboard;
