var blanks_1 = ' ';
var blanks_4 = '    ';
var blanks_6 = '      ';
var blanks_8 = '        ';
var blanks_12 = '            ';
var fileCode;
var hasBpFunc = false;
var has_b_askkey = false;
var hasCallMenu = false;//用在g_lang

var variables = {
    dynamicArrOfRecs: [],
}

var main = function(event){
    var files = event.target.files;
    for(var i=0; i<files.length; i++){
        setUpReader(files[i],i);
    }
}

var setUpReader = function(file){
    var fileName = file.name;
    
    fileCode = fileName.match(/\w{1}\d+/g)[0];
    var fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = function(event){
        //console.log('fileName',fileName);
        //fileCodeRepository = fileCode;
        var fileText = fileReader.result; 
        var readLineArr = readLine(fileText);
        var fileText_after = readLineArr.join('\n');
        
        console.log(fileText_after);
        clearData();
        var mimeType = mimeType || 'application/octet-stream';
        download(fileName, fileText_after, mimeType);
    }
}

//逐行讀取
var readLine = function(fileText){
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
var modifyLine = function(a_group){
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
var getProcessFunctions = function(a_group){
    //console.log(a_group);
    var processFunctions = [];
    // if(a_group.includes('GLOBAL')){
	// 	processFunctions.push(globalCode);
	// }
    if(a_group.toUpperCase().includes('CLEAR FORM')){
        processFunctions.push(clearForm);
    }
    if(a_group.toLowerCase().match(/\w+\_\w+\s+array\[\d+\]\s+of\s+record/g) !== null){
        processFunctions.push(dynamicArrOfRec);           
    }
    if(a_group.includes('ATTRIBUTE')){
        processFunctions.push(commentOutAttr);
    }
    if(a_group.includes('ON KEY')){
        processFunctions.push(onKey_onAction);
    }
    if(a_group.toLowerCase().match(/arrow/g) !== null){
        processFunctions.push(commentOutArrow);
    }
    if(a_group.match(/\w+_pageno/g) !== null){
        processFunctions.push(commentOutPageNo);
    }
    if(a_group.match(/CALL\s+\w+_bp\(('|")D('|")\)/g) !== null){
        processFunctions.push(commentOutCall_bpD);
    }
    // if(a_group.match(/PROMPT[\s\w\,\'\:]+FOR/g) !== null){
    //     processFunctions.push(onIdle_prompt);
    // }
    if(a_group.match(/#end prompt for/g) !== null){
        processFunctions.push(onIdle_prompt);
    }
    if(a_group.match(/END INPUT/g) !== null){
        processFunctions.push(onIdle_endInput);
    }
    // if(a_group.includes('CONSTRUCT')){
    //     processFunctions.push(onIdle_construct);
    // }
    // if(a_group.match(/ON KEY\(\w+\)\s+NEXT\sFIELD/g) !== null){
    //     processFunctions.push(commentOutKeyBoardCtrl);
    // }
    if(a_group.match(/case g_lang/g) !== null){
        processFunctions.push(g_langCase);
    }
    if(a_group.match(/main\swindow/g) !== null){
        processFunctions.push(openWindow);
    }
    if(a_group.match(/FUNCTION\s+\w+_menu\(/g) !== null){
        if(hasBpFunc===true){
            processFunctions.push(menuWtihBpFunc);
        }else{
            processFunctions.push(menuWtihoutBp);
        }
    }
    if(a_group.match(/FUNCTION \w+_b\(/g) !== null && a_group.match(/FUNCTION \w+_g_b\(/g) === null){
        processFunctions.push(_bBeforeRow);
    }
    if(a_group.match(/FUNCTION\s+\w+\_bp\(\w+\)/g) !== null){
        processFunctions.push(_bpFunc);
    }
    if(a_group.match(/l_za05\s+CHAR\(\d+\)/g) !== null){// l_za05 CHAR(80)
        processFunctions.push(l_za05Char);
    }
    if(a_group.toUpperCase().match(/G_X\s+ARRAY\[\d+\]\s+OF\s+CHAR\(\d+\)/g) !== null){
        processFunctions.push(l_za05Char);
    }
    if(a_group.match(/ima02[\w\s]+CHAR\(\d+\)/g) !== null){// ima02 CHAR(80)
        processFunctions.push(ima02Char);
    }
    if(a_group.match(/INSERT\s+KEY/g) !== null){
        processFunctions.push(commentOutInsertKey);
    }
    if(a_group.match(/DELETE\s+KEY/g) !== null){
        processFunctions.push(commentOutDeleteKey);
    }
    if(a_group.match(/FOR\s+\w_cnt[\s\=]+1\s+TO\s+\w+_arrno/g) !== null || a_group.match(/FOR\s+l_ac[\s\=]+1\s+TO\s+\w+_arrno/g) !== null){
        processFunctions.push(dryCleaningForLoop);
    }
    return processFunctions;
}

//把一句話分在一組
var groupLines = function(lines){
    var groupStartIdx = {
        arrayChar: 0,
        g_lang: 0,
        if_g_lang: 0,
        _pageNo: 0,
        inputArray: 0,
        _bpD: 0,
        _b_fillFunc: 0,
        menuFunc: 0,
        _bpFunc: 0,
        _bDefine: 0,
        construct: 0,
        startOpenWindow: 0,
        hasOpenWindow: 0,
        startMenu1: 0,
        startMenu2: 0,
        insertDeleteOptions: 0,
        dryCleaning: 0,
    }
    var linegroup = [];
   //console.log(lines);
    for(var i=0; i<lines.length; i++){
        
        if(groupStartIdx.hasOpenWindow === 0){
            if(lines[i].match(/OPEN\s+WINDOW\s+(\S|)+\s+AT/g) !== null){//OPEN WINDOW
                if(lines[i].match(/ATTRIBUTE/g) !== null){
                    linegroup.push(lines[i] + ' #main window');
                    //console.log('openWindow',lines[i] + ' #main window');
                    groupStartIdx.hasOpenWindow = 1;
                } else {
                    groupStartIdx.startOpenWindow = i;
                }
                continue;
            }
        }
        if(groupStartIdx.startOpenWindow !== 0){
            if(lines[i].match(/ATTRIBUTE/g) !== null){
                var openWindow = pushGroup(lines, groupStartIdx.startOpenWindow, i);
                linegroup.push(openWindow + ' #main window');
                //console.log('openWindow',openWindow + ' #main window');
                groupStartIdx.startOpenWindow = 0;
                groupStartIdx.hasOpenWindow = 1;
            }
            continue;
        }
        if(lines[i].match(/WHEN\sg_lang[\s\=]+('|")0/g) !== null){//WHEN g_lang='0'
            groupStartIdx.g_lang = i-1;
            var lastGroupOfLinegroup = linegroup[linegroup.length-1];
            linegroup[linegroup.length-1] = lastGroupOfLinegroup.replace('CASE','');//清除上一行已經加入lineGroup的句子
            continue;
        }
        if(groupStartIdx.g_lang !== 0){
            if(lines[i].includes('END CASE')){
                var g_lang = pushGroup(lines, groupStartIdx.g_lang, i);
                linegroup.push(g_lang + ' #case g_lang');
                //console.log('g_lang',g_lang);
                groupStartIdx.g_lang = 0;
            }
            continue;
        }
        if(lines[i].match(/IF\s+g_lang[\s\=]+('|")0('|")\s+THEN/g) !== null){//IF g_lang='0'
            if(lines[i].match(/END IF/g) === null){
                groupStartIdx.if_g_lang = i;
            } else {//IF g_lang='0' THEN ... END IF在同一行的狀況
                linegroup.push(lines[i] + ' #case g_lang');
            }
            continue;
        }
        if(groupStartIdx.if_g_lang !== 0){
            if(lines[i].includes('END IF')){
                var if_g_lang = pushGroup(lines, groupStartIdx.if_g_lang, i);
                linegroup.push(if_g_lang + ' #case g_lang');
                //console.log('g_lang',g_lang);
                groupStartIdx.if_g_lang = 0;
            }
            continue;
        }
        if(lines[i].match(/FUNCTION\s+\w+_menu\(/g) !== null){//menu
            groupStartIdx.menuFunc = i;
            continue;
        }
        if(groupStartIdx.menuFunc !== 0){
            if(lines[i].includes('END FUNCTION')){
                var menu = pushGroup(lines, groupStartIdx.menuFunc, i);
                linegroup.push(menu);
                groupStartIdx.menuFunc = 0;
            }
            continue;
        }
        if(lines[i].match(/FUNCTION \w+_b\(/g) !== null && lines[i].match(/FUNCTION \w+_g_b\(/g) === null) {//_b Define
            groupStartIdx._bDefine = i;//排除t系列程式有_g_b的狀況
            continue;
        }
        if(groupStartIdx._bDefine !== 0){
            if(lines[i].match(/BEFORE ROW/g) !== null){//BEFORE ROW
               var _bHead = pushGroup(lines, groupStartIdx._bDefine, i);
               linegroup.push(_bHead);
               groupStartIdx._bDefine = 0;
            }
            continue;
        }
        if(lines[i].match(/FUNCTION\s+\w+\_bp\(\w+\)/g) !== null){//bp
            groupStartIdx._bpFunc = i;
            hasBpFunc = true;
            continue;
        }
        if(groupStartIdx._bpFunc !== 0){
            if(lines[i].includes('END FUNCTION')){
                var _bp = pushGroup(lines, groupStartIdx._bpFunc, i);
                linegroup.push(_bp);
                groupStartIdx._bpFunc = 0;
            }
            continue;
        }
        if(lines[i].match(/FUNCTION\s+\w+_menu1\(\)/g) !== null){
            groupStartIdx.startMenu1 = i;
            continue;
        }
        if(groupStartIdx.startMenu1 !== 0){
            if(lines[i].match(/END\s+FUNCTION/g) !== null){
                var menu1 = pushGroup(lines, groupStartIdx.startMenu1, i);
                groupStartIdx.startMenu1 = 0;
            }
            continue;
        }
        if(lines[i].match(/FUNCTION\s+\w+_menu2\(\)/g) !== null){
            groupStartIdx.startMenu2 = i;
            continue;
        }
        if(groupStartIdx.startMenu2 !== 0){
            if(lines[i].match(/END\s+FUNCTION/g) !== null){
                var menu2 = pushGroup(lines, groupStartIdx.startMenu2, i);
                groupStartIdx.startMenu2 = 0;
            }
            continue;
        }
        if(lines[i].match(/FOR\s+\w_cnt[\s\=]+1\s+TO\s+\w+_arrno/g) !== null || lines[i].match(/FOR\s+l_ac[\s\=]+1\s+TO\s+\w+_arrno/g) !== null){//乾洗 FOR l_xxx = 1  TO  g_xxx_arrno #單身 ARRAY 乾洗
            if(lines[i].match(/END FOR/g) !== null){//處理乾洗FOR...END FOR同一行的狀況
                linegroup.push(lines[i]);
            } else {
                groupStartIdx.dryCleaning = i;
            }
            continue;
        }
        if(groupStartIdx.dryCleaning !== 0){//乾洗
            if(lines[i].match(/END FOR/g) !== null){
                var dryCleaning = pushGroup(lines, groupStartIdx.dryCleaning, i);
                linegroup.push(dryCleaning);
                groupStartIdx.dryCleaning = 0;
            }
            continue;
        }
        if(lines[i].toUpperCase().match(/PROMPT/g) !== null){//Prompt, 含換行的FOR
           //console.log(lines[i]);
            if(lines[i].toUpperCase().match(/FOR/g) !== null){
                linegroup.push(lines[i] + ' #end prompt for');
            }else if(lines[i+1].toUpperCase().match(/FOR/g) !== null){
                var promptFor = pushGroup(lines, i, i+1);       
                linegroup.push(promptFor + ' #end prompt for');
                lines[i+1] = '';//清除下一行,比避免line[i+1]被加進linegroup,Prompt會有兩個FOR l_abso...之類的
            }else{
                linegroup.push(lines[i]);
            }
            continue;
        }
        if(lines[i].match(/FUNCTION\s\w+_b_askkey\(/g) !== null){//有xxx_b_askkey()
            has_b_askkey = true;
            linegroup.push(lines[i]);
            continue;
        }
        linegroup.push(lines[i]);
    } 
    return linegroup;
}

//同一組的字串接在一起
var pushGroup = function(lines, groupStartIdx, i){
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