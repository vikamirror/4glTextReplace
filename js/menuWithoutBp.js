var menuWtihoutBp = function(a_group){
    var menuHotKeyActions = {
        actionNext: '',
        actionPrevious: '',
        actionJump: '',
        actionFirst: '',
        actionLast: '',
    }

    var groupByCommand = a_group.split('COMMAND');

    //因為不知道END MENU END FUNCTION在哪個COMMAND,於是先清空,迴圈跑完再補上
    if(groupByCommand[groupByCommand.length-1].match(/END MENU\nEND FUNCTION/g) !== null){
        groupByCommand[groupByCommand.length-1] = groupByCommand[groupByCommand.length-1].replace(/END MENU\nEND FUNCTION/g,'');
    }
    //console.log(groupByCommand.join('\n'));
    var newMenu = [];
    for(var i=0; i<groupByCommand.length; i++){
       if(groupByCommand[i].match(/KEY\(F3\)/g) !== null){//熱鍵f3 忽略
           continue;
       }
       if(groupByCommand[i].match(/KEY\(F4\)/g) !== null){//熱鍵f4 忽略
            continue;
       }
       if(groupByCommand[i].match(/KEY\(INTERRUPT\)/g) !== null){//INTERRUPT 忽略
            continue;
       }
       if(groupByCommand[i].match(/MENU\s('|"){2}/g) !== null){//如果有MENU ""
            var head;
            var beforeMenu = '';
            head = groupByCommand[i];
            newMenu.push(head);
            continue;
        }
       if(groupByCommand[i].match(/('|")Q.\W+HELP\s\d+/g) !== null){//query
            var onAction_query = 'ON ACTION query' + '\n' +
                    blanks_12 + 'LET g_action="query"\n';
            var query = blanks_4 + groupByCommand[i].replace(/('|")Q.\W+HELP\s\d+/g, onAction_query);
            newMenu.push(query);
            continue;
       }
       if(groupByCommand[i].match(/('|")B.\W+HELP\s\d+/g) !== null){//detail
            var onAction_detail = 'ON ACTION detail' + '\n' +
                    blanks_12 + 'LET g_action="detail"\n';
            var detail = blanks_4 + groupByCommand[i].replace(/('|")B.\W+HELP\s\d+/g, onAction_detail);
            detail = detail.replace(/END IF/g, 'ELSE LET g_action="" END IF');
            newMenu.push(detail);
            var exporttoexcel = blanks_6 + 'ON ACTION exporttoexcel\n' +
                                blanks_8 + 'LET g_action="exporttoexcel"\n' + 
                                blanks_8 + "IF cl_prichk('O') THEN\n" +
                                blanks_12 + '#CALL cl_export_to_excel(ui.Interface.getRootNode(),base.TypeInfo.create(g_fac),"","")\n' +
                                blanks_8 + 'END IF\n';
            newMenu.push(exporttoexcel);
            continue;
       }
       if(groupByCommand[i].match(/('|")A.\W+HELP\s\d+/g) !== null){//add
            var onAction_add = 'ON ACTION add' + '\n' +
                    blanks_12 + 'LET g_action="add"\n';
            var add = blanks_4 + groupByCommand[i].replace(/('|")A.\W+HELP\s\d+/g, onAction_add);
            newMenu.push(add);
            continue;
       }
       if(groupByCommand[i].match(/('|")U.\W+HELP\s\d+/g) !== null){//modify
            var onAction_modify = 'ON ACTION modify' + '\n' +
                    blanks_12 + 'LET g_action="modify"\n';
            var modify = blanks_4 + groupByCommand[i].replace(/('|")U.\W+HELP\s\d+/g, onAction_modify);
            newMenu.push(modify);
            continue;
       }
       if(groupByCommand[i].match(/('|")C.\W+HELP\s\d+/g) !== null){//reproduce
            var onAction_reproduce = 'ON ACTION reproduce' + '\n' +
                    blanks_12 + 'LET g_action="reproduce"\n';
            var reproduce = blanks_4 + groupByCommand[i].replace(/('|")C.\W+HELP\s\d+/g, onAction_reproduce);
            newMenu.push(reproduce);
            continue;
       }
       if(groupByCommand[i].match(/('|")R.\W+HELP\s\d+/g) !== null){//remove
            var onAction_remove = 'ON ACTION remove' + '\n' +
                    blanks_12 + 'LET g_action="remove"\n';
            var remove = blanks_4 + groupByCommand[i].replace(/('|")R.\W+HELP\s\d+/g, onAction_remove);
            newMenu.push(remove);
            continue;
       }
       if(groupByCommand[i].match(/('|")O.\W+HELP\s\d+/g) !== null){//output
            var onAction_output = 'ON ACTION output' + '\n' +
                    blanks_12 + 'LET g_action="output"\n';
            var output = blanks_4 + groupByCommand[i].replace(/('|")O.\W+HELP\s\d+/g, onAction_output);
            newMenu.push(output);
            continue;
       }
       if(groupByCommand[i].match(/('|")H.\W+HELP\s\d+/g) !== null){//about
            var onAction_about = 'ON ACTION about' + '\n' +
                    blanks_12 + 'LET g_action="about"\n';
            var about = blanks_4 + groupByCommand[i].replace(/('|")H.\W+HELP\s\d+/g, onAction_about);
            newMenu.push(about);
            continue;
       }
       if(groupByCommand[i].match(/('|")Esc.\S+('|")/g) !== null){//exit
            var onAction_exit = 'ON ACTION exit\n' +
                blanks_12 + 'LET g_action="exit"\n' + blanks_8;
            var exit = blanks_4 + groupByCommand[i].replace(/('|")Esc.\S+('|")/g, onAction_exit);
            newMenu.push(exit);
            continue;
        }
        if(groupByCommand[i].match(/KEY\(esc\)/g) !== null){//KEY(esc) close
            var onAction_close = 'ON ACTION close' + '\n' +
                blanks_12 + 'LET g_action="exit"\n' + blanks_8;
            var close = blanks_4 + groupByCommand[i].replace(/KEY\(esc\)/g, onAction_close);
            newMenu.push(close);
            continue;
        }
        if(groupByCommand[i].toUpperCase().match(/KEY\(CONTROL\-N\)/g) !== null){//controln
            var onAction_controln = 'ON ACTION controln\n'+
                blanks_12 + 'LET g_action="controln"\n' + blanks_8;
            var callAskKey = (has_b_askkey ? '' : '#' ) + ('CALL '+ fileCode + '_b_askkey()');//是否有Function xxx_b_askkey()
            var controln = blanks_4 + groupByCommand[i].toUpperCase().replace(/KEY\(CONTROL\-N\)/g, onAction_controln);
            controln = controln.replace(/CALL\s+[\w]+_BP\(\S+\)/g, callAskKey);
            newMenu.push(controln);
            continue;
        }
        if(groupByCommand[i].match(/('|")N.\W+HELP\s\d+/g) !== null){//next
             var onAction_next = 'ON ACTION next' + '\n' +
                    blanks_8 + 'LET g_action="next"' + '\n' + blanks_8;
             var next = blanks_4 + groupByCommand[i].replace(/('|")N.\W+HELP\s\d+/g, onAction_next);
             menuHotKeyActions.actionNext = next;
             continue;
        }
        if(groupByCommand[i].match(/('|")P.\W+HELP\s\d+/g) !== null){//previous
            var onAction_previous = 'ON ACTION previous' + '\n' +
                    blanks_8 + 'LET g_action="previous"' + '\n' + blanks_8;
            var previous = blanks_4 + groupByCommand[i].replace(/('|")P.\W+HELP\s\d+/g, onAction_previous);
            menuHotKeyActions.actionPrevious = previous;
            continue;
        }
        if(groupByCommand[i].match(/KEY\(('|")\/('|")\)/g) !== null){//jump
            var onAction_jump = 'ON ACTION jump' + '\n' +
                    blanks_8 + 'LET g_action="jump"' + '\n' + blanks_8;
            var jump = blanks_4 + groupByCommand[i].replace(/KEY\(('|")\/('|")\)/g, onAction_jump);
            menuHotKeyActions.actionJump = jump;
            continue;
        }
        if(groupByCommand[i].match(/KEY\(F\)/g) !== null){//first
            var onAction_first = 'ON ACTION first\n' +
                    blanks_8 + 'LET g_action="first"\n' + blanks_8;
            var first = blanks_4 + groupByCommand[i].replace(/KEY\(F\)/g, onAction_first);
            menuHotKeyActions.actionFirst = first;
            continue;
        }
        if(groupByCommand[i].match(/KEY\(L\)/g) !== null){//last
            var onAction_last = 'ON ACTION last\n' +
                    blanks_8 + 'LET g_action="last"\n' + blanks_8;
            var last = blanks_4 + groupByCommand[i].replace(/KEY\(L\)/g, onAction_last);
            menuHotKeyActions.actionLast = last;
            continue;
        }
        if(groupByCommand[i].toLowerCase().match(/key\(control\-g\)/g) !== null){//controlg
            var onAction_controlg = 'ON ACTION controlg\n'+
                blanks_12 + 'LET g_action="controlg"\n' + blanks_8;
            var controlg = blanks_4 + groupByCommand[i].toLowerCase().replace(/key\(control\-g\)/g, onAction_controlg);
            var controlg = controlg.replace(/call/g, 'CALL');
            newMenu.push(menuHotKeyActions.actionFirst);
            newMenu.push(menuHotKeyActions.actionPrevious);
            newMenu.push(menuHotKeyActions.actionJump);
            newMenu.push(menuHotKeyActions.actionNext);
            newMenu.push(menuHotKeyActions.actionLast);
            newMenu.push(controlg);
            continue;
        }
        if(groupByCommand[i].match(/('|")[\d\w]+\.\W+('|")/g) !== null){//其它
            var userDefined = blanks_4 + groupByCommand[i].match(/('|")[\d\w]+\.\W+('|")/g)[0];
            var trimUserDefined = userDefined.replace(/('|")/g,'');//送到ON ACTION,所以拿掉""
            var others = blanks_4 + groupByCommand[i].replace(/('|")[\d\w]+\.\W+('|")/g, 'ON ACTION '+trimUserDefined);
            newMenu.push(others);
            continue;
        }
    }
    var end = blanks_4 + 'ON IDLE g_idle\n' + 
              blanks_8 + 'CALL cl_on_idle()\n' +
              blanks_1 + 'END MENU\n' + 
              'END FUNCTION';
    newMenu.push(end);
    newMenu = newMenu.join('\n');
    //console.log(newMenu);
    return newMenu;
}
