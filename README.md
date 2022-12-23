# FindRoute
FindRoute is a mobile app that helps users navigate from one location to another by providing directions and other relevant information. The app is built using the React Native framework, which allows for the development of native applications using JavaScript.

In addition to using React Native, it also incorporates native code through the use of JNI (Java Native Interface). This allows the app to access certain device features and functionality that would otherwise be unavailable to a purely JavaScript-based app.

To store data, FindRoute uses MMKV, a powerful and efficient key-value storage system that is designed for mobile devices. For routing functionality, it relies on openrouteservice, a comprehensive routing service that provides detailed and accurate directions.

To display the map on the screen, your app uses react-native-maps, a module that integrates the popular Google Maps API with React Native. This allows users to view and interact with a map in real-time, adding markers to designate specific locations and creating routes between them.

Overall, FindRoute provides a user-friendly interface for users to plan and navigate their journeys, utilizing a combination of native code and various modules to offer a seamless and efficient experience.



Installation 

-Download the source code
-Add your Google API Key to the "AndroidManifest.xml" file in "FindRoute/android/app/src/main/"
-run git clone https://github.com/Tencent/MMKV.git in "path/to/FindRoute/cpp/" in order to download MMKV.
-edit Cmakelist file in /path/to/cpp/MMKV/POSIX/src, delete "pthread" in the 82th line
