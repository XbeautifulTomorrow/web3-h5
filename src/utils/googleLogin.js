import axios from "axios";
import { ref } from "vue";

export default function () {
  const CLIENT_ID = "555035588589-5mb41b2i34loeiigc2rjvr5dfhc46tlg.apps.googleusercontent.com";
  const CLIENT_URL = "http://test1.e-vo.io:33080/home";
  const API_URL = "http://test1.e-vo.io:33080";

  const googleOptions = {
    client_id: CLIENT_ID, // required
    auto_select: false, // optional
    cancel_on_tap_outside: true, // optional
    context: "signin", // optional
  };

  const googleOneTap = ({ client_id, auto_select = false, cancel_on_tap_outside = false, context = "signin" }, callback) => {
    const contextValue = ["signin", "signup", "use"].includes(context) ? context : "signin";
    const googleScript = document.createElement("script");
    googleScript.setAttribute("src", "https://accounts.google.com/gsi/client");
    document.head.appendChild(googleScript);
    googleScript.onload = () => {
      if (client_id) {
        console.log(callback, "callback--------------------");
        window.google.accounts.id.initialize({
          client_id: client_id,
          callback: callback,
          auto_select: auto_select,
          cancel_on_tap_outside: cancel_on_tap_outside,
          context: contextValue,
        });
        window.google.accounts.id.prompt();
      } else {
        console.error("client_id is missing");
      }
    };
  };

  const oneTapSignin = (options) => {
    googleOneTap(options, (res) => {
      console.log(res,'==============')
      const axiosOptions = {
        headers: { "Access-Control-Allow-Origin": CLIENT_URL },
      };
      axios
        .post(`${API_URL}/mystery-web-user/auth/google/login`, res, axiosOptions)
        .then((res) => {
          // Continue Auth Flow with data from res.data
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };

  return { googleOptions, oneTapSignin };
}
