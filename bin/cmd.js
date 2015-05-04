#!/usr/bin/env node
/// <reference path="typings/node/node.d.ts"/>
var glob = require('glob');
var child_process = require('child_process');
var args = process.argv;

if (args.length <= 3) {
	console.log('Usage: exec-glob <command> <glob> [<parameter string>]');
	return 1;
}

var command = args[2];
var glob_param = args[3];

glob_param = (glob_param+'').replace(/\\/gm, "/");

glob(glob_param, {}, function(e, files) {
	if (args.length > 4) {
		var custom = args[4];
		for (var i in files) {
			var special_segment = custom.match(/filename.replace.*;/);
			if (special_segment == null) {
				console.log('no javascript manipulations detected, doing simple string replace')
				files[i] = custom.replace(/filename/g, "'"+files[i]+"'");
			} else {
				var new_segment = eval(special_segment[0].replace(/filename/g, "'"+files[i]+"'"));
				files[i] = custom.replace(special_segment[0], new_segment).replace(/filename/g, files[i]);
			}
		}
	}
	for (var i in files) {
		var full_command = command + ' ' + files[i];
		console.log(child_process.execSync(full_command)+'');
	}
});