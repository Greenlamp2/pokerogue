import React, {useEffect} from "react";
import useDesigner from "#app/designer/hooks/useDesigner";
import Webifier from "#app/designer/webifiers/webifier";

import {Mode} from "#enums/mode";

const App = () => {
  const { setMode, handler, mode } = useDesigner();
  useEffect(() => {
    setMode(Mode.SETTINGS);
  }, [])

  return (
    <div>
      <Webifier
        handler={handler}
        mode={mode}
      />
    </div>
  );
};

export default App;
