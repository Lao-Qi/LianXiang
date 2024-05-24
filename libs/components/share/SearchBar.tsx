import {View, StyleSheet, TextInput, Pressable, Text} from 'react-native';
import {useContext, useState} from 'react';
import {ThemeContext} from '../../theme';

type PorpsType = {
	onSearch?: (text: string) => void;
};
/** 资源的搜索框 */
export function SearchBar({onSearch}: PorpsType) {
	const {themeStyle} = useContext(ThemeContext);
	const [searchText, setSearchText] = useState('');
	const android_ripple = {
		color: themeStyle.android_ripple_color,
		fontSize: 300,
	};

	return (
		<View style={[style.search, {backgroundColor: themeStyle.bgc2}]}>
			<TextInput
				style={{
					flex: 1,
					height: '100%',
					paddingLeft: 10,
					borderRadius: 5,
					backgroundColor: themeStyle.bgc1,
				}}
				value={searchText}
				onChange={e => setSearchText(e.nativeEvent.text)}
				placeholder="请输入文件名"></TextInput>
			<Pressable
				onPress={() => onSearch && onSearch(searchText)}
				android_ripple={android_ripple}
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					width: 60,
					height: '100%',
					marginLeft: 10,
					borderRadius: 5,
					backgroundColor: themeStyle.focus_color,
				}}>
				<Text style={{color: '#fff'}}>搜索</Text>
			</Pressable>
		</View>
	);
}

const style = StyleSheet.create({
	search: {
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
		height: 55,
		paddingHorizontal: 15,
		paddingVertical: 6,
	},
});
