import {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {RouterContext} from '../../router';

export function NavigationPage() {
	const {currentPath, GetPageConfig} = useContext(RouterContext);
	const routerConfig = GetPageConfig(currentPath);

	return (
		<View style={style.container}>
			<routerConfig.Component></routerConfig.Component>
		</View>
	);
}

const style = StyleSheet.create({
	container: {
		width: '100%',
		flex: 1,
	},
});
