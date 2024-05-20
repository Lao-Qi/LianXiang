import {Text, StyleSheet, Pressable, View} from 'react-native';
import {BsChevronRight, BsDeviceHdd} from 'rn-icons/bs';
import {useContext} from 'react';
import {ThemeContext} from '../../theme';
import {StoreContext} from '../../store';
import {StoreDeviceType} from '../../utils';

type PropsType = {
	device: StoreDeviceType;
};

export function DeviceItem({device}: PropsType) {
	const {storeState, ChangeStoreState} = useContext(StoreContext);
	const {themeStyle} = useContext(ThemeContext);
	const android_ripple = {
		color: themeStyle.android_ripple_color,
		fontSize: 300,
	};

	function HandleShowRemoteFolder() {
		ChangeStoreState({
			...storeState,
			folder: {
				...device,
				type: 'remote',
			},
		});
	}

	return (
		<Pressable
			onPress={HandleShowRemoteFolder}
			style={[style.container, {backgroundColor: themeStyle.bgc2}]}
			android_ripple={android_ripple}>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
				}}>
				<BsDeviceHdd size={20} color={themeStyle.color2} />
				<Text style={{fontSize: 18, color: themeStyle.color1, marginLeft: 10}}>{device.address}</Text>
			</View>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
				}}>
				<BsChevronRight size={20} color={themeStyle.color2} />
			</View>
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
		paddingHorizontal: 16,
	},
});
