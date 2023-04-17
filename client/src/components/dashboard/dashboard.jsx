import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../common/pagination";
import ListGroup from "../listgroup";
import Posts from "./posts";
import { paginate } from "../../utils/paginate";
import { api } from "../../config.js";
import http from "../../services/httpService";
import Jumbotron from "../common/jumbotron";
import './dashboardCss.css'
import { Button } from "react-bootstrap";
import {GenRSAKeypair, RsaEncrypt, RsaDecrypt, SaveKeyAndDownload} from '../common/rsaKeyFunc'
import Cookies from "universal-cookie";

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
      console.log(res.data.encryptPosts)

      
      const userPrivateKeyStr = cookies.get('userPrivateKeyStr')

      if (userPrivateKeyStr) {
        const posts = RsaDecrypt(JSON.stringify(res.data.encryptPosts), userPrivateKeyStr)
        console.log(posts)

        setAllposts(JSON.parse(posts))
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
    window.open('../../../../startAnimation.bat');
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
          className="btn btn-success"
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
                    className="btn btn-success btn-primary"
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
// import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import Pagination from "../common/pagination";
// import ListGroup from "../listgroup";
// import Posts from "./posts";
// import { paginate } from "../../utils/paginate";
// import { api } from "../../config.js";
// import http from "../../services/httpService";
// import Jumotron from "../common/jumbotron";
// import './dashboardCss.css'
// import { Button } from "react-bootstrap";

// class Dashboard extends Component {
//   state = {
//     allposts: [],
//     currentPage: 1,
//     pageSize: 4,
//     tags: [],
//     selectedTag: { _id: "1", name: "All Posts" },
//   };
//   async componentDidMount() {
//     const { data: allposts } = await http.get(api.postsEndPoint);
//     const { data: tags } = await http.get(api.tagsEndPoint);

//     this.setState({
//       allposts: [...allposts],
//       tags: [
//         {
//           _id: "1",
//           name: "All Posts",
//         },
//         ...tags,
//       ],
//     });
//   }
//   handlePageChange = (page) => {
//     this.setState({ currentPage: page });
//   };

//   handleTagSelect = (tag) => {
//     this.setState({ selectedTag: tag, currentPage: 1 });
//   };
//   getPosts() {
//     const { allposts, selectedTag } = this.state;
//     const filtered = [];
//     for (let i in allposts) {
//       const post = allposts[i];
//       const { tags } = post;
//       for (let j in tags) {
//         if (tags[j].name === selectedTag.name) {
//           filtered.push(post);
//           break;
//         }
//       }
//     }
//     console.log(filtered);
//     return filtered;
//   }

  

//   render() {
//     const { user } = this.props;
//     const { allposts, pageSize, currentPage, tags, selectedTag } = this.state;
//     const filtered = selectedTag._id === "1" ? allposts : this.getPosts();
//     const posts = paginate(filtered, currentPage, pageSize);

//     const startAnimation = () => {
//       // var wshShell = new window.ActiveXObject("WScript.Shell");
//       // wshShell.Run("../../../../startAnimation.bat");
//       window.open('../../../../startAnimation.bat');
//     }


//     if (allposts.length === 0)
//       return <p>There are no posts in the database!
//         <div className="d-flex w-100 justify-content-between m-3">
//                 {user && (
//                   <Link to="/new-post">
//                     <button
//                       type="button"
//                       className="btn btn-success btn-main"
//                     >
//                       New Post
//                     </button>
//                   </Link>
//                 )}
//               </div>
//               <button 
//                 type="button"
//                 className="btn btn-newpost"
//                 onClick={() => startAnimation()} >Simulation</button>
//       </p>;
//     return (
//       <React.Fragment>
//         <div className="container">
//           <div className="row">
//             <div className="col">
//               <div className="d-flex w-100 justify-content-between m-3 msg">
//                 Showing {filtered.length} posts.
//                 {user && (
//                   <>
//                   <Link to="/new-post">
//                     <button
//                       type="button"
//                       className="btn btn-success btn-main"
//                     >
//                       New Post
//                     </button>
//                   </Link>

//                   <button 
//                 type="button"
//                 className="btn btn-newpost btn-primary"
//                 onClick={() => startAnimation()} >Simulation</button>
//                   </>
                  
//                 )}
//               </div>
//             </div>
//           </div>
//           <div className="row">
//             <div className="col-9">
//               <Posts className="post" posts={posts}/>
//             </div>
//             <div className="col-3">
//               <ListGroup
//                 items={tags}
//                 selectedTag={this.state.selectedTag}
//                 onTagSelect={this.handleTagSelect}
//               />
//             </div>
//             <Pagination
//               itemCount={filtered.length}
//               pageSize={pageSize}
//               currentPage={currentPage}
//               onPageChange={this.handlePageChange}
//             />
//           </div>
//         </div>
//       </React.Fragment>
//     );
//   }
// }

// export default Dashboard;
