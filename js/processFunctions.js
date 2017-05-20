var globalCode = function(a_group){
    return 'GLOBALS ' + '"../../config/tiptop.inc"';
}

var dynamicArrOfRec = function(a_group){
    console.log('dynamicArrOfRec',a_group);
    var g_record = a_group.toLowerCase().match(/\w+\_\w+/g)[0];
    variables.dynamicArrOfRecs.push(g_record);
    exportToExcelJudgment.shallAddExportToExcel = true;
    //console.log('variables.dynamicArrOfRecs',variables.dynamicArrOfRecs);
	a_group = a_group.toLowerCase().replace(/array\[\d+\]\s+of\s+record/g,'DYNAMIC ARRAY OF RECORD');
    //console.log('a_group',a_group);
    return a_group;
}

var clearForm = function(a_group){
    //console.log('clearForm',a_group);
    if(variables.dynamicArrOfRecs.length > 0){
        for(var i=0; i<variables.dynamicArrOfRecs.length; i++){
            a_group = a_group + '\n' + blanks_8 + 'CALL ' + variables.dynamicArrOfRecs[i] + '.clear()\n'
        }
    }    
    //console.log(a_group);
    return a_group;
}

var g_langCase = function(a_group){
    a_group = commentOut(a_group);
    a_group = a_group.replace(/#case g_lang/g,'');
    //console.log(a_group);
    if(hasCallMenu === false){
        var callMenu =  a_group.match(/[\w\d]+_menu\(\)/g)[0];
        a_group = a_group + '\n' + blanks_4 + 'CALL ' + callMenu;
        hasCallMenu = true;
    }
	return a_group;
}

var openWindow = function(a_group){
    var cl_ui_init = '\n' + blanks_4 + 'CALL cl_ui_init()' + '\n';
    a_group = a_group.replace(/#main window/g,'');
    a_group = a_group.replace(/ATTRIBUTE\(\S+\)/g, '#ATTRIBUTE' + cl_ui_init);
    //console.log(a_group);
    return a_group;
}

var outFunc = function(a_group){
    var outFuncLines = a_group.split('\n');
    for(var i=0; i<outFuncLines.length; i++){
        if(outFuncLines[i].match(/l_za\d+\w+\s+CHAR\(\d+\)/g) !== null){
            //console.log(outFuncLines[i]);
            var l_za = outFuncLines[i].split('(')[0];
            var l_zaChar = outFuncLines[i].split('(')[1];
            var targetRegex = /\d+/g;
            l_zaChar = l_zaChar.replace(targetRegex, '(80');
            outFuncLines[i] = l_za + l_zaChar;
        }
        if(outFuncLines[i].includes('START REPORT')){
            outFuncLines[i] = 
                '\n'+'    CALL fgl_report_configureCompatibilityOutput(80,"Monospaced",TRUE,"","","")' +
                '\n'+'    CALL fgl_report_selectPreview("TRUE"))' +
                '\n'+'    CALL CALL fgl_report_selectDevice("PDF")' +
                '\n'+outFuncLines[i];
        }
        if(outFuncLines[i].includes('FINISH REPORT')){
            outFuncLines[i] = outFuncLines[i] + '\n' + '   CALL fgl_report_stopGraphicalCompatibilityMode()';
        }
    }
    a_group = outFuncLines.join('\n');
    return a_group;
}

var commentOutAttr = function(a_group){
    //var attrRegex = /ATTRIBUTE/g;
    a_group = a_group.replace('ATTRIBUTE', '#ATTRIBUTE');
    //console.log('attr',a_group);
    return a_group;
}

var onKey_onAction = function(a_group){
    if(a_group.toUpperCase().match(/ON KEY\(CONTROL-\w\)/g) !== null){//ON KEY(CONTROL-X)
        var onKeyControl = a_group.toUpperCase().match(/ON KEY\(CONTROL-\w\)/g)[0];
        var onKeyControl = onKeyControl.toUpperCase();
        var commandKey = onKeyControl.match(/\(CONTROL-\w\)/g)[0];
        //console.log(commandKey);
        commandKey = commandKey.replace(/\(CONTROL-/g,'CONTROL');
        commandKey = commandKey.replace(/\)/g,'');
        //console.log(commandKey);
        a_group = a_group.replace(/ON KEY\(CONTROL-\w\)/g,'ON ACTION ' + commandKey);
        a_group = a_group.replace(/ON KEY\(control-\w\)/g,'ON ACTION ' + commandKey);
    }
    
    if(a_group.toUpperCase().match(/ON\s+KEY\(F\d+\)/g) !== null){//ON KEY(F12)
        var onKeyF = a_group.toUpperCase().match(/ON\s+KEY\(F\d+\)/g)[0];
        a_group = a_group.replace(/ON\s+KEY\(F\d+\)/g, '#'+onKeyF);
    }
    return a_group;
}

var commentOutArrow = function(a_group){
    //console.log(a_group);
    var matchLine = a_group.match(/[\S\s]+arrow/g)[0];
    a_group = a_group.replace(/[\S\s]+arrow/g, '#'+ matchLine);
    //console.log(a_group);
    return a_group;
}

var onIdle_endInput = function(a_group){  
    var onIdle = '\n' + blanks_4 + 'ON IDLE g_idle\n' + blanks_8 + 'CALL cl_on_idle()\n' + blanks_8 + 'CONTINUE INPUT\n' + blanks_4 + 'END INPUT';
    a_group = a_group.replace(/END INPUT/g, onIdle);
    //console.log(a_group);
    return a_group;
}

var onIdle_construct = function(a_group){
    var a_groupArr =  a_group.split('\n');
    for(var i=0; i<a_groupArr.length; i++){
        if(a_groupArr[i].includes('INT_FLAG')){
            a_groupArr[i] = 
                '   ON IDLE g_idle' + '\n' +
                '      CALL cl_on_idle()' + '\n' +
                '      CONTINUE CONSTRUCT' + '\n' +
                '   END CONSTRUCT' + '\n' +
                a_groupArr[i] + '\n';
        }
    }
    a_group = a_groupArr.join('\n');
    return a_group;
}

var onIdle_prompt = function(a_group){
    //console.log(a_group);
    a_group = a_group.replace(/#end prompt for/g,'');

    var onIdle = '\n' + blanks_4 + 'ON IDLE g_idle\n' + blanks_8 + 'CALL cl_on_idle()\n' +  blanks_8 + 'END PROMPT\n';
    a_group = a_group + onIdle;
   //console.log(a_group);
    return a_group;
}

var l_za05Char = function(a_group){
    a_group = a_group.replace(/CHAR\(40\)/g,'CHAR(80)');
    return a_group;
}

var g_xChar = function(a_group){
    a_group = a_group.replace(/CHAR\(\d+\)/g,'CHAR(80)');
    return a_group;
}

var commentOutKeyBoardCtrl = function(a_group){
    a_group = '#' + a_group;
    return a_group;
}

var commentOutPageNo = function(a_group){
    //console.log(a_group);
    if(a_group.match(/g_\w+_pageno\s+SMALLINT/g) !== null){//g_pje_pageno    SMALLINT,
        a_group = '#' + a_group;
    }
    if(a_group.match(/LET\s+g_\w+_pageno(\s+|)=(\s+|)(1|0)/g) !== null){//LET g_bmp2_pageno = 0 || 1
        a_group = a_group.replace(/LET\s+g_\w+_pageno(\s+|)=(\s+|)(1|0)/g,'');
    }
    // var pageNoArr = a_group.match(/LET\s+g_\w+_pageno[\s\=]+0/g);
    // for(var i=0; i<pageNoArr.length; i++){
    //     //pageNoArr[i] = pageNoArr[i].replace(/LET\s+g_\w+_pageno[\s\=]+0/g, '#'+pageNoArr[i]);
    //     a_group = a_group.replace(/LET\s+g_\w+_pageno[\s\=]+0/g, '#'+pageNoArr[i]);
    // }
    // if(a_group.match(/CALL\s+[\d\w]+_bp\(('|")D('|")\)/g) !== null){
    //     var callBp_D_arr = a_group.match(/CALL\s+[\d\w]+_bp\(('|")D('|")\)/g);
    //     for(var i=0; i<callBp_D_arr.length; i++){
    //         //pageNoArr[i] = pageNoArr[i].replace(/LET\s+g_\w+_pageno[\s\=]+0/g, '#'+pageNoArr[i]);
    //         a_group = a_group.replace(/CALL\s+[\d\w]+_bp\(('|")D('|")\)/g, '#'+callBp_D_arr[i]);
    //     }
    // }
    
    return a_group;
}

var commentOutCall_bpD = function(a_group){
    //console.log(a_group);
    if(a_group.match(/CALL\s+\w+_bp\(('|")D('|")\)/g) !== null){//CALL i100_bp("D")
        a_group = a_group.replace(/CALL\s+\w+_bp\(('|")D('|")\)/g,'');
    }
    //console.log(a_group);
    return a_group;
}

// var commentOutInsertDeleteOption = function(a_group){
//     if(a_group.match(/INPUT ARRAY/g) === null){//沒有INPUT ARRAY, 排除FUNCTION _b()
//         a_group = commentOut(a_group);
//     }
//     //console.log(a_group);
//     return a_group;
// }

var commentOutInsertKey = function(a_group){
    a_group = a_group.replace(/INSERT\s+KEY/g,'#INSERT KEY');
    return a_group;
}

var commentOutDeleteKey = function(a_group){
    a_group = a_group.replace(/DELETE\s+KEY/g,'#DELETE KEY');
    return a_group;
}

var dryCleaningForLoop = function(a_group){
    var clearRecord;
    if(a_group.match(/INITIALIZE\s+g+\w+/g) !== null){
        clearRecord = a_group.match(/INITIALIZE\s+g+\w+/g)[0];
        clearRecord = clearRecord.replace(/INITIALIZE/g,'');
    }
    if(a_group.match(/INITIALIZE/g) !== null && a_group.match(/TO NULL/g) !== null){
        a_group = commentOut(a_group);
        //console.log(a_group);
    }
    a_group = a_group + '\n' + blanks_4 + 'CALL ' + clearRecord + '.clear()';
    //console.log(a_group);
    return a_group;
}

var _b_fillFunc = function(a_group){
    var a_groupArr =  a_group.split('\n');
    var groupStartIdx = {
        oldForLoop: 0,
    }

    var newGroupArr = [];

    for(var i=0; i<a_groupArr.length; i++){
        if(a_groupArr[i].match(/FOR\s+\w+\s+\=\s/g) !== null){
            groupStartIdx.oldForLoop = i;
            continue;
        }
        if(groupStartIdx.oldForLoop !== 0){
            if(a_groupArr[i].includes('END FOR')){
                var shouldCommentOut = true;
                var oldFor = pushGroup(a_groupArr, groupStartIdx.oldForLoop, i, shouldCommentOut);
                newGroupArr.push(oldFor);
                groupStartIdx.oldForLoop = 0;
            }   
            continue;
        }
        if(a_groupArr[i].match(/FOREACH\s\w+\sINTO/g) !== null){
            a_groupArr[i] = 'CALL ' + dynamicArrOfRecVariable + '.clear()' + '\n' + a_groupArr[i];
            newGroupArr.push(a_groupArr[i]);
            continue;
        }
        if(a_groupArr[i].includes('END FOREACH')){
            a_groupArr[i] = a_groupArr[i] + '\n' + 'CALL '+ dynamicArrOfRecVariable +'.deleteElement(g_cnt)' + '\n';
            newGroupArr.push(a_groupArr[i]);
            continue;
        }
        newGroupArr.push(a_groupArr[i]);
    }
    a_group = newGroupArr.join('\n');
    return a_group;
}

function commentOut(string){
    return '{' + '\n' + string + '\n' + '}';
}

