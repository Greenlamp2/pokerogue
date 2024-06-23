import BattleScene from "#app/battle-scene.js";
import {useEffect, useState} from "react";
import {Mode} from "#app/ui/ui";
import useWebify from "./useWebify";


const useDesigner = () => {
  const [_game, setGame] = useState<Phaser.Game>(null);
  const [_battleScene, setBattleScene] = useState<BattleScene>(null);
  const mode = _battleScene?.ui?.getMode();
  const handler = _battleScene?.ui?.getHandler();
  const { render } = useWebify(handler);

  useEffect(() => {
    import("../../main").then((game) => {
      setGame(game.game);
    });
  }, []);

  useEffect(() => {
    if (_game) {
      setBattleScene(_game.scene.getScene("battle") as BattleScene);
    }
  }, [_game]);

  return {
    scene: _battleScene,
    game: _game,
    mode,
    handler,
    setMode: (arg: Mode) => _battleScene?.ui?.setMode(arg),
    ready: !!mode,
    render,
  };
};

export default useDesigner;
