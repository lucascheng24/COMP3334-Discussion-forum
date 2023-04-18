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
import {GenRSAKeypair, RsaEncrypt, RsaDecrypt, SaveKeyAndDownload} from '../common/rsaKeyFunc'
import Cookies from "universal-cookie";

const UserLifelogDashboard = ({ user, match }) => {
  const [alllifelogs, setAllLifelogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  // const [selectedTag, setSelectedTag] = useState({ _id: "1", name: "All lifelogs" });
  const [showModal, setShowModal] = useState(false);
  const [inputTitle, setInputTitle] = useState("");
  const [inputDescription, setInputDescription] = useState("");
  const cookies = new Cookies();

  useEffect(() => {
    console.log("enter UserLifelogDashboard");
  }, []);

  async function getlifelogs(selectedUser) {
    console.log("get life logs from ", selectedUser);

    if (selectedUser) {
      const { data: lifelogs } = await http.get(
        `${api.lifelogEndPoint}/get/${selectedUser}`
      ).then(res => {
        console.log(res.data.encrypt_posts)

        const userPrivateKeyStr = cookies.get('userPrivateKeyStr')

        if (userPrivateKeyStr) {
  
          const enc_posts =  res.data.encrypt_posts
          const dec_logs = [];
  
          if(Array.isArray(enc_posts)) {
            enc_posts.forEach(ele => {
              const log = RsaDecrypt(ele, userPrivateKeyStr)
              dec_logs.push(JSON.parse(log))
            })
          }
          console.log(dec_logs)
  
          setAllLifelogs(dec_logs);
          return dec_logs
        }
      });

      // setAllLifelogs(lifelogs);
    }
  }

  useEffect(() => {
    const selectedUser = match.params.username;
    console.log("match", match);
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
    setShowModal(false);
  };

  const createLifeLog = async () => {
    if (!!inputTitle && inputTitle.length < 10) {
      toast.error("Title must be more than 10 characters");
    }
    if (!!inputDescription && inputTitle.length < 10) {
      toast.error("Description must be more than 10 characters");
    }

    if (
      !!inputTitle &&
      inputTitle.length > 9 &&
      !!inputDescription &&
      inputTitle.length > 9
    ) {
      //  sending api to add lifelogs
      try {
        // const { data } = this.state;
        await http
          .post(`${api.lifelogEndPoint}/create`, {
            title: inputTitle,
            description: inputDescription,
            author: selectedUser,
          })
          .then((res) => {
            if (res.status === 200) {
              setShowModal(false);
              setInputTitle("");
              setInputDescription("");
              getlifelogs(selectedUser);
            } else {
              toast.error("Network error");
              setShowModal(false);
            }
            // console.log('create response', res);
          });

        // window.location = "/dashboard";
      } catch (error) {
        toast.error(error);
      }
    }
  };

  return (
    <>
      {alllifelogs.length === 0 && (
        <p>
          There are no lifelogs in the database!
          <div className="d-flex w-100 justify-content-between m-3">
            {user && user.username === selectedUser && (
              <Button
                className="btn btn-success"
                variant="primary"
                onClick={() => setShowModal(true)}
              >
                New Lifelog
              </Button>
            )}
          </div>
        </p>
      )}

      {alllifelogs && alllifelogs.length > 0 && (
        <React.Fragment>
          <Jumotron title={`Life logs of ${selectedUser}`} />
          <div className="row">
            <div className="col-3"></div>
            <div className="col">
              {user && user.username === selectedUser && (
                <Button
                  className="btn btn-success"
                  variant="primary"
                  onClick={() => setShowModal(true)}
                >
                  Add New Lifelog
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
            <div className="col-3"></div>
          </div>
        </React.Fragment>
      )}

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Lifelog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Add your new lifelog here</p>
          <Input
            label={"Title"}
            value={inputTitle}
            maxLength={35}
            onChange={(e) => {
              setInputTitle(e.target.value);
            }}
          />
          <Input
            label={"Description"}
            maxLength={45}
            value={inputDescription}
            onChange={(e) => {
              setInputDescription(e.target.value);
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
    </>
  );
};

export default UserLifelogDashboard;
