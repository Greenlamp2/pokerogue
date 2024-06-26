import {useEffect, useState} from "react";

const Webifier = (props) => {
  const [_elements, setElements] = useState(null);

  useEffect(() => {
    if (!props.handler) return;
  }, [props.handler, props.mode]);

  if (!props.handler) return null;

  return `${props.mode} -- ${props.handler.constructor.name}`;
};

export default Webifier;