import {useContext} from 'react';
import {StyleSheet, View, Pressable, Text} from 'react-native';
import {BsServer, BsFolderFill} from 'rn-icons/bs';
import {ThemeContext} from '../../theme';
import {RouterContext} from '../../router';

export function NavigationBar() {
	const {themeStyle} = useContext(ThemeContext);
	const {currentPath, TogglePage} = useContext(RouterContext);

	/**
	 * Navigation bar Click Wave Effect.
	 * https://reactnative.cn/docs/pressable#rippleconfig
	 * */
	const rippleConfig = {
		color: themeStyle.android_ripple_color,
		radius: 100,
	};

	function GetOptionColor(path: string) {
		return currentPath === path ? themeStyle.focus_color : themeStyle.color2;
	}

	return (
		<View style={[style.container, {backgroundColor: themeStyle.bgc2}]}>
			<Pressable style={style.pressable} android_ripple={rippleConfig} onPress={() => TogglePage('server')}>
				<BsServer size={26} color={GetOptionColor('server')}></BsServer>
				<Text style={[style.text, {color: GetOptionColor('server')}]}>服务端</Text>
			</Pressable>
			<Pressable style={style.pressable} android_ripple={rippleConfig} onPress={() => TogglePage('resource')}>
				<BsFolderFill size={26} color={GetOptionColor('resource')}></BsFolderFill>
				<Text style={[style.text, {color: GetOptionColor('resource')}]}>资源</Text>
			</Pressable>
		</View>
	);
}

const style = StyleSheet.create({
	container: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		width: '100%',
		height: 60,
	},
	pressable: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: '50%',
		height: '100%',
		flex: 1,
	},
	text: {
		marginTop: 2,
		fontWeight: '700',
	},
});
