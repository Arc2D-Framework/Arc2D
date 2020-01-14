*************************************************************
DESCRIPTION
*************************************************************
Concatenates all .js files declared by 'main.js' with 
help of '-buildconfig.js' and '/tools'. Any app can have
it's own local -buildconfig.js.

IMPORTANT: Remove '/tools' dir before deploying to production.





*************************************************************
HOW TO BUILD APPS
*************************************************************

To build an app for the desktop, (example, see: apps/Sample), run:
> java -jar tools/js.jar tools/concat.js apps/Sample


To build the Desktop root, run:
> java -jar tools/js.jar tools/concat.js .

Alternatively, if you have Ruby installed, build apps using:
rake js:build['apps/Sample']






