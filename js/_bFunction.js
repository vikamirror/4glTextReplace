var _bBeforeRow = function(a_group){
    //console.log(a_group);
    var a_groupArr = a_group.split('\n');
    var defineInsert_delete = 'DEFINE\n' + 
                              blanks_4 + 'l_allow_insert' + blanks_8 + 'SMALLINT,\n' + 
                              blanks_4 + 'l_allow_delete' + blanks_8 + 'SMALLINT,';
    var clean_g_ction = '\n' + blanks_4 + 'LET g_action=""\n';

    var normalAttribute = 'ATTRIBUTE(COUNT=程式變數, MAXCOUNT=程式變數的個數, UNBUFFERED,\n' + blanks_8 + 
                          'INSERT ROW=TRUE, DELETE ROW=TRUE, APPEND ROW=TRUE)\n' + blanks_4 + 
                          'BEFORE ROW';

    var hasAuthorityCheckAttribute = 'ATTRIBUTE(COUNT=程式變數, MAXCOUNT=程式變數的個數, UNBUFFERED,\n' + blanks_8 + 
                                     'INSERT ROW=l_allow_insert, DELETE ROW=l_allow_delete, APPEND ROW=l_allow_insert)\n' + blanks_4 + 
                                     'BEFORE ROW';

    var newGroupArr = [];
    var _bpVariables = {
        startDefine: false,
        hasAuthorityCheck: false,
    }
    for(var i=0; i<a_groupArr.length; i++){
        if(a_groupArr[i].match(/DEFINE/g) !== null){
            a_groupArr[i] = a_groupArr[i].replace(/DEFINE/g,defineInsert_delete);
            newGroupArr.push(a_groupArr[i]);
            _bpVariables.startDefine = true;
            continue;
        }
        if(_bpVariables.startDefine === true){
            if(a_groupArr[i].match(/\w+\s+[\w\(\)\s\.]+,/g) === null){//最後一個define, 沒有逗號]);
                a_groupArr[i] = a_groupArr[i] + clean_g_ction;
                newGroupArr.push(a_groupArr[i]);
                _bpVariables.startDefine = false;
            }else{
                newGroupArr.push(a_groupArr[i]);
            }
            continue;
        }
        if(a_groupArr[i].match(/cl_prichk\(('|")A('|")\)/g) !== null){//IF NOT cl_prichk('A') THEN
            var allowInsertDeleteTrue = blanks_4 + 'LET l_allow_insert = TRUE\n' +
                                        blanks_4 + 'LET l_allow_delete = TRUE\n';
            a_groupArr[i] = a_groupArr[i].replace(a_groupArr[i], allowInsertDeleteTrue + a_groupArr[i]);
            newGroupArr.push(a_groupArr[i]);
            _bpVariables.hasAuthorityCheck = true;
            continue;
        }
        if(a_groupArr[i].match(/OPTIONS\s+INSERT\s+KEY/g) !== null){//#OPTIONS INSERT KEY F13
            a_groupArr[i] = a_groupArr[i].replace(a_groupArr[i], '#' + a_groupArr[i]);
            newGroupArr.push(a_groupArr[i]);
            continue;
        }
        if(a_groupArr[i].match(/LET\s+l_insert[\s\=]+("|')N("|')/g) !== null){//LET l_allow_insert = FALSE
            var allowInsertFalse = '\n' + blanks_8 + 'LET l_allow_insert = FALSE';
            a_groupArr[i] = a_groupArr[i].replace(a_groupArr[i], a_groupArr[i] + allowInsertFalse);
            newGroupArr.push(a_groupArr[i]);
            continue;
        }
        if(a_groupArr[i].match(/OPTIONS\s+DELETE\s+KEY/g) !== null){//#OPTIONS DELETE KEY F13
            a_groupArr[i] = a_groupArr[i].replace(a_groupArr[i], '#' + a_groupArr[i]);
            newGroupArr.push(a_groupArr[i]);
            continue;
        }
        if(a_groupArr[i].match(/LET\s+l_update[\s\=]+("|')N("|')/g) !== null){//LET l_allow_delete = FALSE
            var allowDeleteFalse = '\n' + blanks_8 + 'LET l_allow_delete = FALSE';
            a_groupArr[i] = a_groupArr[i].replace(a_groupArr[i], a_groupArr[i] + allowDeleteFalse);
            newGroupArr.push(a_groupArr[i]);
            continue;
        }
        if(a_groupArr[i].match(/LET\s+g_\w+_pageno[\s\=]+1/g) !== null){//註解 LET g_pje_pageno = 1
            a_groupArr[i] = a_groupArr[i].replace(/LET\s+g_\w+_pageno[\s\=]+1/, '#'+a_groupArr[i]);
            newGroupArr.push(a_groupArr[i]);
            continue;
        }
        if(a_groupArr[i].match(/HELP \d+/g) !== null){
            a_groupArr[i] = '#' + a_groupArr[i];
            newGroupArr.push(a_groupArr[i]);
            continue;
        }
        if(a_groupArr[i].match(/BEFORE ROW/g) !== null){
            if(_bpVariables.hasAuthorityCheck === false){
                a_groupArr[i] = a_groupArr[i].replace(/BEFORE ROW/g,normalAttribute);
            }else{
                a_groupArr[i] = a_groupArr[i].replace(/BEFORE ROW/g,hasAuthorityCheckAttribute);
            }
            newGroupArr.push(a_groupArr[i]);
            continue;
        }
        newGroupArr.push(a_groupArr[i]);
    }
    a_group = newGroupArr.join('\n');
    //console.log(a_group);
    return a_group;
}