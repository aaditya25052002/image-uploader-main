import React from "react";
import Auth from "./Components/Auth";
import Header from "./Components/Header";
import { ChakraProvider } from "@chakra-ui/react";
import { useSelector } from "react-redux";

const App = () => {
  const user = useSelector((state) => state.user);
  return <ChakraProvider>{user ? <Header /> : <Auth />}</ChakraProvider>;
};

export default App;
