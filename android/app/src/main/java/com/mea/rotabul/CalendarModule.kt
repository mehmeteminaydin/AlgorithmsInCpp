package com.mea.rotabul


import android.util.Log
import com.facebook.react.bridge.*


class CalendarModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    companion object {
        init {
            System.loadLibrary("first_trial")
        }
    }
    external fun initializeMMKV(rootDir: String)
    external fun setMMKV(key: String, value: String)
    external fun getStringMMKV(key: String): String
    external fun removeValueForKeyMMKV(key: String)



    override fun getName() = "CalendarModule"

    @ReactMethod
    fun initMMKV(rootDir: String, promise: Promise) {
        Log.e("CalendarModule", "initMMKV called with $rootDir")
        initializeMMKV(rootDir);
        promise.resolve("Initialized MMKV");

    }

    @ReactMethod
    fun setStringMMKV(key: String, value: String) {
        setMMKV(key, value);
    }

    @ReactMethod
    fun getMMKV(key: String, promise: Promise) {
        Log.e("CalendarModule", "getMMKV called with $key")
        // check if it returns empty string
        val value = getStringMMKV(key);
        Log.e("CalendarModule", "getMMKV returned $value") 
        promise.resolve(value);
        
    }

    @ReactMethod
    fun removeMMKV(key: String) {
        removeValueForKeyMMKV(key);
    }




        
}

