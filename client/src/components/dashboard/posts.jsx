import React from "react";
import { Link } from "react-router-dom";

const Posts = (props) => {
  const { posts } = props;
  return (
    <div className="list-group">
      {/* reverse the posts: from new to old */}
      {posts.slice(0).reverse().map((post) => (
      // {posts.map((post) => (
        <Link
          className="list-group-item list-group-item-action flex-column align-items-start"
          to={`/post/${post._id}`}
        >
          <div className="d-flex w-100 justify-content-between" key={post._id}>
            <h5 className="mb-1">{post.title}</h5>
          </div>
          <small>Created by {post.author && post.author.name ? post.author.name : `null`}</small>
          <br />
          <small className="overflow-hidden">{post.description}</small>
          <div className="mt-1">
            Related Topics:
            {post.tags.map((tag) => (
              <span className="badge badge-secondary m-1 p-2">{tag.name??`unknow`}</span>
            ))}
            <h6 className="mt-2">
              {post.upvotes.length} Likes | {post.views} Views
            </h6>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Posts;
