import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Flex,
  Input,
  Text,
  Button,
  VStack,
  Image,
} from "@chakra-ui/react";
import ImageUploader from "../Hooks/ImageUploadHook";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../Slice/userSlice";
import { selectUser } from "../Slice/userSlice";

const Header = () => {
  const user = useSelector((state) => state.user);
  const [name, setName] = useState("");
  const [images, setImages] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const token = localStorage.getItem("token");
  const userId = user._id;
  const dispatch = useDispatch();

  const uploadImage = async () => {
    console.log(selectUser);
    console.log(user);
    console.log(token);
    // create form data
    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", imageFile);

    // create headers
    let config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`, // assuming you're using Bearer token
      },
    };

    try {
      const response = await axios.post(
        "http://localhost:6001/images",
        formData,
        config
      );
      alert(response.status);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Create headers
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    };

    axios
      .get(`http://localhost:6001/images/${userId}`, config)
      .then((response) => {
        setImages(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userId]);

  return (
    <div>
      <Box>
        <ImageUploader
          value={imageFile}
          onChange={(event) => {
            setImageFile(event.target.files[0]);
          }}
        />
        <Input
          placeholder="Password"
          color="black"
          margin="5px"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button onClick={() => uploadImage()}>Post the Image</Button>
        <Button onClick={() => dispatch(logout)}>logout</Button>
        <VStack spacing={5}>
          {images.map((image) => (
            <Box key={image._id} boxSize="sm">
              <Image
                src={image.image}
                alt={image.name}
                boxSize="100%"
                objectFit="cover"
              />
              <Text>{image.name}</Text>
            </Box>
          ))}
        </VStack>
      </Box>
    </div>
  );
};

export default Header;
