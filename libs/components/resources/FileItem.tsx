import {Text, StyleSheet, Pressable, View} from 'react-native';
import {BsChevronRight, BsFileEarmark} from 'rn-icons/bs';
import {ThemeContext} from '../../theme';
import {useContext, useEffect} from 'react';
import {StoreFileType} from '../../utils';
import {StoreContext} from '../../store';

type PropsType = {
	option: StoreFileType & {
		showType: 'local' | 'remote';
	};
};

export function FileItem({option}: PropsType) {
	const {storeState, ChangeStoreState} = useContext(StoreContext);
	const {themeStyle} = useContext(ThemeContext);
	const android_ripple = {
		color: themeStyle.android_ripple_color,
		fontSize: 300,
	};

	let copyOption = option;
	copyOption.name = copyOption.name.length > 18 ? `${copyOption.name.slice(0, 15)}...` : copyOption.name;

	function HandleShowFileInfo() {
		ChangeStoreState({
			...storeState,
			fileInfo: {
				address: storeState.folder.address,
				...option,
			},
		});
	}

	return (
		<Pressable onPress={HandleShowFileInfo} style={style.container} android_ripple={android_ripple}>
			<View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
				<BsFileEarmark size={20} color={themeStyle.color2} />
				<Text style={{fontSize: 18, color: themeStyle.color1, marginLeft: 10}}>{copyOption.name}</Text>
			</View>
			<BsChevronRight size={20} color={themeStyle.color2} />
		</Pressable>
	);
}

const style = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 60,
		paddingHorizontal: 10,
	},
});
