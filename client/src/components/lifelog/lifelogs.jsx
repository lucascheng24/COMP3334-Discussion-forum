import React, { Component } from "react";
import { Link } from "react-router-dom";
import Pagination from "../common/pagination";
import ListGroup from "../listgroup";
import Posts from "../dashboard/posts";
import { paginate } from "../../utils/paginate";
import { api } from "../../config.js";
import http from "../../services/httpService";
import Jumotron from "../common/jumbotron";

const LifeLogs = (props) => {
  const { lifelogs, logger } = props;
  return (
    <div className="list-group">
      {/* reverse the posts: from new to old */}
      {lifelogs.slice(0).reverse().map((lifelog) => (
        <div className="list-group-item list-group-item-action flex-column align-items-start">
        {/* <Link
          to={`/post/${lifelog._id}`}
        > */}
          <div className="d-flex w-100 justify-content-between" key={lifelog._id}>
            <h5 className="mb-1">{lifelog.title}</h5>
          </div>
          <small>Created by {logger}</small>
          <br />
          <small className="overflow-hidden">{lifelog.description}</small>
          <div className="mt-1">
            {/* Related Topics:
            {post.tags.map((tag) => (
              <span className="badge badge-secondary m-1 p-2">{tag.name}</span>
            ))} */}
            <h6 className="mt-2">
              {lifelog.upvotes.length} Likes
            </h6>
          </div>
        {/* </Link> */}
        </div>
      ))}
    </div>
  );
};

export default LifeLogs;
