import {createContext, useState} from 'react';
import {useColorScheme} from 'react-native';
import type {PropsWithChildren} from 'react';

const commonStyle = {
	/** 中型文字大小 */
	size_m: 18,
	/** 标题文字大小 */
	size_l: 22,
};

const ThemeStyleMap = {
	dark: {
		/** 页面背景颜色 */
		bgc1: '#0d1019',
		/** 状态栏，头部，导航栏，容器等背景颜色 */
		bgc2: '#171c22',
		/** 对比颜色*/
		bgc3: '#f2f2f2',
		/** 容器边框颜色 */
		border: '#393d46',
		/** 阴影颜色 */
		shadow: '#000',
		/** 标题颜色 */
		color1: '#d4d9de',
		/** 图标，控件，部分字体颜色 */
		color2: '#cfd4d9',
		/**  侧旁提示颜色 */
		color3: '#9598a1',
		/** 控件图标和字体的聚焦颜色 */
		focus_color: '#a298ee',
		/** andorid点击涟漪颜色 */
		android_ripple_color: 'rgba(166, 153, 237, 0.1)',
		...commonStyle,
	},
	light: {
		bgc1: '#f2f2f2',
		bgc2: '#ffffff',
		bgc3: '#0d1019',
		border: '#e7e7e7',
		shadow: '#ccc',
		color1: '#121212',
		color2: '#585f65',
		color3: '#797d82',
		focus_color: '#482eea',
		android_ripple_color: 'rgba(0, 0, 0, 0.1)',
		...commonStyle,
	},
};

export type ThemeContextType = {
	theme: 'dark' | 'light';
	// dark带有注释，这里使用dark的类型提示
	themeStyle: typeof ThemeStyleMap.dark;
	ChangeTheme(theme: 'dark' | 'light'): void;
};

export const ThemeContext = createContext<ThemeContextType>({
	theme: 'light',
	themeStyle: ThemeStyleMap['light'],
	ChangeTheme(theme: 'dark' | 'light') {},
});

export function ThemeContextProvider({children}: PropsWithChildren) {
	const [theme, _ChangeTheme] = useState(useColorScheme() || 'light');
	const [themeStyle, _ChangeStyle] = useState(ThemeStyleMap[theme]);

	function ChangeTheme(theme: 'dark' | 'light') {
		_ChangeTheme(theme);
	}

	return <ThemeContext.Provider value={{theme, themeStyle, ChangeTheme}}>{children}</ThemeContext.Provider>;
}
