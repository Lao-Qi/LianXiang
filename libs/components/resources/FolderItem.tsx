import {Text, StyleSheet, Pressable} from 'react-native';
import {BsChevronRight, BsFolder} from 'rn-icons/bs';
import {ThemeContext} from '../../theme';
import {useContext} from 'react';
import {StoreContext} from '../../store';

type PropsType = {
	name: string;
};

export function FolderItem({name}: PropsType) {
	const {storeState, ChangeStoreState} = useContext(StoreContext);
	const {themeStyle} = useContext(ThemeContext);
	const android_ripple = {
		color: themeStyle.android_ripple_color,
		fontSize: 300,
	};

	function HandleShowLocalFolder() {
		ChangeStoreState({
			...storeState,
			folder: {
				uuid: '',
				addTime: 0,
				address: '/',
				type: 'local',
			},
		});
	}

	return (
		<Pressable style={style.container} android_ripple={android_ripple} onPress={HandleShowLocalFolder}>
			<BsFolder size={20} color={themeStyle.color2} />
			<Text style={{fontSize: 17, color: themeStyle.color1, marginLeft: 10}}>{name}</Text>
			<BsChevronRight style={{marginLeft: 'auto'}} size={20} color={themeStyle.color2} />
		</Pressable>
	);
}

const style = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		height: 60,
		paddingHorizontal: 16,
	},
});
