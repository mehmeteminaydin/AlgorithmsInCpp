//
// Created by mea on 11/30/22.
//

#include <jni.h>
#include <string>
#include <cmath>
#include "MMKV.h"

#include <android/log.h>


std::string jstring2string(JNIEnv *env, jstring jStr) {
    if (!jStr)
        return "";

    const jclass stringClass = env->GetObjectClass(jStr);
    const jmethodID getBytes = env->GetMethodID(stringClass, "getBytes", "(Ljava/lang/String;)[B");
    const jbyteArray stringJbytes = (jbyteArray) env->CallObjectMethod(jStr, getBytes, env->NewStringUTF("UTF-8"));

    size_t length = (size_t) env->GetArrayLength(stringJbytes);
    jbyte* pBytes = env->GetByteArrayElements(stringJbytes, NULL);

    std::string ret = std::string((char *)pBytes, length);
    env->ReleaseByteArrayElements(stringJbytes, pBytes, JNI_ABORT);

    env->DeleteLocalRef(stringJbytes);
    env->DeleteLocalRef(stringClass);
    return ret;
}

// initialize MMKV

extern "C" JNIEXPORT void JNICALL
Java_com_mea_rotabul_CalendarModule_initializeMMKV(
        JNIEnv* env,
        jobject /* this */,
        jstring rootDir) {
    std::string rootDirStr = jstring2string(env, rootDir);
    MMKV::initializeMMKV(rootDirStr);
}

// set MMKV

extern "C" JNIEXPORT void JNICALL
Java_com_mea_rotabul_CalendarModule_setMMKV(
        JNIEnv* env,
        jobject /* this */,
        jstring key,
        jstring value) {
    std::string keyStr = jstring2string(env, key);
    std::string valueStr = jstring2string(env, value);
    auto kv= MMKV::defaultMMKV();
    __android_log_print(ANDROID_LOG_ERROR, "MMKV", "set key: %s", keyStr.c_str());
    __android_log_print(ANDROID_LOG_ERROR, "MMKV", "set value: %s", valueStr.c_str());
    kv->set(valueStr, keyStr);
}

// getString MMKV

extern "C" JNIEXPORT jstring JNICALL
Java_com_mea_rotabul_CalendarModule_getStringMMKV(
        JNIEnv* env,
        jobject /* this */,
        jstring key) {
    std::string keyStr = jstring2string(env, key);
    auto kv= MMKV::defaultMMKV();
    std::string value;

    if(kv->getString(keyStr, value)) {
        __android_log_print(ANDROID_LOG_ERROR, "MMKV", "get value: %s", value.c_str());
        return env->NewStringUTF(value.c_str());
    }
    //return empty string
    return env->NewStringUTF("");
}

// removeValueForKey MMKV

extern "C" JNIEXPORT void JNICALL
Java_com_mea_rotabul_CalendarModule_removeValueForKeyMMKV(
        JNIEnv* env,
        jobject /* this */,
        jstring key) {
    std::string keyStr = jstring2string(env, key);
    auto kv = MMKV::defaultMMKV();
    kv->removeValueForKey(keyStr);
}






