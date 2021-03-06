function form2Json(str) {
    "use strict";
    var obj, i, pt, keys, j, ev;
    str = '{"' + (str.indexOf('%') !== -1 ? decodeURI(str) : str) + '"}';
    obj = str.replace(/\=/g, '":"').replace(/&/g, '","').replace(/\[/g, '":{"');
    obj = JSON.parse(obj.replace(/\](.+?)(,|$)/g, function($1, $2, $3) {
        return form2Json.br($2 + '}' + $3);
    }));
    pt = ('&' + str).replace(/(\[|\]|\=)/g, '"$1"').replace(/\]"+/g, ']').replace(/&([^\[\=]+?)(\[|\=)/g, '"&["$1]$2');
    pt = (pt + '"').replace(/^"&/, '').split('&');
    for (i = 0; i < pt.length; i++) {
        ev = obj;
        keys = pt[i].match(/(?!:(\["))([^"]+?)(?=("\]))/g);
        for (j = 0; j < keys.length; j++) {
            if (!ev.hasOwnProperty(keys[j])) {
                if (keys.length > (j + 1)) {
                    ev[keys[j]] = {};
                }
                else {
                    ev[keys[j]] = pt[i].split('=')[1].replace(/"/g, '');
                    break;
                }
            }
            ev = ev[keys[j]];
        }
    }
    for(var key in obj) {
        obj[key] = decodeURIComponent(obj[key]);
    }
    return obj;
}

form2Json.br = function(repl) {
    if (repl.indexOf(']') !== -1) {
        return repl.replace(/\](.+?)(,|$)/g, function($1, $2, $3) {
            return form2Json.br($2 + '}' + $3);
        });
    }
    return repl;
};

module.exports = exports = form2Json;
