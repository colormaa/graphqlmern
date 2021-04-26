import React from "react";
import { Popup } from "semantic-ui-react";
const MyPopups = ({ content, children }) => {
  return <Popup inverted content={content} trigger={children} />;
};
export default MyPopups;
