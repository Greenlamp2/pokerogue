import {MainSettingGamepad} from "../system/settings-gamepad";
import {Button} from "../enums/buttons";

/**
 * 081f-e401 - UnlicensedSNES
 */
const pad_unlicensedSNES = {
    padID: '081f-e401',
    padType: 'snes',
    deviceMapping : {
        RC_S: 2,
        RC_E: 1,
        RC_W: 3,
        RC_N: 0,
        START: 9,
        SELECT: 8,
        LB: 4,
        RB: 5,
        LC_N: 12,
        LC_S: 13,
        LC_W: 14,
        LC_E: 15
    },
    icons: {
        RC_S: "T_X_B_White_Alt.png",
        RC_E: "T_X_A_White_Alt.png",
        RC_W: "T_X_Y_White_Alt.png",
        RC_N: "T_X_X_White_Alt.png",
        START: "start.png",
        SELECT: "select.png",
        LB: "T_X_LB_Alt.png",
        RB: "T_X_RB_Alt.png",
        LC_N: "T_X_Dpad_Up_Alt.png",
        LC_S: "T_X_Dpad_Down_Alt.png",
        LC_W: "T_X_Dpad_Left_Alt.png",
        LC_E: "T_X_Dpad_Right_Alt.png",
    },
    settings: {
        [MainSettingGamepad.Button_Up]: Button.UP,
        [MainSettingGamepad.Button_Down]: Button.DOWN,
        [MainSettingGamepad.Button_Left]: Button.LEFT,
        [MainSettingGamepad.Button_Right]: Button.RIGHT,
        [MainSettingGamepad.Button_Action]: Button.ACTION,
        [MainSettingGamepad.Button_Cancel]: Button.CANCEL,
        [MainSettingGamepad.Button_Cycle_Nature]: Button.CYCLE_NATURE,
        [MainSettingGamepad.Button_Cycle_Variant]: Button.CYCLE_VARIANT,
        [MainSettingGamepad.Button_Menu]: Button.MENU,
        [MainSettingGamepad.Button_Stats]: Button.STATS,
        [MainSettingGamepad.Button_Cycle_Form]:  Button.CYCLE_FORM,
        [MainSettingGamepad.Button_Cycle_Shiny]: Button.CYCLE_SHINY,
        [MainSettingGamepad.Button_Cycle_Gender]: Button.CYCLE_GENDER,
        [MainSettingGamepad.Button_Cycle_Ability]: Button.CYCLE_ABILITY,
        [MainSettingGamepad.Button_Speed_Up]: Button.SPEED_UP,
        [MainSettingGamepad.Button_Slow_Down]: Button.SLOW_DOWN
    },
    default: {
        LC_N: MainSettingGamepad.Button_Up,
        LC_S: MainSettingGamepad.Button_Down,
        LC_W: MainSettingGamepad.Button_Left,
        LC_E: MainSettingGamepad.Button_Right,
        RC_S: MainSettingGamepad.Button_Action,
        RC_E: MainSettingGamepad.Button_Cancel,
        RC_W: MainSettingGamepad.Button_Cycle_Nature,
        RC_N: MainSettingGamepad.Button_Cycle_Variant,
        START: MainSettingGamepad.Button_Menu,
        SELECT: MainSettingGamepad.Button_Stats,
        LB: MainSettingGamepad.Button_Cycle_Form,
        RB: MainSettingGamepad.Button_Cycle_Shiny,
        LT: -1,
        RT: -1,
        LS: -1,
        RS: -1
    },
};

export default pad_unlicensedSNES;
