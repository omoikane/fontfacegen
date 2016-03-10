'use strict';

var which = require('which').sync;
var execSync = require('child_process').execSync;
var weightTable = require('./weight.js');

var fontForgeCommand = which('fontforge')

function FontForgeException(e, cmd) {
   this.message = 'FontForge command failed: ' + e.toString() + '\n' +
      'From command: ' + cmd;
   this.name = "FontForgeException";
}

function fontforge(source, script, target, name) {

    var cmd = fontForgeCommand + ' -lang=ff -c \'' + script + '\' \'' + source + '\'';

    if (target !== undefined) {
      cmd += ' \'' + target + '\'';
    }

    if (name !== undefined) {
      cmd += ' \'' + name + '\'';
    }

    cmd += ' 2> /dev/null'

    var result;

    try {
        result = execSync(cmd).toString();
    } catch (e) {
        throw new FontForgeException(e, cmd)
    }

    return result;
}

function getName(source) {
    var result = fontforge(source, 'Open($1);Print($fontname);');
    if (result) {
        return result.trim().replace(' ', '_');
    }
    return false;
}

function getWeight(source) {
    var result = fontforge(source, 'Open($1);Print($weight);');
    if (result) {
        var weight = result.trim().replace(' ', '').toLowerCase();
        if (weightTable[weight])
            return weightTable[weight];
        return weight;
    }
    return false;
}

function getStyle(source) {
    var result = fontforge(source, 'Open($1);Print($italicangle);');
    if (result) {
        return (parseInt(result.trim()) === 0) ? 'normal' : 'italic';
    }
    return false;
}

module.exports = fontforge;
module.exports.getName = getName;
module.exports.getStyle = getStyle;
module.exports.getWeight = getWeight;