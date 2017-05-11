var menuCommands = [];
var menuHotKeys = [];
var hasExitWhile = false;
var addExportToExcel = false;
var hasHideOption = false;
var beforeMenuString = '';

var menuWtihBpFunc = function(a_group){
    //console.log(a_group);
    var groupArr =  a_group.split('\n');
    
    var menuGroup = [];
    var menuGroupIdx = {
        //startMenu: 0,
        startBeforeMenu: 0,
        startDetail: 0,
        startInterrupt: 0,
        startControln: 0,
    }
    
    // for(var i=0; i<groupArr.length; i++){
    //     if(groupArr[i].match(/MENU\s('|"){2}/g) !== null){
    //         menuGroupIdx.startMenu = i;
    //         continue;
    //     }
    //     if(menuGroup.startMenu !== 0){
    //         if(groupArr[i].includes('END MENU')){
    //             var menu = pushGroup(groupArr, menuGroupIdx.startMenu, i);
    //             menuGroup.push(menu);
    //             menuGroupIdx.startMenu = 0;
    //             continue;
    //         }
    //     }
    // }

    // var originMenu = commentOut(menuGroup.join('\n'));

    var newGroupArr = [];
    var hotKeyBegin = false;

    for(var i=0; i<groupArr.length; i++){
        if(groupArr[i].match(/MENU\s('|"){2}/g) !== null){
            var whileTrue = 'WHILE TRUE' + '\n' + 
                            blanks_4 + 'CALL ' + fileCode + '_bp("G")' + '\n' + 
                            blanks_4 + 'CASE g_action' + '\n';
            var aline = groupArr[i].replace(/MENU\s('|"){2}/g, whileTrue);
            newGroupArr.push(aline);
            continue;
        }
        if(groupArr[i].match(/BEFORE MENU/g) !== null){//BEFORE MENU
            menuGroupIdx.startBeforeMenu = i;
            continue;
        }
        if(groupArr[i].match(/COMMAND\s('|")(\d|\w+).\S+/g) !== null){//一般
            if(menuGroupIdx.startBeforeMenu !== 0){
                var beforeMenu = pushGroup(groupArr, menuGroupIdx.startBeforeMenu, i-1);//碰到第一個COMMAND before menu結束
                beforeMenuString = beforeMenu;
                beforeMenu = commentOut(beforeMenu);
                newGroupArr.push(beforeMenu);   
                hasHideOption = true;
                menuGroupIdx.startBeforeMenu = 0; 
            }
            if(groupArr[i].match(/COMMAND\s('|")Q.\W+HELP\s\d+/g) !== null){//query
                var aline = groupArr[i].replace(/COMMAND\s('|")Q.\W+HELP\s\d+/g, 'WHEN "query"');
                newGroupArr.push(aline);
                isCommentOut(groupArr[i],'query');
                continue;
            }
            if(groupArr[i].match(/COMMAND\s('|")B.\W+HELP\s\d+/g) !== null){//detail
                var aline = groupArr[i].replace(/COMMAND\s('|")B.\W+HELP\s\d+/g, 'WHEN "detail"');
                newGroupArr.push(aline);
                isCommentOut(groupArr[i],'detail');
                menuGroupIdx.startDetail = i;
                addExportToExcel = true;
                continue;
            }
            if(menuGroupIdx.startDetail !== 0){
                if(groupArr[i].match(/END IF/g) !== null){//detail end if
                    //console.log('END IF', groupArr[i]);
                    menuGroupIdx.startDetail = 0;
                }
                newGroupArr.push(groupArr[i]);
                continue;
            }
            if(addExportToExcel === true){//如果有detail的話,要加上exportToExcel的按鈕
                var exporttoexcel = blanks_6 + 'WHEN "exporttoexcel"\n' +
                                    blanks_8 + "IF cl_prichk('O') THEN\n" +
                                    blanks_12 + '#CALL cl_export_to_excel(ui.Interface.getRootNode(),base.TypeInfo.create(g_fac),"","")\n' +
                                    blanks_8 + 'END IF\n';
                newGroupArr.push(exporttoexcel);
                menuCommands.push('exporttoexcel');
                addExportToExcel = false;
                //continue;
            }
            if(groupArr[i].match(/COMMAND\s('|")A.\W+HELP\s\d+/g) !== null){//add
                var aline = groupArr[i].replace(/COMMAND\s('|")A.\W+HELP\s\d+/g, 'WHEN "add"');
                newGroupArr.push(aline);
                isCommentOut(groupArr[i],'add');
                continue;
            }
            if(groupArr[i].match(/COMMAND\s('|")U.\W+HELP\s\d+/g) !== null){//modify
                var aline = groupArr[i].replace(/COMMAND\s('|")U.\W+HELP\s\d+/g, 'WHEN "modify"');
                newGroupArr.push(aline);
                isCommentOut(groupArr[i],'modify');
                continue;
            }
            if(groupArr[i].match(/COMMAND\s('|")C.\W+HELP\s\d+/g) !== null){//reproduce
                var aline = groupArr[i].replace(/COMMAND\s('|")C.\W+HELP\s\d+/g, 'WHEN "reproduce"');
                newGroupArr.push(aline);
                isCommentOut(groupArr[i],'reproduce');
                continue;
            }
            if(groupArr[i].match(/COMMAND\s('|")R.\W+HELP\s\d+/g) !== null){//remove
                var aline = groupArr[i].replace(/COMMAND\s('|")R.\W+HELP\s\d+/g, 'WHEN "remove"');
                newGroupArr.push(aline);
                isCommentOut(groupArr[i],'remove');
                //menuCommands.push('remove');
                continue;
            }
            if(groupArr[i].match(/COMMAND\s('|")O.\W+HELP\s\d+/g) !== null){//output
                var aline = groupArr[i].replace(/COMMAND\s('|")O.\W+HELP\s\d+/g, 'WHEN "output"');
                newGroupArr.push(aline);
                isCommentOut(groupArr[i],'output');
                continue;
            }
            if(groupArr[i].match(/COMMAND\s('|")H.\W+HELP\s\d+/g) !== null){//about
                var aline = groupArr[i].replace(/COMMAND\s('|")H.\W+HELP\s\d+/g, 'WHEN "about"');
                newGroupArr.push(aline);
                isCommentOut(groupArr[i],'about');
                continue;
            }
            if(groupArr[i].match(/COMMAND\s('|")N.\W+HELP\s\d+/g) !== null){//next
                var aline = groupArr[i].replace(/COMMAND\s('|")N.\W+HELP\s\d+/g, 'WHEN "next"');
                newGroupArr.push(aline);
                menuHotKeys.push('next');
                continue;
            }
            if(groupArr[i].match(/COMMAND\s('|")P.\W+HELP\s\d+/g) !== null){//previous
                var aline = groupArr[i].replace(/COMMAND\s('|")P.\W+HELP\s\d+/g, 'WHEN "previous"');
                newGroupArr.push(aline);
                menuHotKeys.push('previous');
                continue;
            }
            if(groupArr[i].match(/COMMAND\s('|")Esc.\W+('|")/g) !== null){//esc
                var aline = groupArr[i].replace(/COMMAND\s('|")Esc.\W+('|")/g, 'WHEN "exit"');
                aline = aline.replace(/EXIT\sMENU/g,'EXIT WHILE');
                newGroupArr.push(aline);
                menuCommands.push("exit");
                continue;
            }
            if(groupArr[i].match(/COMMAND\s('|").[\S\s]+/g) !== null){//user defined
                var aline = groupArr[i].replace(/COMMAND/g, 'WHEN');
                aline = aline.replace(/HELP\s\d+/g,'');
                newGroupArr.push(aline);
                if(groupArr[i].match(/(#|{)\s{0,}COMMAND/g) === null){//COMMAND沒有註解的話,才能加入bp
                    var userDefined = groupArr[i].match(/"[\d\w]+\.[\S\s]+"/g)[0].replace(/"/g,'');//去掉“”    
                    menuCommands.push(userDefined);
                }
                continue;
            }
        }
        if(groupArr[i].match(/COMMAND\sKEY/g) !== null){//熱鍵
            if(groupArr[i].match(/COMMAND\sKEY\(esc\)/g) !== null){
                menuCommands.push('close');
                //hotKeyBegin=true;
                continue;
            }
            // if(groupArr[i].match(/COMMAND\sKEY\(('|")\/('|")\)/g) !== null){//熱鍵jump
            //     menuGroupIdx.startJump = i;
            //     continue;
            // }
            if(groupArr[i].match(/COMMAND\sKEY\(esc\)/g) !== null){//熱鍵close
                //var aline = '{' + '\n' + groupArr[i];
                groupArr[i] = groupArr[i].replace(/COMMAND\sKEY/g, 'WHEN ');
                var deleteManually = '\n' + blanks_8 + '請手動刪除esc';
                newGroupArr.push(groupArr[i] + deleteManually);
                menuCommands.push('close');
                hotKeyBegin=true;
                continue;
            }
            if(groupArr[i].match(/COMMAND\sKEY\(('|")\/('|")\)/g) !== null){//熱鍵jump
                //var aline = '#' + groupArr[i];
                var jump = groupArr[i].replace(/COMMAND\sKEY/g, 'WHEN ');
                jump = jump.replace(/\(('|")\/('|")\)/g,'"jump"');
                //console.log(jump);
                newGroupArr.push(jump);
                menuHotKeys.push('jump');
                continue;
            }
            if(groupArr[i].match(/COMMAND\sKEY\(F\)/g) !== null){//熱鍵first
                //var aline = '#' + groupArr[i];
                var first = groupArr[i].replace(/COMMAND\sKEY/g, 'WHEN ');
                first = first.replace(/\(F\)/g,'"first"');
                newGroupArr.push(first);
                menuHotKeys.push('first');
                continue;
            }
            if(groupArr[i].match(/COMMAND\sKEY\(L\)/g) !== null){//熱鍵last
                //var aline = '#' + groupArr[i];
                var last = groupArr[i].replace(/COMMAND\sKEY/g, 'WHEN ');
                last = last.replace(/\(L\)/g,'"last"');
                newGroupArr.push(last);
                menuHotKeys.push('last');
                continue;
            }
            if(groupArr[i].match(/COMMAND\sKEY\(F3\)/g) !== null){//熱鍵f3 忽略
                continue;
            }
            if(groupArr[i].match(/COMMAND\sKEY\(F4\)/g) !== null){//熱鍵f4 忽略
                continue;
            }
            if(groupArr[i].toUpperCase().match(/COMMAND\sKEY\(CONTROL\-N\)/g) !== null){//熱鍵controlN
                var controln = groupArr[i].replace(/COMMAND\sKEY/g, 'WHEN ');
                var callAskKey;
                if(has_b_askkey === true){
                    callAskKey = '"controln"' + '\n' + blanks_8 + 'CALL '+ fileCode + '_b_askkey()';
                }else{
                    callAskKey = '"controln"' + '\n' + blanks_8 + '#CALL '+ fileCode + '_b_askkey()';
                }   
                controln = controln.toUpperCase().replace(/\(CONTROL\-N\)/g, callAskKey);
                newGroupArr.push(controln);
                menuCommands.push('controln');
                menuGroupIdx.startControln = i;
                continue;
            }
            if(groupArr[i].toUpperCase().match(/COMMAND\sKEY\(CONTROL\-G\)/g) !== null){//熱鍵controlG
                var controlg = groupArr[i].replace(/COMMAND\sKEY/g, 'WHEN ');
                controlg = controlg.toUpperCase().replace(/\(CONTROL\-G\)/g,'"controlg"');
                newGroupArr.push(controlg);
                menuCommands.push('controlg');
                continue;
            }
            if(groupArr[i].match(/COMMAND\sKEY\(INTERRUPT\)/g) !== null){//熱鍵INTERRUPT
                //var aline = '#' + groupArr[i];
                menuGroupIdx.startInterrupt = i;
                continue;
            }
        }
        //以下是需要加工的判斷式
        if(menuGroupIdx.startBeforeMenu !== 0){
            //BEFORE MENU開始,到下一個COMMAND之前,都不要push任何行數
            continue;
        }
        if(menuGroupIdx.startDetail !== 0){//detail加上ELSE LET g_action="" END IF
            if(groupArr[i].match(/END IF/g) !== null){
                var elseGAction = 'ELSE LET g_action="" END IF';
                groupArr[i] = groupArr[i].replace(/END IF/g, elseGAction);
                newGroupArr.push(groupArr[i]);
                menuGroupIdx.startDetail = 0;
            } else {
                newGroupArr.push(groupArr[i]);
            }
            continue;
        }
        if(groupArr[i].match(/CALL\s[\w\d]+_bp\(("|')D("|')\)/g) !== null){//F3 CALL i100_bp("D")忽略
            continue;
        }
        if(groupArr[i].match(/CALL\s[\w\d]+_bp\(("|')U("|')\)/g) !== null){//F4 CALL i100_bp("U")忽略
            continue;
        }
        if(groupArr[i].match(/EXIT\sMENU/g) !== null){//只能有一個EXIT MENU
            if(hasExitWhile === false){//第一個EXIT MENU, 轉成EXIT WHILE
                var aline = groupArr[i].replace(/EXIT\sMENU/g,'EXIT WHILE');
                newGroupArr.push(aline);
                hasExitWhile = true;
            }
            //第二個EXIT MENU, 就不加進去了
            continue;
        }
        if(menuGroupIdx.startInterrupt !== 0){//interrupt LET INT_FLAG=0 忽略
            if(groupArr[i].match(/LET INT_FLAG/g) !== null){
                menuGroupIdx.startInterrupt = 0;
            }
            continue;
        }
        if(menuGroupIdx.startControln !== 0){//controln CALL i100_bp("N") 忽略
            menuGroupIdx.startControln = 0;
            continue;
        }
        if(groupArr[i].match(/END\sMENU/g) !== null){
            var endWhile = '   END CASE' + '\n' + blanks_4 + 'END WHILE'; //熱鍵註解的}
            var aline = groupArr[i].replace(/END\sMENU/g, endWhile);
            newGroupArr.push(aline);
            continue;
        }
        newGroupArr.push(groupArr[i]);
    }
    a_group = newGroupArr.join('\n');
    //console.log(a_group);
    return a_group;
}

function isCommentOut(group,command){//COMMAND沒有註解的話,才能加入bp
    //console.log('group',group);
    if(group.match(/(#|{)\s{0,}COMMAND/g) === null){
        menuCommands.push(command);
    }
}

function getBeforeDisplay(){
    beforeMenuString = beforeMenuString.replace(/BEFORE MENU/g, 'BEFORE DISPLAY');
    //console.log(beforeMenuString);
    var newBeforeDisplay = [];
    var beforeMenuArr = beforeMenuString.split('\n');
    for(var i=0;i<beforeMenuArr.length;i++){
        if(beforeMenuArr[i].match(/HIDE\s+OPTION\s+('|")\S+('|")/g) !== null){
            var cl_set_action = '\n' + blanks_12 + 'CALL cl_set_action(請先自行填寫,FALSE)';
            var markOption = '#' + beforeMenuArr[i].match(/HIDE\s+OPTION\s+('|")\S+('|")/)[0];
            beforeMenuArr[i] = beforeMenuArr[i].replace(/HIDE\s+OPTION\s+('|")\S+('|")/g,markOption + cl_set_action);
            newBeforeDisplay.push(beforeMenuArr[i]);
            continue;
        }
        newBeforeDisplay.push(beforeMenuArr[i]);
    }
    newBeforeDisplay = newBeforeDisplay.join('\n');
    //console.log(newBeforeDisplay);
    return newBeforeDisplay;
}

var _bpFunc = function(a_group){

    var a_groupArr =  a_group.split('\n');
    
    var groupStartIdx = {
        switchCase: 0,
    }

    var g_s_record = blanks_4 + '#' + a_group.match(/DISPLAY\s+g_\w+\[\w+\].\*\s+TO\s+s_\w+\[\w+\].\*/g)[0] + '\n';//抓到DISPLAY g_xxx[l_xxx].* TO s_xxx[l_xxx].*
    //console.log(g_s_record);

    //var s_variable = 's_' + dynamicArrOfRecVariable.split('_')[1];
    
    var newCode = blanks_4 + 
                  'DEFINE p_ud            CHAR(1)' + '\n' + blanks_4 +
                  'IF p_ud <>"G" OR g_action="detail" THEN' + '\n' + blanks_4 +
                  '    RETURN' + '\n' + blanks_4 +
                  'END IF' + '\n' + blanks_4 +
                  'LET g_action = "" ' + '\n' + blanks_4 +
                  'CALL cl_set_act_visible("accept,cancel", FALSE)' + '\n' + blanks_4 +
                  'DISPLAY ARRAY g_程式變數 TO s_程式變數.* ATTRIBUTE(COUNT=單身筆數, DOUBLECLICK=SELECT, UNBUFFERED)' + '\n';
    
    var newBeforeDisplay = getBeforeDisplay();
    //console.log(newBeforeDisplay);

    var beforeRow = blanks_4 + 
                    'BEFORE ROW' + '\n' + blanks_8 +
                    'LET l_ac=ARR_CURR()' + '\n';
    
    var onActionArr = [];
    var newGroupArr = [];

    var onAction = 'ON ACTION';
    var g_action = 'LET g_action=';
    var exitDisplay = 'EXIT DISPLAY';
    var acceptDisplay = 'ACCEPT DISPLAY';
    menuHotKeys.sort();//先按字母排序
    menuHotKeys.sort(orderHotKeys);//再按first,previous,jump,next,last

    for(var i=0; i<menuCommands.length; i++){
        var oneAction = blanks_4 +  'ON ACTION' + blanks_1 + menuCommands[i].replace(/"/g,'') + '\n';
        
        if(menuCommands[i]==='detail'){//ON ACTION controln LET l_ac=1
            oneAction = oneAction + blanks_8 + 'LET l_ac=1 \n';
        }
        if(menuCommands[i]==='close'){//ON ACTION close LET INT_FLAG=0
            oneAction = oneAction + blanks_8 + 'LET INT_FLAG=0 \n';
        }
        if(menuCommands[i]!=='about'){//其他一般的ON ACTION
            oneAction = oneAction + blanks_8 +
                'LET g_action=' + '"' +  ( menuCommands[i]!=='close'? menuCommands[i]:'exit' ) + '"' + '\n' + blanks_8 +
                'EXIT DISPLAY' + '\n';
        } else {//ON ACTION ABOUT
            oneAction = oneAction + blanks_8 + 'CALL SHOWHELP(1)' + '\n';
        }
        onActionArr.push(oneAction);
    }

    for(var i=0; i<menuHotKeys.length; i++){
        var oneAction = blanks_4 +  'ON ACTION' + blanks_1 + menuHotKeys[i].replace(/"/g,'') + '\n';
        oneAction = oneAction + blanks_8 +
                'LET g_action=' + '"' +  menuHotKeys[i] + '"' + '\n' + blanks_8 +
                'EXIT DISPLAY' + '\n';
        onActionArr.push(oneAction);
    }

    //console.log(menuHotKeys);
    // for(var i=0; i<menuHotKeys.length; i++){
    //     var action = blanks_4 + 'ON ACTION' + blanks_1 + menuHotKeys[i].replace(/"/g,'') + '\n';

    //     if(menuHotKeys[i]==='jump'){
    //         action = action + blanks_8 + 'CALL ' + fileCode + '_fetch("/")' + '\n' ;
    //     }
    //     if(menuHotKeys[i]==='first'){
    //         action = action + blanks_8 + 'CALL ' + fileCode + '_fetch("F")' + '\n' ;
    //     }
    //     if(menuHotKeys[i]==='last'){
    //         action = action + blanks_8 + 'CALL ' + fileCode + '_fetch("L")' + '\n' ;
    //     }
    //     if(menuHotKeys[i]==='controlg'){
    //         action = action + blanks_8 + 'CALL cl_cmdask()'
    //     }
    //     if(menuHotKeys[i]!=='controlg'){
    //         action = action + blanks_8 + 'ACCEPT DISPLAY' + '\n';
    //     }
    //     onActionArr.push(action);
    // }
    onActionArr.push('請把hot-key放在controlg上');
    var onActions = onActionArr.join('\n');

    var displayIDLE = '\n' + blanks_4 + 'ON IDLE g_idle' + '\n' + blanks_8 +
                      'CALL cl_on_idle()' + '\n' + blanks_8 +
                      'CONTINUE DISPLAY' + '\n';

    var afterDisplay = blanks_4 + 'AFTER DISPLAY' + '\n' + blanks_8 + 'CONTINUE DISPLAY' + '\n';
    var endDisplay = blanks_4 + 'END DISPLAY' + '\n' + blanks_4 + 'CALL cl_set_act_visible("accept,cancel", TRUE)'

    newGroupArr.push('FUNCTION '+fileCode+'_bp(p_ud)');
    newGroupArr.push(newCode);
    newGroupArr.push(g_s_record);
    if(hasHideOption === true){
        newGroupArr.push(newBeforeDisplay);
    }
    newGroupArr.push(beforeRow);
    newGroupArr.push(onActions);
    newGroupArr.push(displayIDLE);
    newGroupArr.push(afterDisplay);
    newGroupArr.push(endDisplay);
    newGroupArr.push('END FUNCTION');

    a_group = newGroupArr.join('\n');
    //console.log(a_group);
    return a_group;
}

function orderHotKeys(a,b){  
    if(a=='first'){
        return -1;
    }
    if(a=='jump'&&(b=='next'||b=='last')){
        return -1;
    }
    if(a=='jump'&&(b=='first'||b=='previous')){
        return 1;
    }
    if(a=='last'){
        return 1;
    }
    if(a=='next'&&(b=='first'||b=='previous'||b=='jump')){
        return 1;
    }
}

