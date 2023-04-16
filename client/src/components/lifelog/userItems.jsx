import React from "react";
import {Link} from 'react-router-dom'

const UserItems = (props) => {
  const { users } = props;
  return (
    <div className="list-group">
      {/* reverse the posts: from new to old */}
      {users.map((user) => (
      // {posts.map((post) => (
        <Link
          className="list-group-item list-group-item-action flex-column align-items-start"
          to={`/lifelog/${user.username}`}
        >
          <div className="d-flex w-100 justify-content-between" key={user.username}>
            <h5 className="mb-1">{user.name}</h5>
          </div>
          <br />
        </Link>
      ))}
    </div>
  );
};

export default UserItems;
