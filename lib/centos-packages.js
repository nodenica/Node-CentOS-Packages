var request = require('request');
var http = require("http");
var util = require('util');
var fs = require('fs');
var url = require('url');
var path = require('path');

module.exports = {

    download: function () {

        var _self = this;

        _self.version = '6.5';

        _self.type = 'x86_64';

        _self.types = ['i386', 'x86_64'];

        _self.rpms = [];

        _self.directory = path.resolve( __dirname, 'downloads' );

        _self.setDirectory = function( directory ){
            _self.directory = path.resolve( __dirname, directory );
        }

        /**
         *
         * Create a throw error
         * @param {String} message
         */
        _self.error = function (message) {

            throw new Error(message);

        }

        /**
         *
         * Set CentOS version
         * @param {Number} version
         */
        _self.setVersion = function (version) {

            if (/^\d+(\.\d{1,2})?$/.test(version)) {

                _self.version = version;

            }
            else {

                _self.error('Invalid CentOS version');

            }

        }

        _self.setType = function (type) {

            if (_self.types[type] != undefined) {

                _self.type = type;

            }
            else {

                _self.error('Invalid CentOS type');

            }

        }

        _self.parse = function (body) {

            var match = body.match(/([A-Za-z0-9._%+-]{1,}\.rpm)/g);

            _self.rpms = match;

        }


        _self.url = util.format('http://mirror.centos.org/centos/%s/os/%s/Packages/', _self.version, _self.type);

        _self.setUrl = function( url ){

            _self.url = url;

        }


        _self.get = function () {

            request(_self.url, function (error, response, body) {

                if (!error && response.statusCode == 200) {

                    _self.parse(body);

                    _self.downloadAll();

                }

            });

        }

        _self.downloadAll = function () {

            if( !fs.existsSync( _self.directory ) ){

                fs.mkdirSync( _self.directory );

            }


            //console.log( _self.rpms );


            _self.rpms.forEach(function(rpmFile){

                if( !fs.existsSync( _self.direction + rpmFile ) ){
                    _self.downloadRpm(_self.url + rpmFile);
                }
                else{
                    console.log(_self.direction + rpmFile + ' exist.');
                }

            });


        }

        _self.downloadRpm = function (urlRpm) {

            var options = {
                host: url.parse(urlRpm).host,
                port: 80,
                path: url.parse(urlRpm).pathname
            };

            var rpmFileName = url.parse(urlRpm).pathname.split('/').pop();
            var file = fs.createWriteStream(_self.directory + '/' + rpmFileName);

            http.get(options, function (res) {
                res.on('data',function (data) {
                    file.write(data);
                }).on('end', function () {
                        file.end();
                        console.log(rpmFileName + ' downloaded to ' + _self.directory);
                    });
            });
        };

    }

}