const path = require('path'),fs = require("fs")

function fromDir(startPath, filter, callback) {

    //console.log('Starting from dir '+startPath+'/');

    if (!fs.existsSync(startPath)) {
        console.log("no dir ", startPath);
        return;
    }

    var files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
        var filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            fromDir(filename, filter, callback); //recurse
        } else if (filter.test(filename)) callback(filename);
    };
};

function replaceDependency(filepath){
    var content = fs.readFileSync(filepath,"utf8");
    content = content.replace(/'com\.android\.tools\.build:gradle:3\.4\.[0-9]+'/,"'com.android.tools.build:gradle:3.4.+'")
    fs.writeFileSync(filepath,content);
}


module.exports = context => {

  const projectRoot = context.opts.projectRoot;

  fromDir(projectRoot,/\.gradle/,replaceDependency)
}