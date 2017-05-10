var menuWtihoutBp = function(a_group){
    var menuGroupIdx = {
        startDetail: 0,
        startControln: 0,
        startNext: 0,
        startPrevious: 0,
        startJump: 0,
        startFirst: 0,
        startLast: 0,
    }
    var menuHotKeyActions = {
        actionNext: [],
        actionPrevious: [],
        actionJump: [],
        actionFirst: [],
        actionLast: [],
    }

    var groupArr =  a_group.split('\n');
    var newGroupArr = [];
    for(var i=0; i<groupArr.length; i++){
        if(groupArr[i].match(/COMMAND\s('|")(\d|\w+).\S+/g) !== null){     
            if(groupArr[i].match(/COMMAND\s('|")Q.\S+/g) !== null){//query
                var onAction_gAction = 'ON ACTION query' + '\n' +
                    blanks_12 + 'LET g_action="query"' + '\n' + blanks_8;
                var aline = groupArr[i].replace(/COMMAND\s('|")Q.\W+HELP\s\d+/g, onAction_gAction);
                newGroupArr.push(aline);
                continue;
            }
            if(groupArr[i].match(/COMMAND\s('|")B.\S+/g) !== null){//detail
                var onAction_gAction = 'ON ACTION detail' + '\n' +
                    blanks_12 + 'LET g_action="detail"' + '\n' + blanks_8;
                var aline = groupArr[i].replace(/COMMAND\s('|")B.\W+HELP\s\d+/g, onAction_gAction);
                newGroupArr.push(aline);
                menuGroupIdx.startDetail = i;
                addExportToExcel = true;
                continue;
            }
            if(addExportToExcel === true){
                var exporttoexcel = blanks_6 + 'ON ACTION exporttoexcel\n' +
                                    blanks_8 + 'LET g_action="exporttoexcel"\n' + 
                                    blanks_8 + "IF cl_prichk('O') THEN\n" +
                                    blanks_12 + '#CALL cl_export_to_excel(ui.Interface.getRootNode(),base.TypeInfo.create(g_fac),"","")\n' +
                                    blanks_8 + 'END IF\n';
                newGroupArr.push(exporttoexcel);
                addExportToExcel = false;
                //continue;
            }
            if(groupArr[i].match(/COMMAND\s('|")A.\S+/g) !== null){//add
                var onAction_gAction = 'ON ACTION add' + '\n' +
                    blanks_12 + 'LET g_action="add"' + '\n' + blanks_8;
                var aline = groupArr[i].replace(/COMMAND\s('|")A.\W+HELP\s\d+/g, onAction_gAction);
                newGroupArr.push(aline);
                continue;
            }
            if(groupArr[i].match(/COMMAND\s('|")U.\S+/g) !== null){//modify
                var onAction_gAction = 'ON ACTION modify' + '\n' +
                    blanks_12 + 'LET g_action="modify"' + '\n' + blanks_8;
                var aline = groupArr[i].replace(/COMMAND\s('|")U.\W+HELP\s\d+/g, onAction_gAction);
                newGroupArr.push(aline);
                continue;
            }
            if(groupArr[i].match(/COMMAND\s('|")C.\S+/g) !== null){//reproduce
                var onAction_gAction = 'ON ACTION reproduce' + '\n' +
                    blanks_12 + 'LET g_action="reproduce"' + '\n' + blanks_8;
                var aline = groupArr[i].replace(/COMMAND\s('|")C.\W+HELP\s\d+/g, onAction_gAction);
                newGroupArr.push(aline);
                continue;
            }
            if(groupArr[i].match(/COMMAND\s('|")R.\S+/g) !== null){//remove
                var onAction_gAction = 'ON ACTION remove' + '\n' +
                    blanks_12 + 'LET g_action="remove"' + '\n' + blanks_8;
                var aline = groupArr[i].replace(/COMMAND\s('|")R.\W+HELP\s\d+/g, onAction_gAction);
                newGroupArr.push(aline);
                continue;
            }
            if(groupArr[i].match(/COMMAND\s('|")O.\S+/g) !== null){//output
                var onAction_gAction = 'ON ACTION output' + '\n' +
                    blanks_12 + 'LET g_action="output"' + '\n' + blanks_8;
                var aline = groupArr[i].replace(/COMMAND\s('|")O.\W+HELP\s\d+/g, onAction_gAction);
                newGroupArr.push(aline);
                continue;
            }
            if(groupArr[i].match(/COMMAND\s('|")H.\S+/g) !== null){//about
                var onAction_gAction = 'ON ACTION about' + '\n' +
                    blanks_12 + 'LET g_action="about"' + '\n' + blanks_8;
                var aline = groupArr[i].replace(/COMMAND\s('|")H.\W+HELP\s\d+/g, onAction_gAction);
                newGroupArr.push(aline);
                continue;
            }
            if(groupArr[i].match(/COMMAND\s('|")N.\S+/g) !== null){//next
                // var onAction_gAction = 'ON ACTION next' + '\n' +
                //     blanks_8 + 'LET g_action="next"' + '\n' + blanks_8;
                // var aline = groupArr[i].replace(/COMMAND\s('|")N.\W+HELP\s\d+/g, onAction_gAction);
                menuGroupIdx.startNext = i;
                continue;
            }
            if(groupArr[i].match(/COMMAND\s('|")P.\S+/g) !== null){//previous
                // var onAction_gAction = 'ON ACTION previous' + '\n' +
                //     blanks_8 + 'LET g_action="previous"' + '\n' + blanks_8;
                // var aline = groupArr[i].replace(/COMMAND\s('|")P.\W+HELP\s\d+/g, onAction_gAction);
                menuGroupIdx.startPrevious = i;
                continue;
            }
            if(groupArr[i].match(/COMMAND\s('|")Esc.\S+/g) !== null){//esc
                var onAction_gAction = 'ON ACTION exit' + '\n' +
                    blanks_12 + 'LET g_action="exit"' + '\n' + blanks_8;
                var aline = groupArr[i].replace(/COMMAND\s('|")Esc.\S+/g, onAction_gAction);
                newGroupArr.push(aline);
                continue;
            }
            if(groupArr[i].match(/COMMAND\s('|").\S+/g) !== null){//user defined
                var userDefined = groupArr[i].match(/"[\d\w]+\.[\S]+"/g)[0];
                var onAction_gAction = 'ON ACTION ' + userDefined + '\n' +
                    blanks_12 + 'LET g_action=' + userDefined + '\n' + blanks_8;
                var aline = groupArr[i].replace(/HELP\s\d+/g,'');
                aline = aline.replace(/COMMAND\s('|").\S+/g, onAction_gAction);
                newGroupArr.push(aline);
                continue;
            }
        }
        if(groupArr[i].match(/COMMAND\sKEY/g) !== null){//熱鍵
            if(groupArr[i].match(/COMMAND\sKEY\(esc\)/g) !== null){//esc
                var aline = groupArr[i].replace(/COMMAND\sKEY\(esc\)/g, 'ON ACTION CLOSE');
                newGroupArr.push(aline);
                continue;
            }
            if(groupArr[i].match(/COMMAND\sKEY\(('|")\/('|")\)/g) !== null){//jump
                // var onAction_gAction = 'ON ACTION jump' + '\n' +
                //     blanks_8 + 'LET g_action="jump"' + '\n' + blanks_8;
                // var aline = groupArr[i].replace(/COMMAND\sKEY\(('|")\/('|")\)/g, onAction_gAction);
                menuGroupIdx.startJump = i;
                continue;
            }
            if(groupArr[i].match(/COMMAND\sKEY\(F\)/g) !== null){//first
                // var onAction_gAction = 'ON ACTION first' + '\n' +
                //     blanks_8 + 'LET g_action="first"' + '\n' + blanks_8;
                // var aline = groupArr[i].replace(/COMMAND\sKEY\(F\)/g, onAction_gAction);
                menuGroupIdx.startFirst = i;
                continue;
            }
            if(groupArr[i].match(/COMMAND\sKEY\(L\)/g) !== null){//last
                // var onAction_gAction = 'ON ACTION last' + '\n' +
                //     blanks_8 + 'LET g_action="last"' + '\n' + blanks_8;
                // var aline = groupArr[i].replace(/COMMAND\sKEY\(L\)/g, onAction_gAction);
                menuGroupIdx.startLast = i;
                continue;
            }
            if(groupArr[i].match(/COMMAND\sKEY\(F3\)/g) !== null){//F3
                var aline = '#' + groupArr[i];
                continue;
            }
            if(groupArr[i].match(/COMMAND\sKEY\(F4\)/g) !== null){//F4
                var aline = '#' + groupArr[i];
                continue;
            }
            if(groupArr[i].match(/COMMAND\sKEY\(CONTROL-N\)/g) !== null){//controlN
                var controln = groupArr[i].replace(/COMMAND\sKEY\(CONTROL-N\)/g, 'ON ACTION controln');
                // var callAskKey;
                // if(has_b_askkey === true){
                //     callAskKey = '\n' + blanks_8 + 'CALL '+ fileCode + '_b_askkey()';
                // }else{
                //     callAskKey = '\n' + blanks_8 + '#CALL '+ fileCode + '_b_askkey()';
                // }
                //controln = controln.toUpperCase().replace(/COMMAND\sKEY\(CONTROL-N\)/g, callAskKey);
                menuGroupIdx.startControln = i;
                newGroupArr.push(controln);
                continue;
            }
            if(groupArr[i].match(/COMMAND\sKEY\(CONTROL-G\)/g) !== null){//controlg
                newGroupArr.push(menuHotKeyActions.actionFirst.join('\n'));
                newGroupArr.push(menuHotKeyActions.actionPrevious.join('\n'));
                newGroupArr.push(menuHotKeyActions.actionJump.join('\n'));
                newGroupArr.push(menuHotKeyActions.actionNext.join('\n')); 
                newGroupArr.push(menuHotKeyActions.actionLast.join('\n'));
                var aline = groupArr[i].replace(/COMMAND\sKEY\(CONTROL-G\)/g, 'ON ACTION controlg');
                newGroupArr.push(aline);
                continue;
            }
            if(groupArr[i].match(/COMMAND\sKEY\(INTERRUPT\)/g) !== null){//INTERRUPT
                continue;
            }
            // if(groupArr[i].match(//g) !== null){//
            //     var aline = groupArr[i].replace(//g, 'ON ACTION ');
            //     newGroupArr.push(aline);
            //     continue;
            // }
        }
        if(menuGroupIdx.startDetail !== 0){//detail
            if(groupArr[i].match(/END IF/g) !== null){
                menuGroupIdx.startDetail = 0;
                var elseGAction = 'ELSE LET g_action="" END IF';
                groupArr[i] = groupArr[i].replace(/END IF/g,elseGAction);
            }
            newGroupArr.push(groupArr[i]);
            continue;
        }
        if(menuGroupIdx.startControln !== 0){
            if(groupArr[i].match(/\(('|")N('|")\)/g) !== null){
                var callAskKey;
                if(has_b_askkey === true){
                    callAskKey = blanks_8 + 'CALL '+ fileCode + '_b_askkey()';
                }else{
                    callAskKey = blanks_8 + '#CALL '+ fileCode + '_b_askkey()';
                }
                groupArr[i] = groupArr[i].replace(groupArr[i], callAskKey);
                newGroupArr.push(groupArr[i]);
                menuGroupIdx.startControln = 0;
            }
            continue;
        }
        if(menuGroupIdx.startNext !== 0){//把next字串組成一組
            if(groupArr[i].match(/\(('|")N('|")\)/g) !== null){
                var onAction_gAction = 'ON ACTION next' + '\n' +
                    blanks_8 + 'LET g_action="next"' + '\n' + blanks_8;
                var onActionNext = pushGroup(groupArr, menuGroupIdx.startNext, i);
                onActionNext = onActionNext.replace(/COMMAND\s('|")N.\W+HELP\s\d+/g, onAction_gAction);
                //console.log(onActionNext);
                menuHotKeyActions.actionNext.push(onActionNext);             
                menuGroupIdx.startNext = 0;
            }
            continue;
        }
        if(menuGroupIdx.startPrevious !== 0){//把previous字串組成一組
            if(groupArr[i].match(/\(('|")P('|")\)/g) !== null){
                var onAction_gAction = 'ON ACTION previous' + '\n' +
                    blanks_8 + 'LET g_action="previous"' + '\n' + blanks_8;
                var onActionPrevious = pushGroup(groupArr, menuGroupIdx.startPrevious, i);
                onActionPrevious = onActionPrevious.replace(/COMMAND\s('|")P.\W+HELP\s\d+/g, onAction_gAction);
                //console.log(onActionPrevious);
                menuHotKeyActions.actionPrevious.push(onActionPrevious);    
                menuGroupIdx.startPrevious = 0;
            }
            continue;
        }
        if(menuGroupIdx.startJump !== 0){//把jump字串組成一組
            if(groupArr[i].match(/\(('|")\/('|")\)/g) !== null){
                var onAction_gAction = 'ON ACTION jump' + '\n' +
                    blanks_8 + 'LET g_action="jump"' + '\n' + blanks_8;
                var onActionJump = pushGroup(groupArr, menuGroupIdx.startJump, i);
                onActionJump = onActionJump.replace(/COMMAND\sKEY\(('|")\/('|")\)/g, onAction_gAction);
                //console.log(onActionJump);
                menuHotKeyActions.actionJump.push(onActionJump);
                menuGroupIdx.startJump = 0;
            }
            continue;
        }
        if(menuGroupIdx.startFirst !== 0){//把first字串組成一組
            if(groupArr[i].match(/\(('|")F('|")\)/g) !== null){
                var onAction_gAction = 'ON ACTION first' + '\n' +
                    blanks_8 + 'LET g_action="first"' + '\n' + blanks_8;
                var onActionFirst = pushGroup(groupArr, menuGroupIdx.startFirst, i);
                onActionFirst = onActionFirst.replace(/COMMAND\sKEY\(F\)/g, onAction_gAction);
                //console.log(onActionFirst);
                menuHotKeyActions.actionFirst.push(onActionFirst);
                menuGroupIdx.startFirst = 0;
            }
            continue;
        }
        if(menuGroupIdx.startLast !== 0){//把last字串組成一組
            if(groupArr[i].match(/\(('|")L('|")\)/g) !== null){
                var onAction_gAction = 'ON ACTION last' + '\n' +
                    blanks_8 + 'LET g_action="last"' + '\n' + blanks_8;
                var onActionLast = pushGroup(groupArr, menuGroupIdx.startLast, i);
                onActionLast = onActionLast.replace(/COMMAND\sKEY\(L\)/g, onAction_gAction);
                //console.log(onActionLast);
                menuHotKeyActions.actionLast.push(onActionLast);
                menuGroupIdx.startLast = 0;
            }
            continue;
        }
        if(groupArr[i].match(/CALL\s\S+_bp\(('|")D('|")\)/g) !== null){//F3
            continue;
        }
        if(groupArr[i].match(/CALL\s\S+_bp\(('|")U('|")\)/g) !== null){//F3
            continue;
        }
        if(groupArr[i].match(/\s+LET\sINT_FLAG/g) !== null){//INTERRUPT
            continue;
        }
        if(groupArr[i].match(/END\sMENU/g) !== null){//ON IDLE
            var onIDLE = '\n' + blanks_8 + 'ON IDLE g_idle' + '\n' + blanks_8 + 'CALL cl_on_idle()'+ '\n';
            var aline = onIDLE + groupArr[i];
            newGroupArr.push(aline);
            continue;
        }
        newGroupArr.push(groupArr[i]);
    }
    a_group = newGroupArr.join('\n');
    //console.log(a_group);
    return a_group;
}
