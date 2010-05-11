Dojo Mobile
===========
The API you know from dojo, optimized for what you really just need on a mobile phone.

Goal 1 - of this project is to provide an optimized version for each phone, that covers teh features of each phone platform as optimal as possible. E.g. if a platform offers CSS transitions with native HW acceleration the dojo.fx library will make use of it, to provide the fastest speed and best user experience possible.

Goal 2 - stay compatible to the dojo APIs. For those who are used to dojo.query, dojo.fx, etc. we don't want to make it hard for you to learn a new set of APIs just stick to those you know. And make it easy for those new to dojo to learn the API by referencing the existing docs and not reinventing the wheel.

Most of the work in dojo mobile, especially about how to strip out of dojo what is really needed, how to make it most efficient and what platform to provide with what features comes from the investigations of the people inside uxebu. We are planning to actively push this project and we'll strive to provide the best quality, as used to from dojo.


Build
=====
A profile (found in build/profiles/*) defines which JavaScript files implement a feature, e.g. the feature "array" is implemented in the files "src/array/*js", all those will be listed under this features like so:
	"array":[
		"array/_default.js"
		"array/functional.js"
   ]
Normally all features should be defined in a profile, which means there should be an implementation for all the features for all platforms (this might not be given). The set of features that exists is defined in "build/profiles/allFeatures.json".

"array" - a feature
"array-functional" - is a feature, this does not mean it maps 1:1 to a dojo namespace, the dojo namespace might be "dojo.declare", "dojo.mixin" etc. to not confuse a feature with a dojo namespace they are separated using a "-". To resolve the feature "array-functional" in a profile JSON file it is looked up the following ways 1) is the feature "array-functional" directly given in the JSON file? 2) 
   