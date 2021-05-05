# TrickyMaps

#Breakdown of TrickyMaps front end:
--------------------------------------------------------------------------------------------
#- built using Angular platform
#- command to run application: ng serve --o
#- built using bootstrap 4.6
#- IDE: visual studio code

#- how to test application: https://www.youtube.com/watch?v=3yACsnV30N8&t=186s (follow this youtube video)
#	- doenst work on regular chrome because of CORS policy, so you have to run chrome with it disabled
#	- dont use this chrome to look up anything else (just use it for localhost:4200)

#- how to check angular version: ng version 

----------------------------------------------------------------------------------------------
**this has been a warning thats been popping up, might pop up (app still runs)

#ng serve --o
#- Generating browser application bundles...(node:15844) [DEP0148] DeprecationWarning: Use of deprecahe "exports" field module 
	resolution of the package at C:\Users\jeffc\Desktop\githubdesktop\TrickyMas\postcss\package.json.
	Update this package.json to use a subpath pattern like "./*".
	(Use `node --trace-deprecation ...` to show where the warning was created)
	√ Browser application bundle generation complete.

----------------------------------------------------------------------------------------------

- app routing module: lists all the routes
- app component: routes right to homepage component immediately
- home page component: home page
- set up component: user goes to this page when click the play button on home screen
- instructions component: user goes to this page when click the how to play button on home screen
- game page: user goes to this page when user clicks get tricky button on set up screen
- score page: user goes to this page when user clicks on submit guess button on game screen

-----------------------------------------------------------------------------------------------

- in the assets folder there is a js folder. this folder contains javascript functions
- there is two files we had in this folder: script.js and api.js
- you wont get the api.js because i did not upload it to github
-  /* So the javascript file api.js with the 
          method getKey() is not on github. In order for this to work:
      1: create a new javascript file named 'api.js' 
      2: put it in the js folder in assets
      3: in that method, write:
        function getKey(){
          return ________; <- this is where the api key goes (put it in single quotation marks)
        } 
      ****api.js is included in the .gitignore file, this is why these steps are important*/
	  ****this method is called in the gameplay.component.ts file

---------------------------------------------------------------------

- images/video/audio are located in assets folder
- the spec.ts files don't worry about (they are generated as you make a new component) i didnt code those
- dont need to edit index.html (only update the folders with the other html pages, .ts files and .css files)
- app.module.ts = imports of each componenet, and modules
- send-lat-long.service.ts gets lat and long of setup page and sends that information to gameplay page (get map working)
- send-json-data.service.ts gets data entered at setup page and sends that information to scoring page (gets video loaded from backend)

---------------------------------------------------------------------

- gameplay.component.html -> ../../assets/copyrightfreemusic.mp4 not included in repo (too big)
	- this is youtube link: https://www.youtube.com/watch?v=Q7HjxOAU5Kc (convert to mp4)
- homepage.componenet.html -> ../../assets/tour.mp4 not included in repo (too big)
	- cant find original youtube link (replace with new video/change it up yourselves)
	
---------------------------------------------------------------------