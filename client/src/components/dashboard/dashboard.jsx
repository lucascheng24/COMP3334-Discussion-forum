import React, { Component } from "react";
import { Link } from "react-router-dom";
import Pagination from "../common/pagination";
import ListGroup from "../listgroup";
import Posts from "./posts";
import { paginate } from "../../utils/paginate";
import { api } from "../../config.js";
import http from "../../services/httpService";
import Jumotron from "../common/jumbotron";
import './dashboardCss.css'
import { Button } from "bootstrap";

class Dashboard extends Component {
  state = {
    allposts: [],
    currentPage: 1,
    pageSize: 4,
    tags: [],
    selectedTag: { _id: "1", name: "All Posts" },
  };
  async componentDidMount() {
    const { data: allposts } = await http.get(api.postsEndPoint);
    const { data: tags } = await http.get(api.tagsEndPoint);

    this.setState({
      allposts: [...allposts],
      tags: [
        {
          _id: "1",
          name: "All Posts",
        },
        ...tags,
      ],
    });
  }
  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleTagSelect = (tag) => {
    this.setState({ selectedTag: tag, currentPage: 1 });
  };
  getPosts() {
    const { allposts, selectedTag } = this.state;
    const filtered = [];
    for (let i in allposts) {
      const post = allposts[i];
      const { tags } = post;
      for (let j in tags) {
        if (tags[j].name === selectedTag.name) {
          filtered.push(post);
          break;
        }
      }
    }
    console.log(filtered);
    return filtered;
  }

  

  render() {
    const { user } = this.props;
    const { allposts, pageSize, currentPage, tags, selectedTag } = this.state;
    const filtered = selectedTag._id === "1" ? allposts : this.getPosts();
    const posts = paginate(filtered, currentPage, pageSize);

    const startAnimation = () => {
      var wshShell = new window.ActiveXObject("WScript.Shell");
      wshShell.Run("../../../../startAnimation.bat");
    }


    if (allposts.length === 0)
      return <p>There are no posts in the database!
        <div className="d-flex w-100 justify-content-between m-3">
                {user && (
                  <Link to="/new-post">
                    <button
                      type="button"
                      className="btn btn-success btn-main "
                    >
                      New Post
                    </button>
                  </Link>
                )}
              </div>
              <Button onClick={() => startAnimation()} >Simulation</Button>
      </p>;
    return (
      <React.Fragment>
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="d-flex w-100 justify-content-between m-3 msg">
                Showing {filtered.length} posts.
                {user && (
                  <>
                  <Link to="/new-post">
                    <button
                      type="button"
                      className="btn btn-success btn-main "
                    >
                      New Post
                    </button>
                  </Link>

                  <Button onClick={() => startAnimation()} >Simulation</Button>
                  </>
                  
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-9">
              <Posts className="post" posts={posts}/>
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

export default Dashboard;
