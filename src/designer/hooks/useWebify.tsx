import React from "react";
import UiHandler from "#app/ui/ui-handler";


const useWebify = (handler: UiHandler) => {
  const render = () => {
    return (
      <div>COOL</div>
    );
  };
  return {
    render,
  };
};

export default useWebify;
