cd %~dp0
cd ..
quasar build | rem
rmdir output /s /q
md output
md .\output\browser
md .\output\android
cd cordova
cordova build android | rem 
cordova build browser | rem
xcopy /s .\platforms\browser\www ..\output\browser
xcopy /s .\platforms\android\build\outputs\apk ..\output\android