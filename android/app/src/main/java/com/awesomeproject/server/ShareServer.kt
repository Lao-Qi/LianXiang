package com.awesomeproject.server

import android.util.Log
import com.lianxiang.utils.NetworkUtils
import fi.iki.elonen.NanoHTTPD

class ShareServer(hostname: String, port: Int): NanoHTTPD(hostname, port) {
    private val shareService = ShareService()
    var starting = false
    // 确保只会实例化一个服务器
    companion object {
        @Volatile
        private var INSTANCE: ShareServer?= null
        // hostname会在UI显示前被加载，这会影响到UI的加载时，后期改成启动服务器时才获取hostname
        val hostname = NetworkUtils.getDeviceIpv4Address() ?: "127.0.0.1"
        val port = 9091
        fun getServer(): ShareServer {
            return INSTANCE ?: synchronized(this) {
                val instance = ShareServer(hostname, port)
                INSTANCE = instance
                return instance
            }
        }
    }

    override fun serve(session: IHTTPSession?): Response {
        Log.i("request", "ip session = ${session?.uri}, method = ${session?.method}, header = ${session?.headers}, params = ${session?.parameters}")

        if(session?.uri == "/files" && session.method == Method.GET) {
            return  shareService.getFiles(session.parameters)
        }else if(session?.uri == "/file_meta" && session.method == Method.GET) {
            return shareService.getFileMata(session.parameters)
        }else if(session?.uri == "/download_file") {

        }else if(session?.uri == "/upload_file") {}

        return  newFixedLengthResponse("aaa")
    }

    fun startServer() {
        if(starting) {
            return
        }

        start()
        starting = true
    }

    fun stopServer() {
        if(!starting) {
            return
        }

        stop()
        starting = false
    }
}