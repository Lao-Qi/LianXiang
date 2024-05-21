import {useContext, useEffect} from 'react';
import {BackHandler, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {StoreFileType, convertBytesToMBGB} from '../../utils';
import {Card} from '../card/Card';
import {ThemeContext} from '../../theme';

type PropsType = {
	fileInfo: StoreFileType;
	setFileInfo(value: StoreFileType | null): void;
	onRemoveFile(file: StoreFileType): void;
};

export function ShareFileInfo({setFileInfo, fileInfo, onRemoveFile}: PropsType) {
	// 属性配置
	const WhiteAndroidRipple = {
		color: 'rgba(255, 255, 255, 0.2)',
		radius: 300,
	};
	const {themeStyle} = useContext(ThemeContext);
	const copyName = fileInfo.name.length >= 20 ? `${fileInfo.name.slice(0, 17)}...` : fileInfo.name;

	useEffect(() => {
		const handler = BackHandler.addEventListener('hardwareBackPress', () => {
			setFileInfo(null);
			return true;
		});

		return () => {
			handler.remove();
		};
	}, []);
	return (
		<>
			<ScrollView style={{flex: 1, paddingHorizontal: 10}}>
				<Card title="本地共享资源">
					<View style={style.infoItem}>
						<Text style={{fontSize: 18, color: themeStyle.color1}}>名称：</Text>
						<Text style={{fontSize: 18, color: themeStyle.color1}}>{copyName}</Text>
					</View>
					<View style={style.infoItem}>
						<Text style={{fontSize: 18, color: themeStyle.color1}}>大小：</Text>
						<Text style={{fontSize: 18, color: themeStyle.color1}}>
							{convertBytesToMBGB(fileInfo.size)}
						</Text>
					</View>
					<View style={style.infoItem}>
						<Text style={{fontSize: 18, color: themeStyle.color1}}>MIME类型：</Text>
						<Text style={{fontSize: 18, color: themeStyle.color1}}>{fileInfo.type}</Text>
					</View>
					<View style={style.infoItem}>
						<Text style={{fontSize: 18, color: themeStyle.color1}}>类型：</Text>
						<Text style={{fontSize: 18, color: themeStyle.color1}}>本地资源</Text>
					</View>
				</Card>
			</ScrollView>
			<View
				style={{
					width: '100%',
					height: 'auto',
					paddingHorizontal: 10,
					paddingVertical: 40,
				}}>
				<Pressable
					onPress={() => onRemoveFile(fileInfo)}
					android_ripple={WhiteAndroidRipple}
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						width: '100%',
						height: 60,
						borderRadius: 20,
						backgroundColor: '#e63f31',
					}}>
					<Text
						style={{
							fontSize: 20,
							color: '#fff',
						}}>
						删除记录
					</Text>
				</Pressable>
			</View>
		</>
	);
}

const style = StyleSheet.create({
	infoItem: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		height: 60,
		paddingHorizontal: 20,
	},
	removeButton: {},
});
