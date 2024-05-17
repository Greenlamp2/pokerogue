import BattleScene from "#app/battle-scene";
import {Mode} from "#app/ui/ui";
import SettingsKeyboardUiHandler from "#app/ui/settings/settings-keyboard-ui-handler";

export enum MainSettingKeyboard {
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
    Button_Submit = "BUTTON_SUBMIT"
}

export enum AltSettingKeyboard {
    Alt_Button_Up = "ALT_BUTTON_UP",
    Alt_Button_Down = "ALT_BUTTON_DOWN",
    Alt_Button_Left = "ALT_BUTTON_LEFT",
    Alt_Button_Right = "ALT_BUTTON_RIGHT",
    Alt_Button_Action = "ALT_BUTTON_ACTION",
    Alt_Button_Cancel = "ALT_BUTTON_CANCEL",
    Alt_Button_Menu = "ALT_BUTTON_MENU",
    Alt_Button_Stats = "ALT_BUTTON_STATS",
    Alt_Button_Cycle_Form = "ALT_BUTTON_CYCLE_FORM",
    Alt_Button_Cycle_Shiny = "ALT_BUTTON_CYCLE_SHINY",
    Alt_Button_Cycle_Gender = "ALT_BUTTON_CYCLE_GENDER",
    Alt_Button_Cycle_Ability = "ALT_BUTTON_CYCLE_ABILITY",
    Alt_Button_Cycle_Nature = "ALT_BUTTON_CYCLE_NATURE",
    Alt_Button_Cycle_Variant = "ALT_BUTTON_CYCLE_VARIANT",
    Alt_Button_Speed_Up = "ALT_BUTTON_SPEED_UP",
    Alt_Button_Slow_Down = "ALT_BUTTON_SLOW_DOWN",
    Alt_Button_Submit = "ALT_BUTTON_SUBMIT"
}

export type SettingKeyboard = MainSettingKeyboard | AltSettingKeyboard;

export const settingKeyboardBlackList = [
    MainSettingKeyboard.Button_Submit,
    MainSettingKeyboard.Button_Menu,
    MainSettingKeyboard.Button_Action,
    MainSettingKeyboard.Button_Up,
    MainSettingKeyboard.Button_Down,
    MainSettingKeyboard.Button_Left,
    MainSettingKeyboard.Button_Right,
];


export function setSettingKeyboard(scene: BattleScene, setting: SettingKeyboard, value: integer): boolean {
    switch (setting) {
        case MainSettingKeyboard.Button_Up:
        case MainSettingKeyboard.Button_Down:
        case MainSettingKeyboard.Button_Left:
        case MainSettingKeyboard.Button_Right:
        case MainSettingKeyboard.Button_Action:
        case MainSettingKeyboard.Button_Cancel:
        case MainSettingKeyboard.Button_Menu:
        case MainSettingKeyboard.Button_Stats:
        case MainSettingKeyboard.Button_Cycle_Shiny:
        case MainSettingKeyboard.Button_Cycle_Form:
        case MainSettingKeyboard.Button_Cycle_Gender:
        case MainSettingKeyboard.Button_Cycle_Ability:
        case MainSettingKeyboard.Button_Cycle_Nature:
        case MainSettingKeyboard.Button_Cycle_Variant:
        case MainSettingKeyboard.Button_Speed_Up:
        case MainSettingKeyboard.Button_Slow_Down:
        case AltSettingKeyboard.Alt_Button_Up:
        case AltSettingKeyboard.Alt_Button_Down:
        case AltSettingKeyboard.Alt_Button_Left:
        case AltSettingKeyboard.Alt_Button_Right:
        case AltSettingKeyboard.Alt_Button_Action:
        case AltSettingKeyboard.Alt_Button_Cancel:
        case AltSettingKeyboard.Alt_Button_Menu:
        case AltSettingKeyboard.Alt_Button_Stats:
        case AltSettingKeyboard.Alt_Button_Cycle_Shiny:
        case AltSettingKeyboard.Alt_Button_Cycle_Form:
        case AltSettingKeyboard.Alt_Button_Cycle_Gender:
        case AltSettingKeyboard.Alt_Button_Cycle_Ability:
        case AltSettingKeyboard.Alt_Button_Cycle_Nature:
        case AltSettingKeyboard.Alt_Button_Cycle_Variant:
        case AltSettingKeyboard.Alt_Button_Speed_Up:
        case AltSettingKeyboard.Alt_Button_Slow_Down:
            if (value) {
                if (scene.ui) {
                    const cancelHandler = (success: boolean = false) : boolean => {
                        scene.ui.revertMode();
                        (scene.ui.getHandler() as SettingsKeyboardUiHandler).updateBindings();
                        return success;
                    }
                    scene.ui.setOverlayMode(Mode.KEYBOARD_BINDING, {
                        target: setting,
                        cancelHandler: cancelHandler,
                    })
                }
            }
            break;
    }
    return true;

}