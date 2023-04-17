import React from "react";
import { Link, Redirect } from "react-router-dom";
import Joi from "joi-browser";
import { ToastContainer, toast } from "react-toastify";
import "../../App.css";
import Input from "../common/input";
import Form from "../common/form";
import { login } from "../../services/authService";
import {
  GenRSAKeypair,
  RsaEncrypt,
  RsaDecrypt,
  SaveKeyAndDownload,
} from "../common/rsaKeyFunc";
import Cookies from "universal-cookie";

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
      // const cookies = new Cookies();
      //console.log(data.email);
      // const publicKeyStr = cookies.get('userPublicKeyStr')
      // const userPrivateKeyStr = cookies.get('userPrivateKeyStr')

      // console.log(publicKeyStr)
      // const enc_pw = RsaEncrypt(data.password, publicKeyStr)

      // console.log('enc_pw:', enc_pw)


      // const dec_pw = RsaDecrypt(data.password, userPrivateKeyStr)
      // console.log('dec_pw:', dec_pw)

      const { data: jwt } = await login(data.email, data.password);
      /// use cookies here
    //   const cookies = new Cookies();
    //   // cookies.set("myCookie", "hello", { path: "/", });
    //   cookies.set("userPrivateKey", privateKeyStr, 
    //     { path: '/', secure: true, sameSite :true}
    // );
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
    const cookies = new Cookies();

    

    const handlePrivateFileInputChange = (event) => {
      let privateKey = "";

      console.log(event);
      console.log("event.target.value");
      console.log(event.target.value);

      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = function (event) {
        privateKey = event.target.result;
        // console.log(privateKey);
        console.log('upload privateKey:');
        console.log(JSON.stringify(privateKey));

        cookies.set("userPrivateKeyStr", privateKey, 
          { path: '/', secure: true, sameSite :true}
        );


      };
      reader.readAsText(file);
    };

    const handlePublicFileInputChange = (event) => {
      let publicKey = "";
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = function (event) {
        publicKey = event.target.result;
        console.log('upload publicKey:');
        console.log(JSON.stringify(publicKey));

        cookies.set("userPublicKeyStr", publicKey, 
          { path: '/', secure: true, sameSite :true}
        );
        // setState({
        //   ...this.state,
        //   publicKeyStr: publicKey,
        // });
      };
      reader.readAsText(file);
    };

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
            <Input
              label="Drag your private key file here"
              type="file"
              onChange={handlePrivateFileInputChange}
            />
            <br></br>
            <Input
              label="Drag server public key file here"
              type="file"
              onChange={handlePublicFileInputChange}
            />
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
