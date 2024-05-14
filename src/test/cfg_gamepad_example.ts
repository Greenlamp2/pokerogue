import {Button} from "#app/enums/buttons";

export enum SettingInterfaceGamepad {
    Default_Controller = "DEFAULT_CONTROLLER",
    Gamepad_Support = "GAMEPAD_SUPPORT",
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

/**
 * Generic pad mapping
 */
const pad_xbox360 = {
    padID: 'Xbox 360 controller (XInput STANDARD GAMEPAD)',
    padType: 'xbox',
    gamepadMapping: {
        RC_S: 0,
        RC_E: 1,
        RC_W: 2,
        RC_N: 3,
        START: 9,
        SELECT: 8,
        LB: 4,
        RB: 5,
        LT: 6,
        RT: 7,
        LS: 10,
        RS: 11,
        LC_N: 12,
        LC_S: 13,
        LC_W: 14,
        LC_E: 15
    },
    icons: {
        RC_S: "T_X_A_Color_Alt.png",
        RC_E: "T_X_B_Color_Alt.png",
        RC_W: "T_X_X_Color_Alt.png",
        RC_N: "T_X_Y_Color_Alt.png",
        START: "T_X_X_Alt.png",
        SELECT: "T_X_Share_Alt.png",
        LB: "T_X_LB_Alt.png",
        RB: "T_X_RB_Alt.png",
        LT: "T_X_LT_Alt.png",
        RT: "T_X_RT_Alt.png",
        LS: "T_X_Left_Stick_Click_Alt_Alt.png",
        RS: "T_X_Right_Stick_Click_Alt_Alt.png",
        LC_N: "T_X_Dpad_Up_Alt.png",
        LC_S: "T_X_Dpad_Down_Alt.png",
        LC_W: "T_X_Dpad_Left_Alt.png",
        LC_E: "T_X_Dpad_Right_Alt.png",
    },
    setting: {
        RC_S: SettingInterfaceGamepad.Button_Action,
        RC_E: SettingInterfaceGamepad.Button_Cancel,
        RC_W: SettingInterfaceGamepad.Button_Cycle_Nature,
        RC_N: SettingInterfaceGamepad.Button_Cycle_Variant,
        START: SettingInterfaceGamepad.Button_Menu,
        SELECT: SettingInterfaceGamepad.Button_Stats,
        LB: SettingInterfaceGamepad.Button_Cycle_Form,
        RB: SettingInterfaceGamepad.Button_Cycle_Shiny,
        LT: SettingInterfaceGamepad.Button_Cycle_Gender,
        RT: SettingInterfaceGamepad.Button_Cycle_Ability,
        LS: SettingInterfaceGamepad.Button_Speed_Up,
        RS: SettingInterfaceGamepad.Button_Slow_Down,
    },
    default: {
        RC_S: Button.ACTION, //5
        RC_E: Button.CANCEL, // 6
        RC_W: Button.CYCLE_NATURE,
        RC_N: Button.CYCLE_VARIANT, //14
        START: Button.MENU, //7
        SELECT: Button.STATS, //8
        LB: Button.CYCLE_FORM,
        RB: Button.CYCLE_SHINY,
        LT: Button.CYCLE_GENDER,
        RT: Button.CYCLE_ABILITY,
        LS: Button.SPEED_UP,
        RS: Button.SLOW_DOWN,
        LC_N: Button.UP,
        LC_S: Button.DOWN,
        LC_W: Button.LEFT,
        LC_E: Button.RIGHT,
    }
};

export default pad_xbox360;