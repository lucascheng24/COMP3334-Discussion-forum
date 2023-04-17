import React from "react";
import Input from "../common/input";
import Form from "../common/form";
import Joi from "joi-browser";
import { Redirect } from "react-router-dom";
import * as userService from "../../services/userService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/react-toastify.esm";
import {GenRSAKeypair, RsaEncrypt, SaveKeyAndDownload} from '../common/rsaKeyFunc'
import Cookies from "universal-cookie";

class Register extends Form {
  state = {
    data: { username: "", email: "", password: "", password2: "", name: "" },
    errors: { username: "", email: "", password: "", password2: "", name: "" },
  };
  schema = {
    name: Joi.string().required().label("Full Name"),
    username: Joi.string().required().label("Username"),
    email: Joi.string().required().label("Email ID"),
    password: Joi.string().required().label("Password"),
    password2: Joi.string().required().label("Confirm Password"),
  };

  doSubmit = async () => {
    // validate

    const cookies = new Cookies();
    let validflag = true

    console.log("do validation")

    if (!this.state.data.username || this.state.data.username.length < 5) {
      toast.error("Length of username must longer than 5")
      console.log("username validation")
      validflag = false
    }
    if (!this.state.data.name || this.state.data.name.length < 5) {
      toast.error("Length of name must longer than 5")
      console.log("name validation")
      validflag = false
    }
    if (!this.state.data.password || this.state.data.password.length < 5) {
      toast.error("Length of password must longer than 5")
      console.log("password validation")
      validflag = false
    }

    if (validflag) {
      try {
        console.log('all pass')

        const keyPair = GenRSAKeypair();

        console.log("Generate key Pair")
        console.log(JSON.stringify(keyPair.publicKey))
        console.log(JSON.stringify(keyPair.privateKey))

        // const  RsaEncrypt()
        const registerBody = {
          ...this.state.data,
          password: this.state.data.password,
          password2: this.state.data.password2,
          publicKeyUser: keyPair.publicKey
        }
  
  
        const response = await userService.register(registerBody);
        console.log(response);
        // Store keyPair in local file
        SaveKeyAndDownload(keyPair.privateKey, 'clientPrivateKey')
        SaveKeyAndDownload(keyPair.publicKey, 'clientPublicKey')
        SaveKeyAndDownload(response.data.publicKeyUser, 'serverPublicKey')

        cookies.set("userPrivateKeyStr", keyPair.privateKey, 
          { path: '/', secure: true, sameSite :true}
        );

        cookies.set("userPublicKeyStr", keyPair.publicKey, 
          { path: '/', secure: true, sameSite :true}
        );
        
        
        // localStorage.setItem("token", response.headers["x-auth-token"]);
        cookies.set("token", response.headers["x-auth-token"], 
          { path: '/', secure: true, sameSite :true}
        );

        if (window.confirm("Please download all the key pairs. For login use")) {
          window.location = "/dashboard";
        }

      } catch (ex) {
        if (ex.response && ex.response.status === 400) {
          // console.log(JSON.parse(JSON.stringify(ex)))
          // console.log(JSON.parse(JSON.stringify(ex.response)))
          
          toast.error(ex.response.data);
          // this.setState({ errors });
        } else {
          console.log(ex)
          toast.error(ex);
        }
      }
    }
  };


  


  render() {
    const { data, errors } = this.state;
    const cookies = new Cookies();
    if (cookies.get("token")) {
      return <Redirect to="/dashboard" />;
    }
    return (
      <React.Fragment>
        <ToastContainer />
        <div className="container-fluid col-lg-4 col-md-8">
          <h1>Register</h1>
          <form onSubmit={this.handleSubmit}>
            <Input
              value={data.name}
              onChange={this.handleChange}
              label="Name"
              name="name"
              type="text"
              error={errors.name}
            />
            <Input
              name="username"
              value={data.username}
              label="Username"
              type="text"
              onChange={this.handleChange}
              error={errors.username}
            />
            <Input
              value={data.email}
              onChange={this.handleChange}
              label="Email ID"
              type="text"
              name="email"
              error={errors.email}
            />
            <Input
              value={data.password}
              onChange={this.handleChange}
              label="Password"
              type="password"
              name="password"
              error={errors.password}
            />
            <Input
              value={data.password2}
              onChange={this.handleChange}
              label="Confirm Password"
              name="password2"
              type="password"
              error={errors.password2}
            />
            <div className="d-grid gap-2">
              <button className="btn btn-primary" disabled={this.validate()}>
                Register
              </button>
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default Register;
