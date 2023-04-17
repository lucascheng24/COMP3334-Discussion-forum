import  { Component } from "react";
import Cookies from "universal-cookie";

class Logout extends Component {
  componentDidMount() {
    localStorage.removeItem("token");
    window.location = "/";
    const cookies = new Cookies();
    cookies.remove('userPrivateKeyStr')
    cookies.remove('userPublicKeyStr')
    cookies.remove('token')
    localStorage.removeItem('token')
  }
  render() {
    return null;
  }
}

export default Logout;
