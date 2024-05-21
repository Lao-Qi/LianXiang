import {Pressable, Text} from 'react-native';
import {useContext} from 'react';
import {ThemeContext} from '../../theme';
import {BsChevronRight, BsFileEarmark} from 'rn-icons/bs';

type PropsType = {
	name: string;
	onPress(): void;
};

export function ShareFileItem({name, onPress}: PropsType) {
	const {themeStyle} = useContext(ThemeContext);
	const android_ripple = {
		color: themeStyle.android_ripple_color,
		fontSize: 300,
	};
	const copyName = name.length >= 20 ? `${name.slice(0, 17)}...` : name;

	return (
		<Pressable
			android_ripple={android_ripple}
			onPress={onPress}
			style={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				paddingHorizontal: 10,
				width: '100%',
				height: 60,
				borderTopColor: themeStyle.border,
			}}>
			<BsFileEarmark size={20} color={themeStyle.color2} />
			<Text style={{fontSize: 18, color: themeStyle.color1, marginLeft: 10}}>{copyName}</Text>
			<BsChevronRight style={{marginLeft: 'auto'}} size={20} color={themeStyle.color2} />
		</Pressable>
	);
}
