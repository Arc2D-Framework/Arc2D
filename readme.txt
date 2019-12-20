The core /framework folder that powers a Cocoon app. The "Framework" folder is in it's own repository and added as a subtree in Cocoon apps. What this means:

Cocooc apps can pull in latest framework updates:
cd.. into your app, run:
	> git subtree pull --prefix=app/framework/ --squash framework 1.0.0
