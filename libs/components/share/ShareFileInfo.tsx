import {useContext, useEffect} from 'react';
import {BsChevronRight} from 'rn-icons/bs';
import FileViewer from 'react-native-file-viewer';
import {Alert, BackHandler, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
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

	function HandlePreview() {
		FileViewer.open(fileInfo.fileCopyUri, {showOpenWithDialog: true});
	}

	function HandleShowName() {
		Alert.alert('文件全称', fileInfo.name);
	}

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
					<Pressable
						onPress={HandleShowName}
						android_ripple={{color: themeStyle.android_ripple_color, radius: 300}}
						style={style.infoItem}>
						<Text style={{fontSize: 18, color: themeStyle.color1}}>名称：</Text>
						<View
							style={{
								display: 'flex',
								alignItems: 'center',
							}}>
							<Text style={{fontSize: 18, color: themeStyle.color1}}>{copyName}</Text>
							<BsChevronRight style={{marginRight: 5}} size={20} color={themeStyle.color2} />
						</View>
					</Pressable>
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
					<Pressable
						onPress={HandlePreview}
						android_ripple={{color: themeStyle.android_ripple_color, radius: 300}}
						style={style.infoItem}>
						<Text style={{fontSize: 18, color: themeStyle.color1}}>预览：</Text>
						<BsChevronRight size={20} color={themeStyle.color2} />
					</Pressable>
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
