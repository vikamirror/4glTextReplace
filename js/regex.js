
//DYNAMIC ARRAY OF RECORD
var ARRAY_OF_RECORD = /array\[\d+\]\s+of\s+record/g;
var SR = /sr/g;
var PROGRAM_VARIABLE = /\w+\_\w+/g;

//FUNCTION xxxx_menu()
var MENU_FUNCTION = /FUNCTION\s+\w+_menu\(/g;
var MENU_FUNCTION_1 = /FUNCTION\s+\w+_menu1\(\)/g;
var MENU_FUNCTION_2 = /FUNCTION\s+\w+_menu2\(\)/g;
var FILENAME_MENU = /[\w\d]+_menu\(\)/g;
var BEFORE_MENU = /BEFORE MENU/g;
var END_MENU = /END MENU/g;
var EXIT_MENU = /EXIT MENU/g;
var MENU_QUOTATION_MARK = /MENU\s('|"){2}/g;//MENU ""
var KEY_F3 = /KEY\(F3\)/g;
var KEY_F4 = /KEY\(F4\)/g;
var KEY_INTERRUPT = /KEY\(INTERRUPT\)/g;
var QUERY_HELP = /('|")Q.\W+HELP\s\d+/g;
var DETAIL_HELP = /('|")B.\W+HELP\s\d+/g;
var ADD_HELP = /('|")A.\W+HELP\s\d+/g;
var MODIFY_HELP = /('|")U.\W+HELP\s\d+/g;
var REPRODUCE_HELP= /('|")C.\W+HELP\s\d+/g;
var REMOVE_HELP = /('|")R.\W+HELP\s\d+/g;
var OUTPUT = /('|")O\.\W+('|")/g;
var ABOUT_HELP = /('|")H.\W+HELP\s\d+/g;
var NEXT_HELP = /('|")N.\W+HELP\s\d+/g;
var PREVIOUS_HELP = /('|")P.\W+HELP\s\d+/g;
var ESC = /('|")Esc.\S+('|")/g;
var KEY_ESC = /KEY\(esc\)/g;
var USER_DEFINED = /('|")[\d\w]+\.\D{1,22}('|")/g;
var KEY_JUMP = /KEY\(('|")\/('|")\)/g;
var KEY_FIRST = /KEY\(F\)/g;
var KEY_LAST = /KEY\(L\)/g;
var KEY_CONTROL_N = /KEY\(CONTROL\-N\)/g;
var KEY_CONTROL_G = /key\(control\-g\)/g;
var CLOSE_CURSER = /CLOSE\s+\w+/g;

//FUNCTION xxxx_b()
var _B_FUNCTION = /FUNCTION\s+\w+_b\(/g;
var DEFINE = /DEFINE/g;
var LAST_ROW_OF_DEFINE = /\w+\s+[\w\(\)\s\.]+,/g;
var CL_PRICHK_A = /cl_prichk\(('|")A('|")\)/g;//IF NOT cl_prichk('A') THEN
var OPTIONS_INSERT_KEY = /OPTIONS\s+INSERT\s+KEY/g;//#OPTIONS INSERT KEY F13
var OPTIONS_DELETE_KEY = /OPTIONS\s+DELETE\s+KEY/g;//#OPTIONS DELETE KEY F13
var LET_L_ALLOW_INSERT_FALSE = /LET\s+l_insert[\s\=]+("|')N("|')/g;//LET l_allow_insert = FALSE
var LET_L_ALLOW_DELETE_FALSE = /LET\s+l_update[\s\=]+("|')N("|')/g;//LET l_allow_delete = FALSE
var HELP_NUMBER = /HELP\s+\d+/g;
var BEFORE_ROW = /BEFORE ROW/g;

//FUNCTION xxxx_bp()
var _BP_FUNCTION = /FUNCTION\s+\w+\_bp\(\w+\)/g;
var DISPLAY_G_XXX_TO_S_XXX = /DISPLAY\s+g_\w+\[\w+\].\*\s+TO\s+s_\w+\[\w+\].\*/g;//DISPLAY g_xxx[l_xxx].* TO s_xxx[l_xxx].*

//FUNCTION xxx_b_askkey()
var _B_ASKKEY = /FUNCTION\s\w+_b_askkey\(/g;

//CHAR(xx)
var G_X_ARRAY_OF_CHAR = /G_X\s+ARRAY\[\d+\]\s+OF\s+CHAR\(\d+\)/g;
var L_ZA05_CHAR = /l_za05\s+CHAR\(40\)/g; //l_za05 CHAR(80)
var CHAR_XX = /CHAR\(\d+\)/g;

//OPEN WINDOW
var OPEN_WINDOW_AT = /OPEN\sWINDOW\s(\S|)+\sAT/g;
var mainWindowTag = ' #main window';

//乾洗
var FOR_CNT_1_TO_ARRNO = /FOR\s+\w_cnt[\s\=]+1\s+TO\s+g_\w+_arrno/g;//FOR g_cnt = 1 TO g_pje_arrno 
var FOR_L_AC_1_TO_ARRNO = /FOR\s+l_ac[\s\=]+1\s+TO\s+g_\w+_arrno/g;
var INITIALIZE_TO_NULL = /INITIALIZE\s+g+\w+/g;
var INITIALIZE = /INITIALIZE/g;
var TO_NULL = /TO NULL/g;

//g_lang
var WHEN_G_LANG_EQUAL_TO_ZERO = /WHEN\sg_lang[\s\=]+('|")0/g;
var IF_G_LANG_EQUAL_TO_ZERO = /IF\s+g_lang[\s\=]+('|")0('|")\s+THEN/g;
var CASE = /CASE/g;
var END_CASE = /END CASE/g;
var case_g_lang_Tag = ' #case g_lang';

//ON IDLE
var PROMPT = /PROMPT/g;
var endPromptForTag = ' #end prompt for';

//其他
var ATTRIBUTE = /ATTRIBUTE/g;
var ATTRIBUTE_COLOR = /ATTRIBUTE\(\S+\)/g;
var END_FUNCTION = /END FUNCTION/g;
var CLEAR_FORM = /CLEAR FORM/g;
var ON_KEY = /ON\s+KEY/g;
var END_INPUT = /END INPUT/g;
var END_IF = /END IF/g;
var CALL_XXX_BP_D = /CALL\s+\w+_bp\(('|")D('|")\)/g;
var FOR = /FOR/g;
var END_FOR = /END\s+FOR/g;
var INSERT_KEY = /INSERT\s+KEY/g;
var DELETE_KEY = /DELETE\s+KEY/g;

//g_xxx_pageno
var G_XXX_PAGENO = /g_\w+_pageno/g;
var G_XXX_PAGENO_SMALLINT = /g_\w+_pageno\s+SMALLINT/g;
var LET_G_XXX_PAGENO_EQUALS_TO_X = /LET\s+g_\w+_pageno(\s+|)=(\s+|)(1|0)/g;

//ON KEY
var ON_KEY_CONTROL_X = /ON KEY\(CONTROL-\w\)/g;//ON KEY(CONTROL-X)
var ON_KEY_control_X = /ON KEY\(control-\w\)/g;
var CONTROL_X = /\(CONTROL-\w\)/g;//CONTROL-X
var ON_KEY_FXX = /ON\s+KEY\(F\d+\)/g;

//arrow
var ARROW = /arrow/g;
var LINE_HAS_ARROW = /[\S\s]+arrow/g;
