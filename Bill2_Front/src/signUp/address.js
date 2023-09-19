import React, { useEffect, useState } from "react";    //리엑트 훅으로 구현...
import DaumPostcode from "react-daum-postcode";

const Post = (props) => {
  const address = props.address;
  const setAddress = props.setAddress;

  const onCompletePost = (data) => {
    console.log(data.address);
    setAddress(data.address);
  };

  const postCodeStyle = {
   
    display: "block",
    position: "absolute",
    top: "25%",
    width: "600px",
    height: "500px",
    padding: "7px",
    zIndex: 100, 
  };

  return (
    <>
    
        <DaumPostcode
          style={postCodeStyle}
          autoClose
          onComplete={onCompletePost}

        />
     
    </>
  );
};

export default Post;