import React, { useState, useEffect } from "react";
import Pagination from "../common/pagination";
import ListGroup from "../listgroup";
import { paginate } from "../../utils/paginate";
import { api } from "../../config.js";
import http from "../../services/httpService";
import Jumotron from "../common/jumbotron";
import Lifelogs from "./lifelogs";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Input from "../common/input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/react-toastify.esm";

const UserLifelogDashboard = ({ user, match }) => {
  const [alllifelogs, setAllLifelogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  // const [selectedTag, setSelectedTag] = useState({ _id: "1", name: "All lifelogs" });
  const [showModal, setShowModal] = useState(false);
  const [inputTitle, setInputTitle] = useState("");
  const [inputDescription, setInputDescription] = useState("");

  useEffect(() => {
    console.log("enter UserLifelogDashboard");
  }, []);

  async function getlifelogs(selectedUser) {
    console.log("get life logs from ", selectedUser);

    if (selectedUser) {
      const { data: lifelogs } = await http.get(`${api.lifelogEndPoint}/get/${selectedUser}`);

      setAllLifelogs(lifelogs);
    }
  }

  useEffect(() => {
    const selectedUser = match.params.username;
    console.log('match', match)
    getlifelogs(selectedUser);
  }, [match.params.selectedUser]);

  function handlePageChange(page) {
    setCurrentPage(page);
  }

  function handlePostDelete(post) {}

  // function handleTagSelect(tag) {
  //   setSelectedTag(tag);
  //   setCurrentPage(1);
  // }

  const current_path = window.location.pathname;
  const selectedUser = current_path.replace("/personallifelog/", "");

  console.log("selectedUser: ", selectedUser);

  // const lifelogs = paginate(alllifelogs, currentPage, pageSize);

  console.log("UserLifelogDashboard");

  const handleModalClose = () => {
    setShowModal(false)
  }

  const createLifeLog = async () => {
    if(!!inputTitle && inputTitle.length < 10) {
      toast.error("Title must be more than 10 characters");
    }
    if(!!inputDescription && inputTitle.length < 10) {
      toast.error("Description must be more than 10 characters");
    }

    if ((!!inputTitle && inputTitle.length > 9) && (!!inputDescription && inputTitle.length > 9)) {
      //  sending api to add lifelogs
      try {
        // const { data } = this.state;
        await http.post(`${api.lifelogEndPoint}/create`, {
          title: inputTitle,
          description: inputDescription,
          author: selectedUser
        }).then((res) => {
          if (res.status === 200) {
            setShowModal(false);
            setInputTitle("");
            setInputDescription("");
            getlifelogs(selectedUser);

          } else {
            toast.error('Network error');
            setShowModal(false);
          }
          // console.log('create response', res);
        });
        
        // window.location = "/dashboard";
      } catch (error) {
        toast.error(error);
      }
    }
  }

  if (alllifelogs.length === 0)
    return (
      <p>
        There are no lifelogs in the database!
        <div className="d-flex w-100 justify-content-between m-3">
          {user && user.username === selectedUser && (
            <Button className="btn btn-success" variant="primary" onClick={() => setShowModal(true)}>
              New Lifelog
            </Button>
          )}
          {/* <Link to={`/personallifelog/${selectedUser}/tags`} className="btn btn-secondary">
            Tags
          </Link> */}
        </div>
      </p>
    );

  return (
    <React.Fragment>
      <Jumotron title={`Life logs of ${selectedUser}`} />
      <div className="row">
        <div className="col-3">
        </div>
        <div className="col">
          {user && user.username === selectedUser && (
            <Button className="btn btn-success" variant="primary" onClick={() => setShowModal(true)}>
              New Lifelog
            </Button>
          )}
          <Lifelogs
            lifelogs={alllifelogs}
            onDelete={handlePostDelete}
            user={user}
            selectedUser={selectedUser}
          />
          {/* <Pagination
            itemsCount={alllifelogs.length}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          /> */}
        </div>
        <div className="col-3">
        </div>
      </div>
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Lifelog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Add your new lifelog here</p>
          <Input
            label={"Title"}
            value={inputTitle} 
            onChange={(e) => {
              setInputTitle(e.target.value)
            }}
          />
          <Input
            label={"Description"}
            value={inputDescription} 
            onChange={(e) => {
              setInputDescription(e.target.value)
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => createLifeLog()}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </React.Fragment>
  );
};

export default UserLifelogDashboard;


// import React, { Component, useState } from "react";
// import { Link } from "react-router-dom";
// import Pagination from "../common/pagination";
// import ListGroup from "../listgroup";
// import { paginate } from "../../utils/paginate";
// import { api } from "../../config.js";
// import http from "../../services/httpService";
// import Jumotron from "../common/jumbotron";
// import Lifelogs from "./lifelogs";
// import Button from "react-bootstrap/Button";
// import Modal from "react-bootstrap/Modal";

// class UserLifelogDashboard extends Component {
//   state = {
//     alllifelogs: [],
//     currentPage: 1,
//     pageSize: 4,
//     selectedTag: { _id: "1", name: "All lifelogs" },
//   };
//   async componentDidUpdate() {
//     console.log("enter UserLifelogDashboard");
//   }

//   async getlifelogs(selectedUser) {
//     console.log("get life logs from ", selectedUser);

//     var lifelogs = [];

//     if (selectedUser) {
//       const { data: lifelogs } = selectedUser
//         ? await http.get(`${api.lifelogEndPoint}/get/${selectedUser}`)
//         : [];

//       this.setState({
//         ...this.state,
//         alllifelogs: lifelogs,
//       });
//     }

//     return lifelogs;
//   }

//   // async componentDidMount() {
//   //   const selectedUser = this.props.match.params.selectedUser;
//   //   const { data: lifelogs } = this.getlifelogs(selectedUser);
//   //   // const { data: replies } = await http.get(api.repliesEndPoint  + id);
//   //   this.setState({ ...this.state, alllifelogs: lifelogs });
//   // }
//   handlePageChange = (page) => {
//     this.setState({ currentPage: page });
//   };
//   handlePostDelete = (post) => {};
//   handleTagSelect = (tag) => {
//     this.setState({ selectedTag: tag, currentPage: 1 });
//   };

//   render() {
//     const current_path = window.location.pathname;
//     const selectedUser = current_path.replace("/personallifelog/", "");

//     console.log("selectedUser: ", selectedUser);

//     const { user } = this.props;
//     const { alllifelogs, pageSize, currentPage, selectedTag } = this.state;
//     const [showModal, setShowModal] = useState(false);

//     const filtered =
//       alllifelogs && alllifelogs.length > 1
//         ? alllifelogs
//         : this.getlifelogs(selectedUser);
//     const lifelogs = paginate(filtered, currentPage, pageSize);

//     console.log("UserLifelogDashboard");

//     const handleModalClose = () => {
//       setShowModal(false)
//     }



//     if (alllifelogs.length === 0)
//       return (
//         <p>
//           There are no lifelogs in the database!
//           <div className="d-flex w-100 justify-content-between m-3">
//             {user && user.username == selectedUser && (
//               <Button className="btn btn-success" variant="primary" onClick={() => setShowModal(true)}>
//                 New Lifelog
//               </Button>
//                 // <button
//                 //   type="button"
//                 //   className="btn btn-success"
//                 //   style={{ marginBottom: 20 }}
//                 // >New Lifelog</button>
//             )}
//           </div>
//         </p>
//       );
//     return (
//       <React.Fragment>
//         <Jumotron />
//         <div className="container">
//           <div className="row">
//             <div className="col">
//               <div className="d-flex w-100 justify-content-between m-3">
//                 Showing {filtered.length} lifelogs.
//                 {user && user.username == selectedUser && (
//                   <Button className="btn btn-success" variant="primary" onClick={() => setShowModal(true)}>
//                     New Lifelog
//                   </Button>
//                   // <Link to="/new-post">
//                   //   <button
//                   //     type="button"
//                   //     className="btn btn-success"
//                   //     style={{ marginBottom: 20 }}
//                   //   >
//                   //     New lifelog
//                   //   </button>
//                   // </Link>
//                 )}
//               </div>
//             </div>
//           </div>
//           <div className="row">
//             <div className="col-9">
//               <Lifelogs
//                 lifelogs={filtered}
//                 logger={selectedUser}
//                 onDelete={this.handlePostDelete}
//               />
//             </div>
//             <div className="col-3">
//               {/* <ListGroup
//                 items={tags}
//                 selectedTag={this.state.selectedTag}
//                 onTagSelect={this.handleTagSelect}
//               /> */}
//             </div>
//             <Pagination
//               itemCount={filtered.length}
//               pageSize={pageSize}
//               currentPage={currentPage}
//               onPageChange={this.handlePageChange}
//             />
//           </div>
//         </div>

//         {showModal && (
//           <Modal show={showModal} onHide={handleModalClose}>
//             <Modal.Header closeButton>
//               <Modal.Title>Modal heading</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//               Woohoo, you're reading this text in a modal!
//             </Modal.Body>
//             <Modal.Footer>
//               <Button variant="secondary" onClick={handleModalClose}>
//                 Close
//               </Button>
//               <Button variant="primary" onClick={handleModalClose}>
//                 Save Changes
//               </Button>
//             </Modal.Footer>
//           </Modal>
//         )}
//       </React.Fragment>
//     );
//   }
// }

// export default UserLifelogDashboard;
