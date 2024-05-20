package com.awesomeproject.modules

import com.awesomeproject.server.ShareServer
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap

class ServerModule : ReactContextBaseJavaModule() {
    private val shareServer = ShareServer.getServer()
    override fun getName(): String = "ServerModule"

    @ReactMethod
    fun startServer() {
        shareServer.startServer()
    }

    @ReactMethod
    fun stopServer() {
        shareServer.stopServer()
    }

    /** 获取服务器访问地址 */
    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getServerInfo(): WritableMap{
        val map = Arguments.createMap()
        map.putBoolean("running", shareServer.starting)
        map.putString("url", "http://${ShareServer.hostname}:${ShareServer.port}")
        map.putString("hostname", ShareServer.hostname)
        map.putInt("port", ShareServer.port)

        return  map
    }
}