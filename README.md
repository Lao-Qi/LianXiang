## 联享

一款解决跨端，跨系统的目录共享的 APP

    因缺少macos系统或黑苹果设备，目前开发不了ios版本

### 开发环境

请确保有完整的开发环境再启动应用

-   node 20.11.0
-   npm 10.2.4
-   yarn 1.22.21

[环境搭建](https://reactnative.cn/docs/environment-setup)

[设备上运行](https://reactnative.cn/docs/running-on-device)

### 启动应用[debug]

```bash
yarn

# OR using Yarn
yarn android
# 可能会出现android依赖下载失败等问题，可换源或上bing.com查询
```

### 打包应用[release]

[可直接根据 react-native 官方文档进行配置](https://reactnative.cn/docs/signed-apk-android)

#### 部分依赖因历史遗留问题，需要做出修改

##### 1. react-native-camera 的类型提示报错(debug)

解决方法： [https://github.com/react-native-camera/react-native-camera/issues/3453](https://github.com/react-native-camera/react-native-camera/issues/3453)
