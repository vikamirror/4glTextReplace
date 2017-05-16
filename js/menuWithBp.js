var menuCommands = [];
var menuHotKeys = [];
var hasExitWhile = false;
var addExportToExcel = false;
var hasHideOption = false;
var beforeMenuString = '';

var menuWtihBpFunc = function(a_group){
    //console.log(a_group);
    var groupByCommand = a_group.split('COMMAND');//用COMMAND來分組

    //因為不知道END MENU END FUNCTION在哪個COMMAND,於是先清空,迴圈跑完再補上
    if(groupByCommand[groupByCommand.length-1].match(/END MENU/g) !== null && groupByCommand[groupByCommand.length-1].match(/END FUNCTION/g) !== null){
        groupByCommand[groupByCommand.length-1] = groupByCommand[groupByCommand.length-1].replace(/END MENU/g,'');
        groupByCommand[groupByCommand.length-1] = groupByCommand[groupByCommand.length-1].replace(/END FUNCTION/g,'');
    }
    //console.log(groupByCommand.join('\n'));
    var newMenu = [];
    for(var i=0; i<groupByCommand.length; i++){
        if(groupByCommand[i].match(/MENU\s('|"){2}/g) !== null){//如果有MENU ""
            var whileTrue = 'WHILE TRUE' + '\n' + 
                            blanks_4 + 'CALL ' + fileCode + '_bp("G")' + '\n' + 
                            blanks_4 + 'CASE g_action' + '\n';
            var head;
            var beforeMenu = '';
            if(groupByCommand[i].match(/BEFORE MENU/g) !== null){//有BEFORE MENU
                head = groupByCommand[i].split('BEFORE MENU')[0];//用BEFORE MENU切割
                beforeMenu = blanks_4 + 'BEFORE MENU\n' + groupByCommand[i].split('BEFORE MENU')[1];
                beforeMenuString = beforeMenu;
            }else{
                head = groupByCommand[i];
            }
            head = head.replace(/MENU\s('|"){2}/g, whileTrue);    
            //console.log(head);
            newMenu.push(head);
            if(beforeMenu !== ''){
                beforeMenu = commentOut(beforeMenu);
                //console.log(beforeMenu);
                newMenu.push(beforeMenu);
            }
            continue;
        }
        if(groupByCommand[i].match(/KEY\(F3\)/g) !== null){//熱鍵f3 忽略
            continue;
        }
        if(groupByCommand[i].match(/KEY\(F4\)/g) !== null){//熱鍵f4 忽略
            continue;
        }
        if(groupByCommand[i].match(/KEY\(INTERRUPT\)/g) !== null){//INTERRUPT 忽略
            continue;
        }
        if(groupByCommand[i].match(/('|")Q.\W+HELP\s\d+/g) !== null){//query
            var query = blanks_4 + groupByCommand[i].replace(/('|")Q.\W+HELP\s\d+/g, 'WHEN "query"');
            newMenu.push(query);
            menuCommands.push('query');
            continue;
        }
        if(groupByCommand[i].match(/('|")B.\W+HELP\s\d+/g) !== null){//detail
            var detail = blanks_4 + groupByCommand[i].replace(/('|")B.\W+HELP\s\d+/g, 'WHEN "detail"');
            detail = detail.replace(/END IF/g, 'ELSE LET g_action="" END IF');
            newMenu.push(detail);
            menuCommands.push('detail');
            var exporttoexcel = blanks_4 + 'WHEN "exporttoexcel"\n' +
                                blanks_8 + "IF cl_prichk('O') THEN\n" +
                                blanks_12 + '#CALL cl_export_to_excel(ui.Interface.getRootNode(),base.TypeInfo.create(g_fac),"","")\n' +
                                blanks_8 + 'END IF\n';
            newMenu.push(exporttoexcel);
            menuCommands.push('exporttoexcel');
            continue;
        }
        if(groupByCommand[i].match(/('|")A.\W+HELP\s\d+/g) !== null){//add
            var add = blanks_4 + groupByCommand[i].replace(/('|")A.\W+HELP\s\d+/g, 'WHEN "add"');
            newMenu.push(add);
            menuCommands.push('add');
            continue;
        }
        if(groupByCommand[i].match(/('|")U.\W+HELP\s\d+/g) !== null){//modify
            var modify = blanks_4 + groupByCommand[i].replace(/('|")U.\W+HELP\s\d+/g, 'WHEN "modify"');
            newMenu.push(modify);
            menuCommands.push('modify');
            continue;
        }
        if(groupByCommand[i].match(/('|")C.\W+HELP\s\d+/g) !== null){//reproduce
            var reproduce = blanks_4 + groupByCommand[i].replace(/('|")C.\W+HELP\s\d+/g, 'WHEN "reproduce"');
            newMenu.push(reproduce);
            menuCommands.push('reproduce');
            continue;
        }
        if(groupByCommand[i].match(/('|")R.\W+HELP\s\d+/g) !== null){//remove
            var remove = blanks_4 + groupByCommand[i].replace(/('|")R.\W+HELP\s\d+/g, 'WHEN "remove"');
            newMenu.push(remove);
            menuCommands.push('remove');
            continue;
        }
        if(groupByCommand[i].match(/('|")O.\W+HELP\s\d+/g) !== null){//output
            var output = blanks_4 + groupByCommand[i].replace(/('|")O.\W+HELP\s\d+/g, 'WHEN "output"');
            newMenu.push(output);
            menuCommands.push('output');
            continue;
        }
        if(groupByCommand[i].match(/('|")H.\W+HELP\s\d+/g) !== null){//about
            //var about = blanks_4 + groupByCommand[i].replace(/('|")H.\W+HELP\s\d+/g, 'WHEN "about"');
            //newMenu.push(about); 因為bp裡面已經有call showHelp了因此menu中省略
            menuCommands.push('about');
            continue;
        }
        if(groupByCommand[i].match(/('|")N.\W+HELP\s\d+/g) !== null){//next
            var next = blanks_4 + groupByCommand[i].replace(/('|")N.\W+HELP\s\d+/g, 'WHEN "next"');
            newMenu.push(next);
            menuHotKeys.push('next');
            continue;
        }
        if(groupByCommand[i].match(/('|")P.\W+HELP\s\d+/g) !== null){//previous
            var previous = blanks_4 + groupByCommand[i].replace(/('|")P.\W+HELP\s\d+/g, 'WHEN "previous"');
            newMenu.push(previous);
            menuHotKeys.push('previous');
            continue;
        }
        if(groupByCommand[i].match(/('|")Esc.\S+('|")/g) !== null){//Esc
            var exit = blanks_4 + groupByCommand[i].replace(/('|")Esc.\S+('|")/g, 'WHEN "exit"');
            exit = exit.replace(/EXIT MENU/g, 'EXIT WHILE');
            newMenu.push(exit);
            menuCommands.push('exit');
            continue;
        }
        if(groupByCommand[i].match(/('|")[\d\w]+\.\D{1,30}('|")/g) !== null){//其它
            if(groupByCommand[i].match(/HELP\s+\d+/g) !== null){
                groupByCommand[i] = groupByCommand[i].replace(/HELP\s+\d+/g,'');//如果有HELP 12345, 清除
            }
            var userDefined = blanks_4 + groupByCommand[i].match(/('|")[\d\w]+\.\D{1,30}('|")/g)[0];
            var others = blanks_4 + groupByCommand[i].replace(/('|")[\d\w]+\.\D{1,30}('|")/g, 'WHEN '+userDefined);
            newMenu.push(others);
            var trimUserDefined = userDefined.replace(/('|")/g,'');//送到ON ACTION,所以拿掉""
            menuCommands.push(trimUserDefined);
            continue;
        }
        if(groupByCommand[i].match(/KEY\(esc\)/g) !== null){//KEY(esc)
            menuCommands.push('close');
            continue;
        }
        if(groupByCommand[i].match(/KEY\(('|")\/('|")\)/g) !== null){//jump
            var jump = blanks_4 + groupByCommand[i].replace(/KEY\(('|")\/('|")\)/g, 'WHEN "jump"');
            newMenu.push(jump);
            menuHotKeys.push('jump');
            continue;
        }
        if(groupByCommand[i].match(/KEY\(F\)/g) !== null){//熱鍵first
            var first = blanks_4 + groupByCommand[i].replace(/KEY\(F\)/g, 'WHEN "first"');
            newMenu.push(first);
            menuHotKeys.push('first');
            continue;
        }
        if(groupByCommand[i].match(/KEY\(L\)/g) !== null){//熱鍵last
            var last = blanks_4 + groupByCommand[i].replace(/KEY\(L\)/g, 'WHEN "last"');
            newMenu.push(last);
            menuHotKeys.push('last');
            continue;
        }
        if(groupByCommand[i].toUpperCase().match(/KEY\(CONTROL\-N\)/g) !== null){//熱鍵controln
            var controln = blanks_4 + groupByCommand[i].toUpperCase().replace(/KEY\(CONTROL\-N\)/g, 'WHEN "controln"');
            var callAskKey = (has_b_askkey ? '' : '#' ) + ('CALL '+ fileCode + '_b_askkey()');//是否有Function xxx_b_askkey()
            if(controln.match(/CALL\s+[\w]+_BP\(\S+\)/g) !==null){
                controln = controln.replace(/CALL\s+[\w]+_BP\(\S+\)/g, callAskKey);
            }else{
                controln = controln + '\n' + blanks_8 + callAskKey;//如果controln裡面沒有call_xxx_bp("D")
            }
            newMenu.push(controln);
            menuCommands.push('controln');
            continue;
        }
        if(groupByCommand[i].toLowerCase().match(/key\(control\-g\)/g) !== null){//熱鍵controlg
            var controlg = blanks_4 + groupByCommand[i].toLowerCase().replace(/key\(control\-g\)/g, 'WHEN "controlg"');
            newMenu.push(controlg);
            menuCommands.push('controlg');
            continue;
        }
    }
    var end = blanks_4 + 'END CASE' + '\n' + blanks_1 + 'END WHILE\n' + 'END FUNCTION';
    newMenu.push(end);
    newMenu = newMenu.join('\n');
    console.log(newMenu);
    return newMenu;
}

// function isCommentOut(group,command){//COMMAND沒有註解的話,才能加入bp
//     //console.log('group',group);
//     if(group.match(/(#|{)\s{0,}COMMAND/g) === null){
//         menuCommands.push(command);
//     }
// }

function getBeforeDisplay(){
    beforeMenuString = beforeMenuString.replace(/BEFORE MENU/g, 'BEFORE DISPLAY');
    // beforeMenuString = beforeMenuString.replace(/BEFORE MENU/g, 'BEFORE DISPLAY');
    // //console.log(beforeMenuString);
    // var newBeforeDisplay = [];
    // var beforeMenuArr = beforeMenuString.split('\n');
    // for(var i=0;i<beforeMenuArr.length;i++){
    //     if(beforeMenuArr[i].match(/HIDE\s+OPTION\s+('|")\S+('|")/g) !== null){
    //         var cl_set_action = '\n' + blanks_12 + 'CALL cl_set_action(請先自行填寫,FALSE)';
    //         var markOption = '#' + beforeMenuArr[i].match(/HIDE\s+OPTION\s+('|")\S+('|")/)[0];
    //         beforeMenuArr[i] = beforeMenuArr[i].replace(/HIDE\s+OPTION\s+('|")\S+('|")/g,markOption + cl_set_action);
    //         newBeforeDisplay.push(beforeMenuArr[i]);
    //         continue;
    //     }
    //     newBeforeDisplay.push(beforeMenuArr[i]);
    // }
    // newBeforeDisplay = newBeforeDisplay.join('\n');
    //console.log(beforeMenuString);
    return beforeMenuString;
}

var _bpFunc = function(a_group){

    var a_groupArr =  a_group.split('\n');

    var g_s_record;
    if(a_group.match(/DISPLAY\s+g_\w+\[\w+\].\*\s+TO\s+s_\w+\[\w+\].\*/g) !== null){
        g_s_record = blanks_4 + '#' + a_group.match(/DISPLAY\s+g_\w+\[\w+\].\*\s+TO\s+s_\w+\[\w+\].\*/g)[0] + '\n';//抓到DISPLAY g_xxx[l_xxx].* TO s_xxx[l_xxx].*
    }else{
        g_s_record = commentOut(a_group);//應對長得很奇怪的bp()
    }
    //console.log(g_s_record);
    
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
    
    menuHotKeys.sort();//先按字母排序
    menuHotKeys.sort(orderHotKeys);//再按first,previous,jump,next,last

    var hotKeyArr = [];
    for(var i=0; i<menuHotKeys.length; i++){
        var hotKey = blanks_4 +  'ON ACTION' + blanks_1 + menuHotKeys[i].replace(/"/g,'') + '\n';
        hotKey = hotKey + blanks_8 +
                'LET g_action=' + '"' +  menuHotKeys[i] + '"' + '\n' + blanks_8 +
                'EXIT DISPLAY' + '\n';
        hotKeyArr.push(hotKey);
    }
    var hotKeys = hotKeyArr.join('\n');
    //console.log(hotKeys);
    
    var onActionArr = [];
    for(var i=0; i<menuCommands.length; i++){
        var oneAction = blanks_4 +  'ON ACTION' + blanks_1 + menuCommands[i].replace(/"/g,'') + '\n';
        
        if(menuCommands[i]==='detail'){//ON ACTION controln LET l_ac=1
            oneAction = oneAction + blanks_8 + 'LET l_ac=1 \n';
        }
        if(menuCommands[i]==='close'){//ON ACTION close LET INT_FLAG=0
            oneAction = oneAction + blanks_8 + 'LET INT_FLAG=0 \n';
        }
        if(menuCommands[i]==='controlg'){
            onActionArr.push(hotKeys);//將hot-keys放在controlg上方
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

    var onActions = onActionArr.join('\n');

    var displayIDLE = '\n' + blanks_4 + 'ON IDLE g_idle' + '\n' + blanks_8 +
                      'CALL cl_on_idle()' + '\n' + blanks_8 +
                      'CONTINUE DISPLAY' + '\n';

    var afterDisplay = blanks_4 + 'AFTER DISPLAY' + '\n' + blanks_8 + 'CONTINUE DISPLAY' + '\n';
    var endDisplay = blanks_4 + 'END DISPLAY' + '\n' + blanks_4 + 'CALL cl_set_act_visible("accept,cancel", TRUE)'

    var newBp = [];
    newBp.push('FUNCTION '+fileCode+'_bp(p_ud)');
    newBp.push(newCode);
    newBp.push(g_s_record);
    if(hasHideOption === true){
        newBp.push(newBeforeDisplay);
    }
    newBp.push(beforeRow);
    newBp.push(onActions);
    newBp.push(displayIDLE);
    newBp.push(afterDisplay);
    newBp.push(endDisplay);
    newBp.push('END FUNCTION');

    newBp = newBp.join('\n');
    //console.log(newBp);
    return newBp;
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

