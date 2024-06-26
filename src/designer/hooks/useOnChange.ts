import {useEffect, useRef} from "react";

const useOnChange = (value, key, callback) => {
  let prev = value[key];
  setInterval(() => {
    if (prev !== value[key]) {
      callback(value[key]);
      prev = value[key];
    }
  }, 1000);
};

export default useOnChange;