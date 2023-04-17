import React from "react";
import {Link} from 'react-router-dom'

const UserItems = (props) => {
  const { users } = props;
  return (
    <div className="list-group">
      {users.map((user) => (
        <Link
          className="list-group-item list-group-item-action flex-column align-items-start shadow-sm"
          to={`/personallifelog/${user.username}`}
          style={{marginTop:"0.5rem", marginBottom:"0.5rem", backgroundColor:"white"}}
        >
          <div className="d-flex w-100 justify-content-between" key={user.username} style={{marginBottom:"-1.5rem"}}>
            <h5 className="mb-1">{user.name}</h5>
          </div>
          <br />
        </Link>
      ))}
    </div>
  );
};

export default UserItems;

