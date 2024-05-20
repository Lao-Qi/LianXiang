package com.lianxiang.utils

import java.net.Inet4Address
import java.net.NetworkInterface

class NetworkUtils {
    companion object {
        /**
        * 获取设备ipv4地址
        * */
        fun getDeviceIpv4Address(): String? {
            val en = NetworkInterface.getNetworkInterfaces()
            for(intel in en) {
                if(intel.isUp && !intel.isLoopback) {
                    for(address in intel.inetAddresses) {
                        if(address is Inet4Address) {
                            return address.hostAddress
                        }
                    }
                }
            }

            return null
        }
    }
}