import React from "react";

function ButtonN(props) {
  return (
    <button
      style={{
        display: "flex",
        backgroundColor: "#22ee99",
        border:"none",
        width:"150px",
        justifyContent:"center",
        outline:"none",
        fontWeight:"bold",
        fontSize:"30px",
        padding:"2px 10px",
        cursor:"pointer"
      }}
      onClick={props.click}
    >
      {props.title}
    </button>
  );
}

export default ButtonN;