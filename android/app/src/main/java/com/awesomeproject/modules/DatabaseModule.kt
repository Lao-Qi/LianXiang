package com.awesomeproject.modules

import com.awesomeproject.MainDatabase
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule

class DatabaseModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule() {
    val database = MainDatabase.getDatabase(reactContext)
    override fun getName(): String = "DatabaseModule"
}