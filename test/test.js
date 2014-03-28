var packages = require('../lib/centos-packages');


var download = new packages.download();

/*

download.setDirectory('postgresql');

download.setUrl('http://yum.postgresql.org/9.3/redhat/rhel-6-x86_64/');

download.get( );

*/

download.setDirectory('epel');

download.setUrl('http://mirror-fpt-telecom.fpt.net/fedora/epel/6/x86_64/');

download.get( );