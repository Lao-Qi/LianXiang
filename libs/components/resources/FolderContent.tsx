import {ScrollView, View, BackHandler, StyleSheet, Pressable, Text, Alert} from 'react-native';
import {useContext, useEffect, useState} from 'react';
import {BsUpload, BsTrash} from 'rn-icons/bs';
import {pick} from 'react-native-document-picker';
import {StoreContext} from '../../store';
import {ThemeContext} from '../../theme';
import {AppLocalStore, StoreFileType} from '../../utils';
import {FileItem} from './FileItem';
import {Card, SearchBar, ToastContext} from '../';

/** 资源目录内容 */
export function FolderContent() {
	const {storeState, ChangeStoreState} = useContext(StoreContext);
	const {themeStyle} = useContext(ThemeContext);
	const {ShowToastMessage} = useContext(ToastContext);
	const [loadMessage, setLoadMessage] = useState('文件获取中...');

	// 属性配置
	const WhiteAndroidRipple = {
		color: 'rgba(255, 255, 255, 0.2)',
		radius: 300,
	};

	function HandlePress() {
		if (storeState.folder.type === 'local') {
			HandleUploadLocalFile();
		} else {
			HandleRemoveDevice();
		}
	}

	/** 删除远程设备 */
	function HandleRemoveDevice() {
		try {
			Alert.alert('是否删除远程连接设备', '只是删除设备与设备间的远程连接', [
				{
					text: '取消',
					style: 'cancel',
				},
				{
					text: '确定',
					style: 'default',
					async onPress() {
						const devices = await AppLocalStore.device.RemoveDevice(storeState.folder.uuid);
						ChangeStoreState({
							...storeState,
							devices,
							folder: {
								uuid: '',
								address: '',
								addTime: 0,
								type: 'local',
							},
						});
						ShowToastMessage('删除成功');
					},
				},
			]);
		} catch (err) {
			console.log(err);
			ShowToastMessage('删除失败');
		}
	}

	/** 将本地文件记作共享文件 */
	async function HandleUploadLocalFile() {
		try {
			const [result] = await pick({
				copyTo: 'documentDirectory',
			});

			console.log(result);

			if (!result.name || !result.size || !result.type || !result.uri || !result.fileCopyUri) {
				return;
			}

			const file = await AppLocalStore.files.AddFile({
				name: result.name,
				size: result.size,
				type: result.type,
				uri: result.uri,
				fileCopyUri: result.fileCopyUri,
			});

			const folderFiles = storeState.folderFiles;
			folderFiles.push(file);

			ChangeStoreState({
				...storeState,
				folderFiles,
			});
		} catch {
			// 无视用户未选择文件直接退出的错误
		}
	}

	async function LoadFiles() {
		console.log('LoadFiles', storeState.folder.address);

		let files: StoreFileType[] = [];
		try {
			if (storeState.folder.type === 'local') {
				files = await AppLocalStore.files.GetFiles();
				if (!files.length) {
					setLoadMessage('占无共享文件');
				}
			} else if (storeState.folder.type === 'remote') {
				const res = await fetch(`http://${storeState.folder.address}/files`);
				const data = await res.json();

				if (!data?.status) {
					ShowToastMessage('对方设备异常');
					setLoadMessage('文件获取失败');
					return;
				}

				if (!data.files.length) {
					setLoadMessage('占无共享文件');
					return;
				}

				files = data.files;

				console.log(files);
			}
		} catch {
			ShowToastMessage('文件获取失败');
			setLoadMessage('文件获取失败');
		}

		ChangeStoreState({
			...storeState,
			folderFiles: files,
		});
	}

	useEffect(() => {
		if (storeState.searchText !== '') {
			console.log(storeState.searchText);
		}
	}, []);

	useEffect(() => {
		LoadFiles();

		// 用户调用系统默认的退出操作
		const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
			ChangeStoreState({
				...storeState,
				folder: {
					uuid: '',
					address: '',
					addTime: 0,
					type: 'local',
				},
			});
			return true;
		});

		return () => {
			backHandler.remove();
		};
	}, []);

	return (
		<>
			<SearchBar />
			<ScrollView style={{flex: 1, paddingHorizontal: 10}}>
				<Card title={storeState.folder.address === '/' ? '共享目录' : storeState.folder.address}>
					{storeState.folderFiles.length ? (
						storeState.folderFiles.map(file => {
							return (
								<FileItem
									option={{...file, showType: storeState.folder.type}}
									key={file.uuid}></FileItem>
							);
						})
					) : (
						<View
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								width: '100%',
								height: 60,
							}}>
							<Text style={{fontSize: 18, color: themeStyle.color3}}>{loadMessage}</Text>
						</View>
					)}
				</Card>
			</ScrollView>
			<Pressable
				onPress={HandlePress}
				android_ripple={WhiteAndroidRipple}
				style={[
					style.uploadButton,
					{backgroundColor: storeState.folder.type === 'local' ? themeStyle.focus_color : '#e74032'},
				]}>
				{storeState.folder.type === 'local' ? (
					<BsUpload size={20} color="#fff" />
				) : (
					<BsTrash size={20} color="#fff" />
				)}
			</Pressable>
		</>
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
});
