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
        var fileText_after = readLineArr.join('\r\n');
        
        //console.log(fileText_after);
        clearData();
        //initRequestFileSystem(fileCode,fileText_after);
        var mimeType = mimeType || 'application/octet-stream';
        download(fileName, fileText_after, mimeType);
    }
}

//逐行讀取
var readLine = function(fileText){
    var lines = fileText.split('\r\n');
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
    var processFunctions = [];
    // if(a_group.includes('GLOBAL')){
	// 	processFunctions.push(globalCode);
	// }
    if(a_group.toUpperCase().includes('CLEAR FORM')){
        processFunctions.push(clearForm);
    }
    if(a_group.toLowerCase().match(/g_\w+\s+array\[\d+\]\sof\srecord/g) !== null){
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
    if(a_group.match(/PROMPT[\s\w\,\'\:]+FOR/g) !== null){
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
    if(a_group.match(/FUNCTION \w+_b\(/g) !== null){
        processFunctions.push(_bBeforeRow);
    }
    if(a_group.match(/FUNCTION\s+\w+\_bp\(\w+\)/g) !== null){
        processFunctions.push(_bpFunc);
    }
    if(a_group.match(/LET\s+g_\w+_pageno[\s\=]+0/g) !== null){//pageno=0
        processFunctions.push(commentOutPageNo);
    }
    if(a_group.match(/l_za05\s+CHAR\(40\)/g) !== null){// l_za05 CHAR(80)
        processFunctions.push(l_za05Char);
    }
    if(a_group.toUpperCase().match(/G_X\s+ARRAY\[\d+\]\s+OF\s+CHAR\(\d+\)/g) !== null){
        processFunctions.push(l_za05Char);
    }
    if(a_group.match(/INSERT\s+KEY\s+F1/g) !== null){
        processFunctions.push(commentOutInsertDeleteOption);
    }
    if(a_group.match(/FOR\s+\w_cnt[\s\=]+1\s+TO\s+g_\w+_arrno/g) !== null){
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

    for(var i=0; i<lines.length; i++){
        if(groupStartIdx.hasOpenWindow === 0){
            if(lines[i].match(/OPEN\sWINDOW\s(\S|)+\sAT/g) !== null){//OPEN WINDOW
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
            groupStartIdx.if_g_lang = i;
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
        if(lines[i].match(/FUNCTION \w+_b\(/g) !== null) {//_b Define
            groupStartIdx._bDefine = i;
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
        if(lines[i].match(/LET\s+g_\w+_pageno[\s\=]+0/g) !== null){
            if(lines[i].match(/CALL\s+[\d\w]+_bp\(('|")D('|")\)/g) !== null){
                linegroup.push(lines[i]);
            }else{
                groupStartIdx._pageNo = i;
            }
            continue;
        }
        if(groupStartIdx._pageNo !== 0){
            if(lines[i].match(/CALL\s+[\d\w]+_bp\(('|")D('|")\)/g) !== null){
                var _pageGroup = pushGroup(lines, groupStartIdx._pageNo, i);
                linegroup.push(_pageGroup);
            }
            groupStartIdx._pageNo = 0;//通常不是在_pageno的下一行, 就是跟_pageno同一行
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
        if(lines[i].match(/FOR\s+\w_cnt[\s\=]+1\s+TO\s+g_\w+_arrno/g) !== null){//乾洗 FOR l_cnt = 1  TO  g_xxx_arrno #單身 ARRAY 乾洗
            groupStartIdx.dryCleaning = i;
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
        if(lines[i].match(/FUNCTION\s\w+_b_askkey\(/g) !== null){//有xxx_b_askkey()
            has_b_askkey = true;
            linegroup.push(lines[i]);
            continue;
        }
        if(lines[i].match(/INSERT\s+KEY\s+F1/g) !== null){//OPTIONS INSERT KEY F1, DELETE KEY F2
            linegroup[linegroup.length-1] = '';
            groupStartIdx.insertDeleteOptions = i-1;
            continue;
        }
        if(groupStartIdx.insertDeleteOptions !== 0){//OPTIONS INSERT KEY F1, DELETE KEY F2
            if(lines[i].match(/DELETE\s+KEY\s+F2/g) !== null){
                var options = pushGroup(lines, groupStartIdx.insertDeleteOptions, i);
                //console.log(options);
                linegroup.push(options);
                groupStartIdx.insertDeleteOptions = 0;
            }
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
        aGroup += lines[j] + '\r\n';
    }
    return aGroup;
}

var clearData = function(){
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
}