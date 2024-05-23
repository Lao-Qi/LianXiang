import {Pressable, ScrollView, StyleSheet, Text, View, BackHandler, Alert} from 'react-native';
import {Card, ShareFileItem, ShareFileInfo, ToastContext} from '../components';
import {useContext, useEffect, useState} from 'react';
import {ThemeContext} from '../theme';
import {BsUpload} from 'rn-icons/bs';
import {AppLocalStore, StoreFileType} from '../utils';
import {pick} from 'react-native-document-picker';

export function SharePage() {
	const {themeStyle} = useContext(ThemeContext);
	const {ShowToastMessage} = useContext(ToastContext);
	const [renderFiles, setRenderFiles] = useState<StoreFileType[]>([]);
	const [showFileInfo, setshowFileInfo] = useState<StoreFileType | null>(null);
	// 属性配置
	const WhiteAndroidRipple = {
		color: 'rgba(255, 255, 255, 0.2)',
		radius: 300,
	};

	async function HandleUploadFile() {
		try {
			const [result] = await pick({
				copyTo: 'documentDirectory',
			});
			if (!result.name || !result.size || !result.type || !result.uri || !result.fileCopyUri) {
				return;
			}
			const files = await AppLocalStore.files.AddFile({
				name: result.name,
				size: result.size,
				type: result.type,
				uri: result.uri,
				fileCopyUri: result.fileCopyUri,
			});

			setRenderFiles(files);
			ShowToastMessage('文件添加成功');
		} catch {}
	}

	async function HandleRmoveFile(file: StoreFileType) {
		Alert.alert('是否删除共享记录', '只删除共享记录，不会删除文件', [
			{
				text: '取消',
				style: 'cancel',
			},
			{
				text: '确定',
				style: 'default',
				async onPress() {
					const files = await AppLocalStore.files.RemoveFile(file);
					setRenderFiles(files);
					setshowFileInfo(null);
				},
			},
		]);
	}

	function ShowFileInfo(file: StoreFileType) {
		setshowFileInfo(file);
	}

	async function LoadFiles() {
		const files = await AppLocalStore.files.GetFiles();
		setRenderFiles(files);
	}

	useEffect(() => {
		LoadFiles();

		const handler = BackHandler.addEventListener('hardwareBackPress', () => {
			if (showFileInfo) {
				setshowFileInfo(null);
				return true;
			}
		});

		return () => {
			handler.remove();
		};
	}, []);
	return (
		<View
			style={{
				display: 'flex',
				flex: 1,
			}}>
			{!showFileInfo ? (
				<View
					style={{
						display: 'flex',
						flex: 1,
					}}>
					<ScrollView style={{paddingHorizontal: 10}}>
						<Card title="本地共享资源">
							{!renderFiles.length ? (
								<View style={style.notfiles}>
									<Text>暂无上传的共享文件</Text>
								</View>
							) : (
								renderFiles.map(file => (
									<ShareFileItem
										onPress={() => ShowFileInfo(file)}
										name={file.name}
										key={file.uuid}></ShareFileItem>
								))
							)}
						</Card>
					</ScrollView>
					<Pressable
						onPress={HandleUploadFile}
						android_ripple={WhiteAndroidRipple}
						style={[style.uploadButton, {backgroundColor: themeStyle.focus_color}]}>
						<BsUpload size={20} color="#fff" />
					</Pressable>
				</View>
			) : (
				<ShareFileInfo
					onRemoveFile={HandleRmoveFile}
					setFileInfo={setshowFileInfo}
					fileInfo={showFileInfo}></ShareFileInfo>
			)}
		</View>
	);
}

const style = StyleSheet.create({
	uploadButton: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		bottom: 80,
		right: 30,
		width: 56,
		height: 56,
		borderRadius: 28,
	},
	notfiles: {
		width: '100%',
		height: 60,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
});
