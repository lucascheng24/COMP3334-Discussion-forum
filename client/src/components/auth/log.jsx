import React from "react";
import { Link, Redirect } from "react-router-dom";
import Joi from "joi-browser";
import { ToastContainer, toast } from "react-toastify";
import "../../App.css";
import Input from "../common/input";
import Form from "../common/form";
import { login } from "../../services/authService";
import { api } from "../../config";
import {
  GenRSAKeypair,
  RsaEncrypt,
  RsaDecrypt,
  SaveKeyAndDownload,
  caesarCipherEncrypt,
  caesarCipherDecrypt
} from "../common/rsaKeyFunc";
import Cookies from "universal-cookie";
import axios from "axios";
import { SHA256 } from 'crypto-js';

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

      const cookies = new Cookies();
      const userPrivateKeyStr = cookies.get('userPrivateKeyStr')
      const userPublicKeyStr = cookies.get('userPublicKeyStr')

      if (!!!userPrivateKeyStr) {
        toast.error("Please put your private key file before login");
        return
      }
      if (!!!userPublicKeyStr) {
        toast.error("Please put your public key file before login");
        return
      }

      const { data } = this.state;
      

      // const { data: jwt } = await login(data.email, data.password);

      // Create an Axios instance with the Connection header set to keep-alive
      // const http_alive = axios.create({
      //   headers: {
      //     'Connection': 'keep-alive'
      //   }
      // });

      const user_hash_pw = SHA256(data.password).toString()
      const ciphertext = caesarCipherEncrypt(userPublicKeyStr, user_hash_pw)
      var jwt = ""

      // Make the first request and return the decrypted challenge value
      axios.post(api.keepAliveEndPoint + 'login1', {
        email: data.email,
        pwEncPuk: ciphertext
      }).then((response) => {
        console.log(response.data.pw_enc_puk_enc_R);

        const w_enc_Puk_enc_R = response.data.pw_enc_puk_enc_R
        const Puk_enc_R = caesarCipherDecrypt(w_enc_Puk_enc_R, user_hash_pw)
        const dec_challenge_R = RsaDecrypt(Puk_enc_R, userPrivateKeyStr)

        console.log('challenge_R: ', dec_challenge_R)
        return dec_challenge_R;
      }).catch((error) => {
        console.log('login http1', JSON.parse(JSON.stringify(error)))
        console.log('login http1 response', JSON.parse(JSON.stringify(error.response)))

        const error_response = error.response

        toast.error(error_response.data.toString())

      }).then((dec_challenge_R) => {

        // Make the second request
        axios.post(api.keepAliveEndPoint + 'login2', {
          email: data.email,
          challenge_R: dec_challenge_R
        }).then((response) => {
          console.log('second request R');
          console.log(response.data);
          jwt = response.data.token

          //  get the jwt and route to other page
          cookies.set("token", jwt, 
            { path: '/', secure: true, sameSite :true}
          );
          const { state } = this.props.location;

          window.location = state ? state.from.pathname : "/users/login";

          return response.data;
        }).catch((error) => {
          console.log(error);
          console.log('login http2', JSON.parse(JSON.stringify(error)))
          console.log('login http2 response', JSON.parse(JSON.stringify(error.response)))
  
          const error_response = error.response
  
          toast.error(error_response.data.toString())
        });
      })
      

      // // Make the first request
      // const { data: dec_challenge_R } = await axios.post(api.keepAliveEndPoint + 'login1', {
      //   email: data.email,
      //   pwEncPuk: ciphertext
      // }).then(async (response) => {
      //   console.log(response.data.pw_enc_puk_enc_R);

      //   const w_enc_Puk_enc_R = response.data.pw_enc_puk_enc_R

      //   const Puk_enc_R = caesarCipherDecrypt(w_enc_Puk_enc_R, user_hash_pw)

      //   const dec_challenge_R = RsaDecrypt(Puk_enc_R, userPrivateKeyStr)

      //   console.log('challenge_R: ', dec_challenge_R)


        
      //   return dec_challenge_R
      // }).catch((error) => {
      //   console.log(error);
      // })
      
      // // Make the second request
      // const { data: jwt } = await axios.post(api.keepAliveEndPoint + 'login2', {
      //   //  send R
      //   email: data.email,
      //   challenge_R: dec_challenge_R
      // }).then((response) => {
      //   console.log('second request R');
      //   console.log(response.data);
      //   return response.data

      // }).catch((error) => {
      //   console.log(error);
      // });

      // localStorage.setItem("token", jwt);
      
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error("Invalid Email Or Password");
      }
    }
  };
  render() {
    const cookies = new Cookies();

    if (cookies.get("token")) {
      return <Redirect to="/dashboard" />;
    }
    const { data, errors } = this.state;

    

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
              label="Drag your public key file here"
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
