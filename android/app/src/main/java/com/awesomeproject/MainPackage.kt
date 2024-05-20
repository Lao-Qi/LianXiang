package com.awesomeproject

import android.view.View
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ReactShadowNode
import com.facebook.react.uimanager.ViewManager
import com.awesomeproject.modules.DatabaseModule
import com.awesomeproject.modules.ServerModule

class MainPackage: ReactPackage {
    override fun createViewManagers(p0: ReactApplicationContext): MutableList<ViewManager<View, ReactShadowNode<*>>> = mutableListOf()

    override fun createNativeModules(p0: ReactApplicationContext): MutableList<NativeModule>  = listOf(
        DatabaseModule(p0),
        ServerModule()
    ).toMutableList()
}