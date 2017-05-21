function menuWtihoutBp(a_group){
    var menuHotKeyActions = {
        actionNext: '',
        actionPrevious: '',
        actionJump: '',
        actionFirst: '',
        actionLast: '',
    }
    var closeCursor = '';
    var groupByCommand = a_group.split('COMMAND');

    //因為不知道END MENU END FUNCTION在哪個COMMAND,於是先清空,迴圈跑完再補上
    if(groupByCommand[groupByCommand.length-1].match(END_MENU) !== null && groupByCommand[groupByCommand.length-1].match(END_FUNCTION) !== null){
        groupByCommand[groupByCommand.length-1] = groupByCommand[groupByCommand.length-1].replace(END_MENU,'');
        groupByCommand[groupByCommand.length-1] = groupByCommand[groupByCommand.length-1].replace(END_FUNCTION,'');
    }
    //如果有CLOSE xxx_cs,先擷取出來
    if(groupByCommand[groupByCommand.length-1].match(CLOSE_CURSER) !== null){
        closeCursor = groupByCommand[groupByCommand.length-1].match(CLOSE_CURSER)[0];
        groupByCommand[groupByCommand.length-1] = groupByCommand[groupByCommand.length-1].replace(CLOSE_CURSER,'');
    }
    //console.log(groupByCommand.join('\n'));
    var newMenu = [];
    for(var i=0; i<groupByCommand.length; i++){
       if(groupByCommand[i].match(KEY_F3) !== null){//熱鍵f3 忽略
           continue;
       }
       if(groupByCommand[i].match(KEY_F4) !== null){//熱鍵f4 忽略
            continue;
       }
       if(groupByCommand[i].match(KEY_INTERRUPT) !== null){//INTERRUPT 忽略
            continue;
       }
       if(groupByCommand[i].match(MENU_QUOTATION_MARK) !== null){//如果有MENU ""
            var head;
            var beforeMenu = '';
            head = groupByCommand[i];
            newMenu.push(head);
            continue;
        }
       if(groupByCommand[i].match(QUERY_HELP) !== null){//query
            var onAction_query = 'ON ACTION query' + '\n' +
                    blanks_12 + 'LET g_action="query"\n';
            var query = blanks_4 + groupByCommand[i].replace(QUERY_HELP, onAction_query);
            newMenu.push(query);
            continue;
       }
       if(groupByCommand[i].match(DETAIL_HELP) !== null){//detail
            var onAction_detail = 'ON ACTION detail' + '\n' +
                    blanks_12 + 'LET g_action="detail"\n';
            var detail = blanks_4 + groupByCommand[i].replace(DETAIL_HELP, onAction_detail);
            detail = detail.replace(END_IF, 'ELSE LET g_action="" END IF');
            newMenu.push(detail);
            continue;
       }
       if(groupByCommand[i].match(ADD_HELP) !== null){//add
            var onAction_add = 'ON ACTION add' + '\n' +
                    blanks_12 + 'LET g_action="add"\n';
            var add = blanks_4 + groupByCommand[i].replace(ADD_HELP, onAction_add);
            newMenu.push(add);
            continue;
       }
       if(groupByCommand[i].match(MODIFY_HELP) !== null){//modify
            var onAction_modify = 'ON ACTION modify' + '\n' +
                    blanks_12 + 'LET g_action="modify"\n';
            var modify = blanks_4 + groupByCommand[i].replace(MODIFY_HELP, onAction_modify);
            newMenu.push(modify);
            continue;
       }
       if(groupByCommand[i].match(REPRODUCE_HELP) !== null){//reproduce
            var onAction_reproduce = 'ON ACTION reproduce' + '\n' +
                    blanks_12 + 'LET g_action="reproduce"\n';
            var reproduce = blanks_4 + groupByCommand[i].replace(REPRODUCE_HELP, onAction_reproduce);
            newMenu.push(reproduce);
            continue;
       }
       if(groupByCommand[i].match(REMOVE_HELP) !== null){//remove
            var onAction_remove = 'ON ACTION remove' + '\n' +
                    blanks_12 + 'LET g_action="remove"\n';
            var remove = blanks_4 + groupByCommand[i].replace(REMOVE_HELP, onAction_remove);
            newMenu.push(remove);
            continue;
       }
       if(groupByCommand[i].match(OUTPUT) !== null){//output
            var onAction_output = 'ON ACTION output' + '\n' +
                    blanks_12 + 'LET g_action="output"\n';
            var output = cleanHelp(groupByCommand[i]);
            output = blanks_4 + output.replace(OUTPUT, onAction_output);
            newMenu.push(output);
            continue;
       }
       if(groupByCommand[i].match(ABOUT_HELP) !== null){//about
            var onAction_about = 'ON ACTION about' + '\n' +
                    blanks_12 + 'LET g_action="about"\n';
            var about = blanks_4 + groupByCommand[i].replace(ABOUT_HELP, onAction_about);
            newMenu.push(about);
            continue;
       }
       if(groupByCommand[i].match(ESC) !== null){//exit
            if(exportToExcelJudgment.shallAddExportToExcel === true && exportToExcelJudgment.alreadyHasExportToExcel === false){//在exit上方判斷是否加上exportToExcel
                var exporttoexcel = blanks_6 + 'ON ACTION exporttoexcel\n' +
                                blanks_8 + 'LET g_action="exporttoexcel"\n' + 
                                blanks_8 + "IF cl_prichk('O') THEN\n" +
                                blanks_12 + '#CALL cl_export_to_excel(ui.Interface.getRootNode(),base.TypeInfo.create(g_fac),"","")\n' +
                                blanks_8 + 'END IF\n';
                newMenu.push(exporttoexcel);
                exportToExcelJudgment.alreadyHasExportToExcel = true;
            }
            var onAction_exit = 'ON ACTION exit\n' +
                blanks_12 + 'LET g_action="exit"\n' + blanks_8;
            var exit = blanks_4 + groupByCommand[i].replace(ESC, onAction_exit);
            newMenu.push(exit);
            continue;
        }
        if(groupByCommand[i].match(KEY_ESC) !== null){//KEY(esc) close
            var onAction_close = 'ON ACTION close' + '\n' +
                blanks_12 + 'LET g_action="exit"\n' + blanks_8;
            var close = blanks_4 + groupByCommand[i].replace(KEY_ESC, onAction_close);
            newMenu.push(close);
            continue;
        }
        if(groupByCommand[i].toUpperCase().match(KEY_CONTROL_N) !== null){//controln
            var onAction_controln = 'ON ACTION controln\n'+
                blanks_12 + 'LET g_action="controln"\n' + blanks_8;
            var callAskKey = (has_b_askkey ? '' : '#' ) + ('CALL '+ fileCode + '_b_askkey()');//是否有Function xxx_b_askkey()
            var controln = blanks_4 + groupByCommand[i].toUpperCase().replace(KEY_CONTROL_N, onAction_controln);
            controln = controln.replace(/CALL\s+[\w]+_BP\(\S+\)/g, callAskKey);
            newMenu.push(controln);
            continue;
        }
        if(groupByCommand[i].match(NEXT_HELP) !== null){//next
             var onAction_next = 'ON ACTION next' + '\n' +
                    blanks_8 + 'LET g_action="next"' + '\n' + blanks_8;
             var next = blanks_4 + groupByCommand[i].replace(NEXT_HELP, onAction_next);
             menuHotKeyActions.actionNext = next;
             continue;
        }
        if(groupByCommand[i].match(PREVIOUS_HELP) !== null){//previous
            var onAction_previous = 'ON ACTION previous' + '\n' +
                    blanks_8 + 'LET g_action="previous"' + '\n' + blanks_8;
            var previous = blanks_4 + groupByCommand[i].replace(PREVIOUS_HELP, onAction_previous);
            menuHotKeyActions.actionPrevious = previous;
            continue;
        }
        if(groupByCommand[i].match(KEY_JUMP) !== null){//jump
            var onAction_jump = 'ON ACTION jump' + '\n' +
                    blanks_8 + 'LET g_action="jump"' + '\n' + blanks_8;
            var jump = blanks_4 + groupByCommand[i].replace(KEY_JUMP, onAction_jump);
            menuHotKeyActions.actionJump = jump;
            continue;
        }
        if(groupByCommand[i].match(KEY_FIRST) !== null){//first
            var onAction_first = 'ON ACTION first\n' +
                    blanks_8 + 'LET g_action="first"\n' + blanks_8;
            var first = blanks_4 + groupByCommand[i].replace(KEY_FIRST, onAction_first);
            menuHotKeyActions.actionFirst = first;
            continue;
        }
        if(groupByCommand[i].match(KEY_LAST) !== null){//last
            var onAction_last = 'ON ACTION last\n' +
                    blanks_8 + 'LET g_action="last"\n' + blanks_8;
            var last = blanks_4 + groupByCommand[i].replace(KEY_LAST, onAction_last);
            menuHotKeyActions.actionLast = last;
            continue;
        }
        if(groupByCommand[i].toLowerCase().match(KEY_CONTROL_G) !== null){//controlg
            var onAction_controlg = 'ON ACTION controlg\n'+
                blanks_12 + 'LET g_action="controlg"\n' + blanks_8;
            var controlg = blanks_4 + groupByCommand[i].toLowerCase().replace(KEY_CONTROL_G, onAction_controlg);
            var controlg = controlg.replace(/call/g, 'CALL');
            newMenu.push(menuHotKeyActions.actionFirst);
            newMenu.push(menuHotKeyActions.actionPrevious);
            newMenu.push(menuHotKeyActions.actionJump);
            newMenu.push(menuHotKeyActions.actionNext);
            newMenu.push(menuHotKeyActions.actionLast);
            newMenu.push(controlg);
            continue;
        }
        if(groupByCommand[i].match(USER_DEFINED) !== null){//其它
            var userDefined = blanks_4 + groupByCommand[i].match(USER_DEFINED)[0];
            var trimUserDefined = clearQuotation(userDefined);//送到ON ACTION,所以拿掉""
            var others = blanks_4 + groupByCommand[i].replace(USER_DEFINED, 'ON ACTION '+trimUserDefined);
            newMenu.push(others);
            continue;
        }
    }
    var end = blanks_4 + 'ON IDLE g_idle\n' + 
              blanks_8 + 'CALL cl_on_idle()\n' +
              blanks_1 + 'END MENU\n' + 
              blanks_1 + closeCursor + '\n' +
              'END FUNCTION';
    newMenu.push(end);
    newMenu = newMenu.join('\n');
    //console.log(newMenu);
    return newMenu;
}
