import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../common/pagination";
import ListGroup from "../listgroup";
import Posts from "./posts";
import { paginate } from "../../utils/paginate";
import { api } from "../../config.js";
import http from "../../services/httpService";
import './dashboardCss.css'
import {GenRSAKeypair, RsaEncrypt, RsaDecrypt, SaveKeyAndDownload} from '../common/rsaKeyFunc'
import Cookies from "universal-cookie";
import axios from "axios";

const Dashboard = ({ user }) => {
  const [allposts, setAllposts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState({ _id: "1", name: "All Posts" });
  const cookies = new Cookies();

  useEffect(() => {
    const fetchData = async () => {
      const { data: allposts } = await http.get(api.postsEndPoint);
      const { data: tags } = await http.get(api.tagsEndPoint);

      setAllposts([...allposts]);
      setTags([
        {
          _id: "1",
          name: "All Posts",
        },
        ...tags,
      ]);
    };
    fetchData();
  }, []);

  useEffect(async () => {
    const { data: allposts } = await http.get(api.postsEndPoint).then((res) => {
      console.log("encryptPosts")
      console.log(res.data.decrypt_posts)

      
      const userPrivateKeyStr = cookies.get('userPrivateKeyStr')

      if (userPrivateKeyStr) {

        const enc_posts =  res.data.decrypt_posts
        const dec_posts = [];

        if(Array.isArray(enc_posts)) {
          enc_posts.forEach(ele => {
            const post = RsaDecrypt(ele, userPrivateKeyStr)
            dec_posts.push(JSON.parse(post))
          })
        }
        console.log(dec_posts)

        setAllposts(dec_posts)
        return posts
      }
  })}, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
    setCurrentPage(1);
  };

  const getPosts = () => {
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

  const startAnimation = () => {
    axios.get(api.keepAliveEndPoint+"simulation")
  }

  const filtered = selectedTag._id === "1" ? allposts : getPosts();
  const posts = paginate(filtered, currentPage, pageSize);

  if (allposts.length === 0) {
    return (
      <p>
        There are no posts in the database!
        <div className="d-flex w-100 justify-content-between m-3">
          {user && (
            <Link to="/new-post">
              <button
                type="button"
                className="btn btn-success btn-main"
              >
                New Post
              </button>
            </Link>
          )}
        </div>
        <button 
          type="button"
          className="btn btn-primary btn-sim"
          onClick={() => startAnimation()} >
          Simulation
        </button>
      </p>
    );
  }

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
                      className="btn btn-success btn-main"
                    >
                      New Post
                    </button>
                  </Link>
                  <button 
                    type="button"
                    className="btn btn-primary btn-sim"
                    onClick={() => startAnimation()} >
                    Simulation
                  </button>
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
              selectedTag={selectedTag}
              onTagSelect={handleTagSelect}
            />
          </div>
          <Pagination
            itemCount={filtered.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </React.Fragment>
  );
}

export default Dashboard;
