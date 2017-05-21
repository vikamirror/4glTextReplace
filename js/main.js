var blanks_1 = ' ';
var blanks_4 = '    ';
var blanks_6 = '      ';
var blanks_8 = '        ';
var blanks_12 = '            ';
var fileCode;
var hasBpFunc = false;
var has_b_askkey = false;
var hasCallMenu = false;//用在g_lang
var mimeType = mimeType || 'application/octet-stream';
var variables = {
    dynamicArrOfRecs: [],
}

function main(event){
    var files = event.target.files;
    for(var i=0; i<files.length; i++){
        setUpReader(files[i],i);
    }
}

function setUpReader(file){
    var fileName = file.name;
    
    fileCode = fileName.match(/\w{1}\d+/g)[0];
    var fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = function(event){
        //console.log('fileName',fileName);
        var fileText = fileReader.result; 
        var readLineArr = readLine(fileText);
        var fileText_after = readLineArr.join('\n');
        
        console.log(fileText_after);
        //console.log('FINISH');
        clearData();
        //download(fileName, fileText_after, mimeType);
    }
}

//逐行讀取
function readLine(fileText){
    var lines = fileText.split('\n');
    var linegroup = groupLines(lines);
    var newLines = [];
    for(var i=0; i<linegroup.length; i++){
        var a_line = modifyLine(linegroup[i]);
        newLines.push(a_line);
    }
    return newLines;
}

//修改每一行
function modifyLine(a_group){
    //console.log(a_line);
    var processFunctions = getProcessFunctions(a_group);
    if(processFunctions.length > 0){
        for(var i=0;i<processFunctions.length;i++){
            a_group = processFunctions[i](a_group);
        }
    }
    return a_group;
}

//對應到要修改到function
function getProcessFunctions(a_group){
    //console.log(a_group);
    var processFunctions = [];
    // if(a_group.includes('GLOBAL')){
	// 	processFunctions.push(globalCode);
	// }
    if(a_group.toUpperCase().match(CLEAR_FORM) !== null){
        processFunctions.push(clearForm);
    }
    if(a_group.toLowerCase().match(ARRAY_OF_RECORD) !== null){
        processFunctions.push(dynamicArrOfRec);           
    }
    if(a_group.match(ATTRIBUTE) !== null){
        processFunctions.push(commentOutAttr);
    }
    if(a_group.match(ON_KEY) !== null){
        processFunctions.push(onKey_onAction);
    }
    if(a_group.toLowerCase().match(ARROW) !== null){
        processFunctions.push(commentOutArrow);
    }
    if(a_group.match(G_XXX_PAGENO) !== null){
        processFunctions.push(commentOutPageNo);
    }
    if(a_group.match(CALL_XXX_BP_D) !== null){
        processFunctions.push(commentOutCall_bpD);
    }
    if(a_group.match(endPromptForTag) !== null){
        processFunctions.push(onIdle_prompt);
    }
    if(a_group.match(END_INPUT) !== null){
        processFunctions.push(onIdle_endInput);
    }
    if(a_group.match(case_g_lang_Tag) !== null){
        processFunctions.push(g_langCase);
    }
    if(a_group.match(mainWindowTag) !== null){
        processFunctions.push(openWindow);
    }
    if(a_group.match(MENU_FUNCTION) !== null){
        if(hasBpFunc===true){
            processFunctions.push(menuWtihBpFunc);
        }else{
            processFunctions.push(menuWtihoutBp);
        }
    }
    if(a_group.match(_B_FUNCTION) !== null){
        processFunctions.push(_bBeforeRow);
    }
    if(a_group.match(_BP_FUNCTION) !== null){
        processFunctions.push(_bpFunc);
    }
    if(a_group.match(L_ZA05_CHAR) !== null){
        processFunctions.push(l_za05Char);
    }
    if(a_group.toUpperCase().match(G_X_ARRAY_OF_CHAR) !== null){
        processFunctions.push(l_za05Char);
    }
    if(a_group.match(/INSERT\s+KEY/g) !== null){
        processFunctions.push(commentOutInsertKey);
    }
    if(a_group.match(/DELETE\s+KEY/g) !== null){
        processFunctions.push(commentOutDeleteKey);
    }
    if(a_group.match(FOR_CNT_1_TO_ARRNO) !== null || a_group.match(FOR_L_AC_1_TO_ARRNO) !== null){
        processFunctions.push(dryCleaningForLoop);
    }
    return processFunctions;
}

//把一句話分在一組
function groupLines(lines){
    var groupStartIdx = {
        g_lang: 0,
        if_g_lang: 0,
        menuFunc: 0,
        _bpFunc: 0,
        _bDefine: 0,
        startOpenWindow: 0,
        hasOpenWindow: false,
        startMenu1: 0,
        startMenu2: 0,
        dryCleaning: 0,
    }
    var linegroup = [];

    function clearTheLastItem(regex){
        linegroup[linegroup.length-1] = linegroup[linegroup.length-1].replace(regex, '');
    }
   //console.log(lines);
    for(var i=0; i<lines.length; i++){
        if(groupStartIdx.hasOpenWindow === false){
            if(lines[i].match(OPEN_WINDOW_AT) !== null){//OPEN WINDOW
                if(lines[i].match(ATTRIBUTE) !== null){
                    linegroup.push(lines[i] + mainWindowTag);
                    groupStartIdx.hasOpenWindow = true;
                } else {
                    groupStartIdx.startOpenWindow = i;
                }
                continue;
            }
        }
        if(groupStartIdx.startOpenWindow !== 0){
            if(lines[i].match(ATTRIBUTE) !== null){
                var openWindow = pushGroup(lines, groupStartIdx.startOpenWindow, i);
                linegroup.push(openWindow + mainWindowTag);
                groupStartIdx.startOpenWindow = 0;
                groupStartIdx.hasOpenWindow = true;
            }
            continue;
        }
        if(lines[i].match(WHEN_G_LANG_EQUAL_TO_ZERO) !== null){//WHEN g_lang='0'
            groupStartIdx.g_lang = i-1;
            clearTheLastItem(CASE);
            continue;
        }
        if(groupStartIdx.g_lang !== 0){
            if(lines[i].match(END_CASE) !== null){
                var g_lang = pushGroup(lines, groupStartIdx.g_lang, i);
                linegroup.push(g_lang + case_g_lang_Tag);
                groupStartIdx.g_lang = 0;
            }
            continue;
        }
        if(lines[i].match(IF_G_LANG_EQUAL_TO_ZERO) !== null){//IF g_lang='0'
            if(lines[i].match(END_IF) === null){
                groupStartIdx.if_g_lang = i;
            } else {//IF g_lang='0' THEN ... END IF在同一行的狀況
                linegroup.push(lines[i] + case_g_lang_Tag);
            }
            continue;
        }
        if(groupStartIdx.if_g_lang !== 0){
            if(lines[i].match(END_IF) !== null){
                var if_g_lang = pushGroup(lines, groupStartIdx.if_g_lang, i);
                linegroup.push(if_g_lang + case_g_lang_Tag);
                groupStartIdx.if_g_lang = 0;
            }
            continue;
        }
        if(lines[i].match(MENU_FUNCTION) !== null){//menu
            groupStartIdx.menuFunc = i;
            continue;
        }
        if(groupStartIdx.menuFunc !== 0){
            if(lines[i].match(END_FUNCTION) !== null){
                var menu = pushGroup(lines, groupStartIdx.menuFunc, i);
                linegroup.push(menu);
                groupStartIdx.menuFunc = 0;
            }
            continue;
        }
        if(lines[i].match(_B_FUNCTION) !== null) {//_b Define
            groupStartIdx._bDefine = i;
            continue;
        }
        if(groupStartIdx._bDefine !== 0){
            if(lines[i].match(BEFORE_ROW) !== null){//BEFORE ROW
               var _bHead = pushGroup(lines, groupStartIdx._bDefine, i);
               linegroup.push(_bHead);
               groupStartIdx._bDefine = 0;
            }
            continue;
        }
        if(lines[i].match(_BP_FUNCTION) !== null){//bp
            groupStartIdx._bpFunc = i;
            hasBpFunc = true;
            continue;
        }
        if(groupStartIdx._bpFunc !== 0){
            if(lines[i].match(END_FUNCTION) !== null){
                var _bp = pushGroup(lines, groupStartIdx._bpFunc, i);
                linegroup.push(_bp);
                groupStartIdx._bpFunc = 0;
            }
            continue;
        }
        if(lines[i].match(MENU_FUNCTION_1) !== null){
            groupStartIdx.startMenu1 = i;
            continue;
        }
        if(groupStartIdx.startMenu1 !== 0){
            if(lines[i].match(END_FUNCTION) !== null){
                //var menu1 = pushGroup(lines, groupStartIdx.startMenu1, i);
                groupStartIdx.startMenu1 = 0;
            }
            continue;
        }
        if(lines[i].match(MENU_FUNCTION_2) !== null){
            groupStartIdx.startMenu2 = i;
            continue;
        }
        if(groupStartIdx.startMenu2 !== 0){
            if(lines[i].match(END_FUNCTION) !== null){
                //var menu2 = pushGroup(lines, groupStartIdx.startMenu2, i);
                groupStartIdx.startMenu2 = 0;
            }
            continue;
        }
        if(lines[i].match(FOR_CNT_1_TO_ARRNO) !== null || lines[i].match(FOR_L_AC_1_TO_ARRNO) !== null){//乾洗 FOR l_xxx = 1  TO  g_xxx_arrno #單身 ARRAY 乾洗
            if(lines[i].match(END_FOR) !== null){//處理乾洗FOR...END FOR同一行的狀況
                linegroup.push(lines[i]);
            } else {
                groupStartIdx.dryCleaning = i;
            }
            continue;
        }
        if(groupStartIdx.dryCleaning !== 0){//乾洗
            if(lines[i].match(END_FOR) !== null){
                var dryCleaning = pushGroup(lines, groupStartIdx.dryCleaning, i);
                linegroup.push(dryCleaning);
                groupStartIdx.dryCleaning = 0;
            }
            continue;
        }
        if(lines[i].toUpperCase().match(PROMPT) !== null){//Prompt, 含換行的FOR
            if(lines[i].toUpperCase().match(FOR) !== null){
                linegroup.push(lines[i] + endPromptForTag);
            }else if(lines[i+1].toUpperCase().match(FOR) !== null){
                var promptFor = pushGroup(lines, i, i+1);       
                linegroup.push(promptFor + endPromptForTag);
                lines[i+1] = '';//清除下一行,比避免line[i+1]被加進linegroup,Prompt會有兩個FOR l_abso...之類的
            }else{
                linegroup.push(lines[i]);
            }
            continue;
        }
        if(lines[i].match(_B_ASKKEY) !== null){//有xxx_b_askkey()
            has_b_askkey = true;
            linegroup.push(lines[i]);
            continue;
        }
        linegroup.push(lines[i]);
    }
    return linegroup;
}

//同一組的字串接在一起
function pushGroup(lines, groupStartIdx, i){
    var aGroup = '';
    for(var j=groupStartIdx; j<i+1; j++){
        aGroup += lines[j] + '\n';
    }
    return aGroup;
}

function clearData(){
    variables.dynamicArrOfRecs = [];
    menuCommands = [];//清空第一個4gl的menuCommands
    menuHotKeys = [];//清空第一個4gl的menuHotKeys
    hasExitWhile = false;
    hasBpFunc = false;//hasBpFunc回到預設的false
    has_b_askkey = false;//has_b_askkey回到預設的false
    addExportToExcel = false;//addExportToExcel回到預設的false
    hasCallMenu = false;
    hasHideOption = false;//BeforeMenu有沒有Hide Option
    beforeMenuString = '';
    exportToExcelJudgment = {
        shallAddExportToExcel: false,
        alreadyHasExportToExcel: false,
    }
}