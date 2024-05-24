/** 将App.tsx中的部分配置迁移到base.tsx，简化App.tsx内容与结构 */

import React, {useContext} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View, Dimensions} from 'react-native';
import type {PropsWithChildren} from 'react';
import {ToastComponent, ToastContextProvider} from './message/Toast';
import {RouterContext, RouterContextProvider} from '../router';
import {themeStyle} from '../theme';
import {ServerContextProvider} from '../server';
import {StoreContextProvider} from '../store';

/** 统一配置应用上下文数据 */
export function AppConfigContextProvider({children}: PropsWithChildren) {
	return (
		<StoreContextProvider>
			<RouterContextProvider>
				<ToastContextProvider>
					<ServerContextProvider>{children}</ServerContextProvider>
				</ToastContextProvider>
			</RouterContextProvider>
		</StoreContextProvider>
	);
}

/** 对主题，页面类型设置显示布局 */
export function AppViewContainer({children}: PropsWithChildren) {
	// 窗口大小
	const {width, height} = Dimensions.get('window');
	// 路由
	const {GetPageConfig, currentPath} = useContext(RouterContext);
	const routeConfig = GetPageConfig(currentPath);

	return (
		<SafeAreaView style={[{width, height, backgroundColor: themeStyle.bgc1}]}>
			<StatusBar barStyle={'light-content'} backgroundColor={themeStyle.bgc2} />
			{routeConfig.mainView ? (
				<View style={style.body}>{children}</View>
			) : (
				<routeConfig.Component></routeConfig.Component>
			)}
			<ToastComponent />
		</SafeAreaView>
	);
}

const style = StyleSheet.create({
	view: {
		width: '100%',
		height: '100%',
	},
	body: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		width: '100%',
		height: '100%',
	},
});
