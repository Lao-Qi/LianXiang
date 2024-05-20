import {useContext} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {BsQrCodeScan} from 'rn-icons/bs';
import {ThemeContext} from '../../theme';
import {RouterContext} from '../../router';

export function NavigationHeader() {
	const {themeStyle} = useContext(ThemeContext);
	const {currentPath, GetPageConfig, TogglePage} = useContext(RouterContext);
	const info = GetPageConfig(currentPath);

	function HandleOpenScanCodeView() {
		TogglePage('scancode');
	}

	return (
		<View style={[style.container, {backgroundColor: themeStyle.bgc2}]}>
			<Text style={{color: themeStyle.color1, fontSize: themeStyle.size_l, fontWeight: '700'}}>{info.title}</Text>
			<BsQrCodeScan size={24} color={themeStyle.color2} onPress={HandleOpenScanCodeView} />
		</View>
	);
}

const style = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		width: '100%',
		height: 60,
	},
});
