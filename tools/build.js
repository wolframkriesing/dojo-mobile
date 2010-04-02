// The arguments to this file shall be the features that this build shall contain.
// E.g. call like this:
//		jsc build.js -- Android oo-declare,oo-mixin,fx
// And the files for "oo" and "fx" will be returned.
var target = arguments[0];
// Split the params and split the sub modules too (like "oo-mixin" => ["oo", "mixin"])
var features = arguments[1] ? arguments[1].split(",") : [];

// We store some global information here, so we dont need to pass them around.
var globals = {
	profileData:null,
	dependencyData:{}, // Indexed by the directory where the __deps__.js file was loaded from, so we dont load them multiple times.
};

function _callback(data){
	globals.profileData = data;
	var allFiles = [];
	if (features.length==0){ // If no features are given, build the kitchensink, means all features included.
		for (var key in data){
			features.push(key);
		}
	}
	for (var i=0, l=features.length, f, ret; i<l; i++){
		allFiles = allFiles.concat(resolveFeature(features[i]));
	}
	// Remove doubles but never the first occurence, since this would break the file order dependencies.
	var allFiles = allFiles.map(function(item, index){ return (allFiles.slice(0, index).indexOf(item)!=-1) ? null : item; })
							.filter(function(item){ return item==null ? false : true });
	print(allFiles.join(" "));
}

function resolveFeature(feature){
	var parts = feature.split("-");
	var ns = parts[0]; // The namespace of the feature, like "oo" in "oo" or "oo-declare or "oo-extend".
	var f = parts.length>1 ? parts[1] : null; // The exact feature if given, like for "oo-declare".
	var ret = [];
	var data = globals.profileData;
	if (f===null){
		// If the feature is only "oo" then we use ALL files given inside "oo".
		ret = data[ns];
		for (var k in ret){
			resolveDeps(ret[k], function(files){
				ret = ret.concat(files);
			});
		}
	} else {
		// A features like "oo-declare" means we only want the features inside "oo"
		// where the file is "*declare.*", if given of course.
		for (var j=0, l=data[ns].length, file; j<l; j++){
			file = data[ns][j];
			if (file.indexOf(f)!=-1){
				ret.push(file);
				resolveDeps(file, function(files){
					ret = ret.concat(files);
				});
			}
		}
	}
	return ret;
}

var _depsDataStack = [];
function resolveDeps(file, onSuccess){
	var parts = file.split("/");
	var dir = parts[0];
	var f = parts[1];
	_depsDataStack.push({directory:dir, file:f, onSuccess:onSuccess});
	if (typeof globals.dependencyData[dir]!="undefined"){
		_depsCallback(globals.dependencyData[dir]);
	} else {
		// Call the onSuccess when done using the files found as parameters.
		try{
			load("../src/" + dir + "/__deps__.js");
		}catch(e){
			// The file may not exist, so skip it.
			//print(e);
		}
	}
}

function _depsCallback(data){
	var depsData = _depsDataStack.pop();
	var dir = depsData.directory;
	var file = depsData.file;
	globals.dependencyData[dir] = data;

	var ret = [];
	if (typeof data[file]!="undefined"){
		// Let's loop through the features required by the deps and resolve them.
		for (var i=0, l=data[file].length, feature; i<l; i++){
			feature = data[file][i];
			ret = ret.concat(resolveFeature(feature));
		}
	}
	depsData.onSuccess(ret);
}


if (typeof console=="undefined"){
	console = {
		log:function(){
			print([].join.call(arguments, " "));
		}
	}
}

try{
	load(target);
}catch(e){
	print(e);
}
