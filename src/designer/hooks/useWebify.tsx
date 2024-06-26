import React, {useEffect, useState} from "react";
import UiHandler from "#app/ui/ui-handler";
import NineSliceWeb from "../webifiers/nineSliceWeb";
import NineSlice = Phaser.GameObjects.NineSlice;


const useWebify = (handler: UiHandler) => {
  const [_elements, setElements] = useState(null);
  const [_list, setList] = useState(null);
  const [_webified, setWebified] = useState([]);

  useEffect(() => {
    setElements(handler.getUi().list.reverse());
  }, [handler]);

  useEffect(() => {
    if (!_elements?.length) {
      return;
    }
    const temp = [];
    for (const element of _elements) {
      temp.push(element);
      if (element.list) {
        for (const elm of element.list) {
          temp.push(elm);
        }
      }
    }
    setList(temp);
  }, [_elements]);

  useEffect(() => {
    if (!_list && !_webified?.length) {
      return;
    }
    const element = _list[1];
    // console.log('element', element);
    if (element instanceof NineSlice) {
      const ninceSliceWeb = NineSliceWeb(element);
      // console.log('nineslice', element);
      // console.log('ninceSliceWebs', ninceSliceWeb);
      addWebified(ninceSliceWeb);

    }
  }, [_list]);

  const addWebified = (webified) => {
    setWebified([..._webified, webified]);
  };

  // console.log('_webified', _webified);
  const render = () => (<div>{_webified}</div>);
  return {
    render,
  };
};

export default useWebify;
