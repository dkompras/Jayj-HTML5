module.exports = function(grunt) {

    // Load all grunt tasks matching the `grunt-*` pattern
    require( 'load-grunt-tasks' )(grunt);

    // Configurable paths
    var config = {
        src: 'src',
        build: 'build'
    };

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: config,

        // Watch for file changes
        watch: {
            sass: {
                files: [ '<%= config.src %>/sass/**/*.scss' ],
                tasks: [ 'sass:dev', 'autoprefixer' ],
            },
            js: {
                files: [ '<%= config.src %>/js/{,*/}*.js' ],
                tasks: [ 'newer:jshint:js' ]
            },
            images: {
                files: [ '<%= config.src %>/images/{,*/}*' ],
                tasks: [ 'newer:imagemin' ]
            },
            grunt: {
                files: [ 'Gruntfile.js' ],
                tasks: [ 'jshint:grunt' ]
            }
        },

        // Compile Sass
        sass: {
            dev: {
                files: {
                    '<%= config.src %>/css/style.css': '<%= config.src %>/sass/main.scss'
                },
                options: {
                    style: 'expanded',
                }
            }
        },

        // Autoprefix the compiled CSS
        autoprefixer: {
            dev: {
                options: {
                    browsers: [ 'last 2 version', 'ie 9' ]
                },
                src: '<%= config.src %>/css/style.css',
                dest: '<%= config.src %>/css/style.css'
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            grunt: {
                src: [ 'Gruntfile.js' ]
            },
            js: {
                src: [ '<%= config.src %>/js/{,*/}*.js' ]
            }
        },

        // Minify CSS
        cssmin: {
            build: {
                expand: true,
                src: [ 'css/style.css' ],
                cwd: '<%= config.build %>/',
                dest: '<%= config.build %>/',
                ext: '.min.css'
            }
        },

        // Minify images
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: '<%= config.src %>/images/',
                    dest: '<%= config.src %>/images/',
                    src: [ '**/*.{png,jpg,gif}' ]
                }]
            }
        },

        // Process HTML files
        processhtml: {
            options: {

            },
            build: {
                files: {
                    '<%= config.build %>/index.html': ['<%= config.src %>/index.html'],
                    '<%= config.build %>/contact.html': ['<%= config.src %>/contact.html'],
                    '<%= config.build %>/test.html': ['<%= config.src %>/test.html']
                }
            }
        },

        // Clean the build folder
        clean: {
            build: {
                src: [ '<%= config.build %>/' ]
            }
        },

        // Copy to build folder
        copy: {
            build: {
                expand: true,
                cwd: '<%= config.src %>/',
                src: [
                    '**',
                    '!bower_components/**',
                    '!.css.map',
                ],
                dest: '<%= config.build %>/',
            },
        },
        // Copy Bower components to build folder
        bower: {
            build: {
                dest: '<%= config.build %>',
                js_dest: '<%= config.build %>/js',
                css_dest: '<%= config.build %>/css',
                options: {
                    ignorePackages: [ 'google-code-prettify' ]
                }
            }
        },

        // Create custom Modernizr build in build folder
        modernizr: {
            build: {
                'devFile': '<%= config.src %>/bower_components/sprockets-modernizr/modernizr.js',
                'outputFile': '<%= config.build %>/js/modernizr-custom.js',
                'uglify': false, // will be done by the uglify task
                'tests': [ 'csscolumns', 'flexbox', 'css-calc' ],
                'extra': {
                    'load': false
                },
            }
        },

        // Minify JS in build folder
        uglify: {
            build: {
                options: {
                    preserveComments: 'some'
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.build %>/js',
                    dest: '<%= config.build %>/js',
                    src: '**/*.js',
                    ext: '.min.js'
              }],
            }
        },

        // Compress the build folder into a zip file
        compress: {
            build: {
                options: {
                    archive: '<%= config.build %>/jayj-html5-theme-<%= pkg.version %>.zip'
                },
                cwd: '<%= config.build %>/',
                src: ['**/*'],
                dest: 'jayj-html5-theme/'
            }
        }
    });

    // Default task
    grunt.registerTask( 'default', [ 'watch' ] );


    // Pre-build task
    grunt.registerTask( 'pre-build', [ 'sass', 'autoprefixer', 'cssmin:build', 'imagemin' ]);

    // Build task
    grunt.registerTask( 'build', [ 'clean:build', 'copy:build', 'compress:build' ]);

};
