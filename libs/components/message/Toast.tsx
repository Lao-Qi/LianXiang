import {PropsWithChildren, createContext, useContext, useEffect, useState} from 'react';
import {StyleSheet, View, Text, Animated} from 'react-native';
import {ThemeContext} from '../../theme';

type ToastContextType = {
	ShowToastMessage: (message: string) => void;
	HideToastMessage: () => void;
	showState: boolean;
	showMessage: string;
};

export const ToastContext = createContext<ToastContextType>({
	ShowToastMessage() {},
	HideToastMessage() {},
	showState: false,
	showMessage: '',
});

export function ToastContextProvider({children}: PropsWithChildren) {
	const [showState, ChangeShowState] = useState(false);
	const [showMessage, ChangeShowMessage] = useState('');

	function ShowToastMessage(message: string) {
		ChangeShowMessage(message);
		ChangeShowState(true);
	}

	function HideToastMessage() {
		ChangeShowMessage('');
		ChangeShowState(false);
	}

	return (
		<ToastContext.Provider value={{ShowToastMessage, HideToastMessage, showState, showMessage}}>
			{children}
		</ToastContext.Provider>
	);
}

export function ToastComponent() {
	const {themeStyle} = useContext(ThemeContext);
	const {showState, showMessage, HideToastMessage} = useContext(ToastContext);
	/** 弹出时间 */
	const animDuration = 1000;
	/** 停留时间 */
	const stayDuration = 3000;

	const topAnim = new Animated.Value(0);
	const timing = Animated.timing(topAnim, {
		toValue: 200,
		useNativeDriver: true,
		duration: animDuration,
		easing: x => {
			// https://easings.net/#easeOutElastic
			const c4 = (2 * Math.PI) / 3;
			return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
		},
	});

	/** 监听消息的变化 */
	useEffect(() => {
		if (showState && showMessage !== '') {
			timing.start();
			// 延迟，让用户看到消息
			setTimeout(() => {
				HideToastMessage();
				timing.reset();
			}, animDuration + stayDuration);
		}
	}, [showState]);

	return (
		<View style={style.bgc}>
			<Animated.View
				style={[
					style.container,
					{backgroundColor: themeStyle.focus_color, transform: [{translateY: topAnim}]},
				]}>
				<Text style={{color: '#fff'}}>{showMessage}</Text>
			</Animated.View>
		</View>
	);
}

const style = StyleSheet.create({
	bgc: {
		position: 'absolute',
		top: 0,
		left: 0,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		height: '100%',
	},
	container: {
		position: 'absolute',
		top: -80,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		width: 'auto',
		minWidth: 100,
		height: 30,
		paddingHorizontal: 10,
		borderRadius: 25,
	},
});
