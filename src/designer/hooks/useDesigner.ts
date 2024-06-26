import { useState} from "react";


const useDesigner = () => {
  const [_mode, setMode] = useState(null);

  return {
    setMode: setMode,
    mode: _mode,
    handler: null,
  };
};

export default useDesigner;
