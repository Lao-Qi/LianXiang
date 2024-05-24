import {useContext} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {themeStyle} from '../../theme';
import {RouterContext} from '../../router';

export function NavigationHeader() {
	const {currentPath, GetPageConfig} = useContext(RouterContext);
	const info = GetPageConfig(currentPath);

	return (
		<View style={[style.container, {backgroundColor: themeStyle.bgc2}]}>
			<Text style={{color: themeStyle.color1, fontSize: themeStyle.size_l, fontWeight: '700'}}>{info.title}</Text>
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
