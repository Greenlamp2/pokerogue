import BattleScene from "../battle-scene";
import {SettingDefaults, SettingOptions} from "./settings";
import SettingsGamepadUiHandler from "../ui/settings/settings-gamepad-ui-handler";
import {Mode} from "../ui/ui";
import {truncateString} from "../utils";

export enum CommonSettingGamepad {
    Default_Controller = "DEFAULT_CONTROLLER",
    Gamepad_Support = "GAMEPAD_SUPPORT",
}

export enum MainSettingGamepad {
    Button_Up = "BUTTON_UP",
    Button_Down = "BUTTON_DOWN",
    Button_Left = "BUTTON_LEFT",
    Button_Right = "BUTTON_RIGHT",
    Button_Action = "BUTTON_ACTION",
    Button_Cancel = "BUTTON_CANCEL",
    Button_Menu = "BUTTON_MENU",
    Button_Stats = "BUTTON_STATS",
    Button_Cycle_Form = "BUTTON_CYCLE_FORM",
    Button_Cycle_Shiny = "BUTTON_CYCLE_SHINY",
    Button_Cycle_Gender = "BUTTON_CYCLE_GENDER",
    Button_Cycle_Ability = "BUTTON_CYCLE_ABILITY",
    Button_Cycle_Nature = "BUTTON_CYCLE_NATURE",
    Button_Cycle_Variant = "BUTTON_CYCLE_VARIANT",
    Button_Speed_Up = "BUTTON_SPEED_UP",
    Button_Slow_Down = "BUTTON_SLOW_DOWN",
    Button_Submit = "BUTTON_SUBMIT",
}

export type SettingGamepad = CommonSettingGamepad | MainSettingGamepad;

export const settingGamepadOptions: SettingOptions = {
    [CommonSettingGamepad.Default_Controller]: ['Default', 'Change'],
    [CommonSettingGamepad.Gamepad_Support]: ['Auto', 'Disabled'],
};

export const settingGamepadDefaults: SettingDefaults = {
    [CommonSettingGamepad.Default_Controller]: 0,
    [CommonSettingGamepad.Gamepad_Support]: 0,
};

export const settingGamepadBlackList = [
    MainSettingGamepad.Button_Up,
    MainSettingGamepad.Button_Down,
    MainSettingGamepad.Button_Left,
    MainSettingGamepad.Button_Right,
];

export function setSettingGamepad(scene: BattleScene, setting: SettingGamepad, value: integer): boolean {
    switch (setting) {
        case CommonSettingGamepad.Gamepad_Support:
            // if we change the value of the gamepad support, we call a method in the inputController to
            // activate or deactivate the controller listener
            scene.inputController.setGamepadSupport(settingGamepadOptions[setting][value] !== 'Disabled');
            break;
        case MainSettingGamepad.Button_Action:
        case MainSettingGamepad.Button_Cancel:
        case MainSettingGamepad.Button_Menu:
        case MainSettingGamepad.Button_Stats:
        case MainSettingGamepad.Button_Cycle_Shiny:
        case MainSettingGamepad.Button_Cycle_Form:
        case MainSettingGamepad.Button_Cycle_Gender:
        case MainSettingGamepad.Button_Cycle_Ability:
        case MainSettingGamepad.Button_Cycle_Nature:
        case MainSettingGamepad.Button_Cycle_Variant:
        case MainSettingGamepad.Button_Speed_Up:
        case MainSettingGamepad.Button_Slow_Down:
            if (value) {
                if (scene.ui) {
                    const cancelHandler = (success: boolean = false) : boolean => {
                        scene.ui.revertMode();
                        (scene.ui.getHandler() as SettingsGamepadUiHandler).updateBindings();
                        return success;
                    };
                    scene.ui.setOverlayMode(Mode.GAMEPAD_BINDING, {
                        target: setting,
                        cancelHandler: cancelHandler,
                    });
                }
            }
            break;
        case CommonSettingGamepad.Default_Controller:
            if (value) {
                const gp = scene.inputController.getGamepadsName();
                if (scene.ui && gp) {
                    const cancelHandler = () => {
                        scene.ui.revertMode();
                        (scene.ui.getHandler() as SettingsGamepadUiHandler).setOptionCursor(Object.values(CommonSettingGamepad).indexOf(CommonSettingGamepad.Default_Controller), 0, true);
                        (scene.ui.getHandler() as SettingsGamepadUiHandler).updateBindings();
                        return false;
                    };
                    const changeGamepadHandler = (gamepad: string) => {
                        scene.inputController.setChosenGamepad(gamepad);
                        cancelHandler();
                        return true;
                    };
                    scene.ui.setOverlayMode(Mode.OPTION_SELECT, {
                        options: [...gp.map((g) => ({
                            label: truncateString(g, 22), // Truncate the gamepad name for display
                            handler: () => changeGamepadHandler(g)
                        })), {
                            label: 'Cancel',
                            handler: cancelHandler,
                        }]
                    });
                    return false;
                }
            }
            break;
    }

    return true;
}
