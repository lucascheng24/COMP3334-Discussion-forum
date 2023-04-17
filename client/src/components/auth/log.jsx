import React from "react";
import { Link, Redirect } from "react-router-dom";
import Joi from "joi-browser";
import { ToastContainer, toast } from "react-toastify";
import "../../App.css";
import Input from "../common/input";
import Form from "../common/form";
import { login } from "../../services/authService";
import {GenRSAKeypair, RsaEncrypt, RsaDecrypt, SaveKeyAndDownload} from '../common/rsaKeyFunc'

// use programmatic navigation form login form to dashboard

// add functionality to show react toast if the user is redierected to different locations due to history
class Log extends Form {
  state = {
    data: { email: "", password: "" },
    errors: {
      email: "",
      passowrd: "",
    },
  };
  schema = {
    email: Joi.string().required().label("Email ID"),
    password: Joi.string().required().label("Password"),
  };
  doSubmit = async () => {
    // call the server;
    try {
      const { data } = this.state;
      //console.log(data.email);
      const { data: jwt } = await login(data.email, data.password);
      localStorage.setItem("token", jwt);
      const { state } = this.props.location;
      window.location = state ? state.from.pathname : "/users/login";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error("Invalid Email Or Password");
      }
    }
  };
  render() {
    if (localStorage.getItem("token")) {
      return <Redirect to="/dashboard" />;
    }
    const { data, errors } = this.state;

    const handleFileInputChange = (event) => {

      let privateKey = ''

      console.log(event)
              console.log('event.target.value')
              console.log(event.target.value)

              const file = event.target.files[0];
              const reader = new FileReader();
              reader.onload = function(event) {
                privateKey = event.target.result;
                console.log(privateKey);

                try {
                  const dec = RsaDecrypt('j0LTtjBrY5EJMDjkrHFKVD4koyFq6F1cjvetAPMgtVEv5YZnGl4dVfI8TOQEBDfCE8gOOEyAU0i1E8IZOsNS3M0ZqMqp9Oged93SVAdJUWNsqa/uGZJZLyEpXcj8eTDmSgu8X0z7yDwLpWVdMGQBYkZr6+87LK9ghcYbTEw8LEvGeQfcb5yrWN/7z06oAWepFOMuGaM18UCFlefBzeA1xpkxSa/SJYhhI1xM/In8xDdEXMrBAAw6rNvGQb8gqSzcxEJ6vRgNFTgNn6+CwOGb0lH7NAjlmUNuqd7mEr5E1TJW6fTY4MYMQrjgspsGFSnrN1nfEnchBUrVeT6ERqA4Cw==', privateKey)

                  console.log(dec)
                  
                } catch (error) {
                  console.log('decrypt error')
                  console.log(error)
                }
                
              };
              reader.readAsText(file);

              
        
    }


    return (
      <div>
        <div className="container col-lg-3 col-md-6 border rounded mt-3">
          <h1 className="p-3">Login</h1>

          <form onSubmit={this.handleSubmit}>
            <Input
              name="email"
              value={data.email}
              label="Email ID"
              onChange={this.handleChange}
              error={errors.email}
            />
            <Input
              name="password"
              value={data.password}
              label="Password"
              onChange={this.handleChange}
              error={errors.password}
              type="password"
            />
            <Input label="Drag your private key file here" type="file" onChange={handleFileInputChange} />
            <div className="text-center">
              <button
                className="btn btn-primary m-3"
                disabled={this.validate()}
              >
                Login
              </button>
            </div>
          </form>
        </div>
        <div className="container col-lg-3 col-md-6 border rounder mt-1 p-3 text-center">
          New User? <Link to="/users/register">Register Here</Link>
        </div>
        <ToastContainer />
      </div>
    );
  }
}

export default Log;
