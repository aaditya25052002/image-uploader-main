import React, { useState } from "react";
import { Box, Flex, Input, Text, Button } from "@chakra-ui/react";
import ImageUploader from "../Hooks/ImageUploadHook";
import { login } from "../Slice/userSlice";
import { useDispatch } from "react-redux";
import axios from "axios";


const Auth = () => {
  const [pageType, setPageType] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const dispatch = useDispatch();

  const Login = async (event) => {
    try {
      const response = await axios.post("http://localhost:6001/login", {
        username,
        password,
      });

      if (response.status === 200) {
        // Save token to local storage or context
        localStorage.setItem("token", response.data.token);
        dispatch(login(response.data.user));
      } else {
        console.error(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const Signup = async (event) => {
    // event.preventDefault();
    // console.log(process.env.API_KEY);
    // Construct form data
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("profileImage", profileImage);

    try {
      const res = await axios.post("http://localhost:6001/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(res.data); // The registered user data
      // Clear form fields
      setUsername("");
      setPassword("");
      setProfileImage(null);
      alert("user signed in");
      setPageType("login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box>
      <Flex height="100vh" width="100vw" align="center" justify="center">
        <Box
          padding="25px"
          border="1px solid black"
          borderRadius="5px"
          color="white"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Flex flexDirection="column" padding="5px">
            <Text fontSize="sm" color="black" paddingBottom="5px">
              {pageType === "login"
                ? "login with your credentials"
                : "Create a new account with us"}
            </Text>
            <Input
              placeholder="Username"
              color="black"
              margin="5px"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="Password"
              color="black"
              margin="5px"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {pageType === "signup" ? (
              <ImageUploader name="profile pitcure" />
            ) : null}

            {pageType === "signup" ? (
              <Button
                bg="black"
                color="white"
                size="sm"
                margin="5px"
                onClick={() => Signup()}
              >
                Signup
              </Button>
            ) : (
              <Button
                bg="black"
                color="white"
                margin="5px"
                size="sm"
                onClick={() => Login()}
              >
                Login
              </Button>
            )}

            <Text fontSize="sm" paddingTop="5px" color="black">
              New User?{" "}
              <span
                style={{ color: "blue", cursor: "pointer" }}
                onClick={() => setPageType("signup")}
              >
                Signup
              </span>
            </Text>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default Auth;
