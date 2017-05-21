
//DYNAMIC ARRAY OF RECORD
var ARRAY_OF_RECORD = /array\[\d+\]\s+of\s+record/g;
var SR = /sr/g;
var PROGRAM_VARIABLE = /\w+\_\w+/g;

//FUNCTION xxxx_menu()
var MENU_FUNCTION = /FUNCTION\s+\w+_menu\(/g;
var MENU_FUNCTION_1 = /FUNCTION\s+\w+_menu1\(\)/g;
var MENU_FUNCTION_2 = /FUNCTION\s+\w+_menu2\(\)/g;

//FUNCTION xxxx_b()
var _B_FUNCTION = /FUNCTION\s+\w+_b\(/g;
var BEFORE_ROW = /BEFORE ROW/g;

//FUNCTION xxxx_bp()
var _BP_FUNCTION = /FUNCTION\s+\w+\_bp\(\w+\)/g;

//FUNCTION xxx_b_askkey()
var _B_ASKKEY = /FUNCTION\s\w+_b_askkey\(/g;

//CHAR(xx)
var G_X_ARRAY_OF_CHAR = /G_X\s+ARRAY\[\d+\]\s+OF\s+CHAR\(\d+\)/g;
var L_ZA05_CHAR = /l_za05\s+CHAR\(40\)/g; //l_za05 CHAR(80)

//OPEN WINDOW
var OPEN_WINDOW_AT = /OPEN\sWINDOW\s(\S|)+\sAT/g;
var mainWindowTag = ' #main window';

//乾洗
var FOR_CNT_1_TO_ARRNO = /FOR\s+\w_cnt[\s\=]+1\s+TO\s+g_\w+_arrno/g;//FOR g_cnt = 1 TO g_pje_arrno 
var FOR_L_AC_1_TO_ARRNO = /FOR\s+l_ac[\s\=]+1\s+TO\s+g_\w+_arrno/g;

//g_lang
var WHEN_G_LANG_EQUAL_TO_ZERO = /WHEN\sg_lang[\s\=]+('|")0/g;
var IF_G_LANG_EQUAL_TO_ZERO = /IF\s+g_lang[\s\=]+('|")0('|")\s+THEN/g;
var CASE = /CASE/g;
var END_CASE = /END CASE/g;
var END_IF = /END IF/g;
var case_g_lang_Tag = ' #case g_lang';

//ON IDLE
var PROMPT = /PROMPT/g;
var endPromptForTag = ' #end prompt for';

//其他
var ATTRIBUTE = /ATTRIBUTE/g;
var END_FUNCTION = /END FUNCTION/g;
var CLEAR_FORM = /CLEAR FORM/g;
var ON_KEY = /ON\s+KEY/g;
var ARROW = /arrow/g;
var END_INPUT = /END INPUT/g;
var G_XXX_PAGENO = /g_\w+_pageno/g;
var CALL_XXX_BP_D = /CALL\s+\w+_bp\(('|")D('|")\)/g;
var FOR = /FOR/g;
var END_FOR = /END\s+FOR/g;

