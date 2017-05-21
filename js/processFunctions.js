function globalCode(a_group){
    return 'GLOBALS ' + '"../../config/tiptop.inc"';
}

function dynamicArrOfRec(a_group){
    if(a_group.match(SR) !== null){
        return;
    }
    var programVariable = a_group.toLowerCase().match(PROGRAM_VARIABLE)[0];
    variables.dynamicArrOfRecs.push(programVariable);
    exportToExcelJudgment.shallAddExportToExcel = true;
    //console.log('variables.dynamicArrOfRecs',variables.dynamicArrOfRecs);
	a_group = a_group.toLowerCase().replace(ARRAY_OF_RECORD,'DYNAMIC ARRAY OF RECORD');
    //console.log('a_group',a_group);
    return a_group;
}

function clearForm(a_group){
    //console.log('clearForm',a_group);
    if(variables.dynamicArrOfRecs.length > 0){
        for(var i=0; i<variables.dynamicArrOfRecs.length; i++){
            a_group = a_group + '\n' + blanks_8 + 'CALL ' + variables.dynamicArrOfRecs[i] + '.clear()\n'
        }
    }    
    //console.log(a_group);
    return a_group;
}

function g_langCase(a_group){
    a_group = commentOut(a_group);
    a_group = a_group.replace(case_g_lang_Tag,'');
    //console.log(a_group);
    if(hasCallMenu === false){
        var callMenu =  a_group.match(FILENAME_MENU)[0];
        a_group = a_group + '\n' + blanks_4 + 'CALL ' + callMenu;
        hasCallMenu = true;
    }
	return a_group;
}

function openWindow(a_group){
    var cl_ui_init = '\n' + blanks_4 + 'CALL cl_ui_init()' + '\n';
    a_group = a_group.replace(mainWindowTag,'');
    a_group = a_group.replace(ATTRIBUTE_COLOR, '#ATTRIBUTE' + cl_ui_init);
    //console.log(a_group);
    return a_group;
}

function outFunc(a_group){
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

function commentOutAttr(a_group){
    //var attrRegex = /ATTRIBUTE/g;
    a_group = a_group.replace(ATTRIBUTE, '#ATTRIBUTE');
    //console.log('attr',a_group);
    return a_group;
}

function onKey_onAction(a_group){
    if(a_group.toUpperCase().match(ON_KEY_CONTROL_X) !== null){//ON KEY(CONTROL-X)
        var onKeyControl = a_group.toUpperCase().match(ON_KEY_CONTROL_X)[0];
        var onKeyControl = onKeyControl.toUpperCase();
        var commandKey = onKeyControl.match(CONTROL_X)[0];
        //console.log(commandKey);
        commandKey = commandKey.replace(/\(CONTROL-/g,'CONTROL');
        commandKey = commandKey.replace(/\)/g,'');
        //console.log(commandKey);
        a_group = a_group.replace(ON_KEY_CONTROL_X,'ON ACTION ' + commandKey);
        a_group = a_group.replace(ON_KEY_control_X,'ON ACTION ' + commandKey);
    }
    
    if(a_group.toUpperCase().match(ON_KEY_FXX) !== null){//ON KEY(F12)
        var onKeyF = a_group.toUpperCase().match(ON_KEY_FXX)[0];
        a_group = a_group.replace(ON_KEY_FXX, '#'+onKeyF);
    }
    return a_group;
}

function commentOutArrow(a_group){
    //console.log(a_group);
    var matchLine = a_group.match(LINE_HAS_ARROW)[0];
    a_group = a_group.replace(LINE_HAS_ARROW, '#'+ matchLine);
    //console.log(a_group);
    return a_group;
}

function onIdle_endInput(a_group){  
    var onIdle = '\n' + blanks_4 + 
                 'ON IDLE g_idle\n' + blanks_8 + 
                 'CALL cl_on_idle()\n' + blanks_8 + 
                 'CONTINUE INPUT\n' + blanks_4 + 
                 'END INPUT';
    a_group = a_group.replace(END_INPUT, onIdle);
    //console.log(a_group);
    return a_group;
}

function onIdle_construct(a_group){
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

function onIdle_prompt(a_group){
    //console.log(a_group);
    a_group = a_group.replace(endPromptForTag,'');

    var onIdle = '\n' + blanks_4 + 
                 'ON IDLE g_idle\n' + blanks_8 + 
                 'CALL cl_on_idle()\n' +  blanks_8 + 
                 'END PROMPT\n';
    a_group = a_group + onIdle;
   //console.log(a_group);
    return a_group;
}

function l_za05Char(a_group){
    a_group = a_group.replace(CHAR_XX,'CHAR(80)');
    return a_group;
}

function g_xChar(a_group){
    a_group = a_group.replace(CHAR_XX,'CHAR(80)');
    return a_group;
}

function commentOutKeyBoardCtrl(a_group){
    a_group = '#' + a_group;
    return a_group;
}

function commentOutPageNo(a_group){
    //console.log(a_group);
    if(a_group.match(G_XXX_PAGENO_SMALLINT) !== null){//g_pje_pageno    SMALLINT,
        a_group = '#' + a_group;
    }
    if(a_group.match(LET_G_XXX_PAGENO_EQUALS_TO_X) !== null){//LET g_bmp2_pageno = 0 || 1
        a_group = a_group.replace(LET_G_XXX_PAGENO_EQUALS_TO_X,'');
    }
    
    return a_group;
}

function commentOutCall_bpD(a_group){
    //console.log(a_group);
    if(a_group.match(CALL_XXX_BP_D) !== null){//CALL i100_bp("D")
        a_group = a_group.replace(CALL_XXX_BP_D,'');
    }
    //console.log(a_group);
    return a_group;
}

function commentOutInsertKey(a_group){
    a_group = a_group.replace(INSERT_KEY,'#INSERT KEY');
    return a_group;
}

function commentOutDeleteKey(a_group){
    a_group = a_group.replace(DELETE_KEY,'#DELETE KEY');
    return a_group;
}

function dryCleaningForLoop(a_group){
    var clearRecord;
    if(a_group.match(INITIALIZE_TO_NULL) !== null){
        clearRecord = a_group.match(INITIALIZE_TO_NULL)[0];
        clearRecord = clearRecord.replace(INITIALIZE,'');
    }
    if(a_group.match(INITIALIZE) !== null && a_group.match(TO_NULL) !== null){
        a_group = commentOut(a_group);
        //console.log(a_group);
    }
    a_group = a_group + '\n' + blanks_4 + 'CALL ' + clearRecord + '.clear()';
    //console.log(a_group);
    return a_group;
}

function _b_fillFunc(a_group){
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

//拿掉""
function clearQuotation(string){
    //console.log(string);
    return string.replace(/('|")/g,'');
}

