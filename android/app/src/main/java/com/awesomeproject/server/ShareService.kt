package com.awesomeproject.server

import fi.iki.elonen.NanoHTTPD

class ShareService {
    /**
     * 获取指定目录下的文件列表
     *
     * parameters: {
     *  path 目录路径
     * }
     * */
    fun getFiles(parameters: Map<String, List<String>>): NanoHTTPD.Response {
        return NanoHTTPD.newFixedLengthResponse("aaa")
    }
    /**
     * 获取指定目录下的文件列表
     *
     * parameters: {
     *  path 文件路径
     * }
     * */
    fun getFileMata(parameters: Map<String, List<String>>): NanoHTTPD.Response {
        return NanoHTTPD.newFixedLengthResponse("aaa")
    }
}