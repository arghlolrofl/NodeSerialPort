var gulp = require("gulp");
var del = require("del");
var fs = require('fs');
var path = require('path');

const LIB_DESTINATION_PATH = "public/lib";

var filterNonExistingFiles = function (files, destination) {
    var fileNames = files.map(function (obj) {
        return path.basename(obj);
    });

    var exists = fileNames.map(function (obj) {
        return fs.existsSync(__dirname + destination + obj);
    });

    fileNames = [];
    for (var i = 0; i < files.length; i++)
        if (!exists[i])
            fileNames.push(files[i]);

    return fileNames;
};

// clean the contents of the distribution directory
gulp.task("CLEAN:polyfills", function () {
    return del("public/lib/**/*");
});

gulp.task("CLEAN:app", function () {
    return del("public/app/**/*");
});

gulp.task("CLEAN:node", function () {
    return del("node/**/*");
});

// copy polyfills
gulp.task("COPY:polyfills", function () {
    var files = [
        "node_modules/core-js/client/shim.min.js",
        "node_modules/zone.js/dist/zone.js",
        "node_modules/reflect-metadata/Reflect.js",
        "node_modules/systemjs/dist/system.src.js",
        "node_modules/core-js/client/shim.min.js.map",
        "node_modules/zone.js/dist/zone.js.map",
        "node_modules/reflect-metadata/Reflect.js.map",
        "node_modules/systemjs/dist/system.src.js.map"
    ];

    return gulp.src(filterNonExistingFiles(files, LIB_DESTINATION_PATH))
        .pipe(gulp.dest(LIB_DESTINATION_PATH));
});
