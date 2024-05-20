import {ScrollView, StyleSheet, Text, View, Pressable, BackHandler, Alert, PermissionsAndroid} from 'react-native';
import {useContext, useEffect, useState} from 'react';
import RNFS from 'react-native-fs';
import {StoreContext} from '../../store';
import {Card, ToastContext} from '../';
import {ThemeContext} from '../../theme';
import {convertBytesToMBGB} from '../../utils';

export function FileInfo() {
	const {themeStyle} = useContext(ThemeContext);
	const {storeState, ChangeStoreState} = useContext(StoreContext);
	const {ShowToastMessage} = useContext(ToastContext);
	const [downloadState, setDownloadState] = useState(false);
	// 属性配置
	const WhiteAndroidRipple = {
		color: 'rgba(255, 255, 255, 0.2)',
		radius: 300,
	};
	const option = {
		name: '无',
		size: '',
		type: '',
		address: '',
	};

	if (storeState.fileInfo) {
		option.name =
			storeState.fileInfo.name.length >= 18
				? `${storeState.fileInfo.name.slice(0, 15)}...`
				: storeState.fileInfo.name;

		option.size = convertBytesToMBGB(storeState.fileInfo.size);
		option.type = storeState.fileInfo.type;
		option.address = storeState.fileInfo.address === '/' ? '本地文件' : storeState.fileInfo.address;
	}

	async function RequestWritePermission() {
		try {
			const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
				title: '请求向本地写入文件的权限',
				message: '应用程序需要许可。',
				buttonNeutral: '等一下',
				buttonNegative: '取消',
				buttonPositive: '允许',
			});

			if (granted === PermissionsAndroid.RESULTS.GRANTED) {
				return true;
			} else {
				return false;
			}
		} catch (err) {
			console.log(err);
			return false;
		}
	}

	async function DownloadFile() {
		if (downloadState) {
			return;
		}

		// 向用户申请写入权限
		if (!(await RequestWritePermission())) {
			ShowToastMessage('下载文件失败，缺少写入权限');
			return;
		}

		try {
			setDownloadState(true);

			const res = await fetch(`http://${storeState.fileInfo?.address}/download`, {
				method: 'POST',
				body: JSON.stringify({
					uuid: storeState.fileInfo?.uuid,
				}),
			});

			console.log(res);

			const value = await res.json();
			console.log(value);
			if (!value['status']) {
				ShowToastMessage('对方设备异常');
				setDownloadState(false);
				return;
			}

			if (!value['content']) {
				ShowToastMessage('未获取的文件数据');
				setDownloadState(false);
				return;
			}

			await RNFS.writeFile(
				// create a path you want to write to
				// :warning: on iOS, you cannot write into `RNFS.MainBundlePath`,
				// but `RNFS.DocumentDirectoryPath` exists on both platforms and is writable
				`${RNFS.DownloadDirectoryPath}/${value['name']}`,
				value['content'],
				value['encodeing'],
			);

			setDownloadState(false);
			ShowToastMessage(`文件已经下载到 ${RNFS.DownloadDirectoryPath}`);
		} catch (err) {
			console.log(err);
			ShowToastMessage('文件下载失败');
			setDownloadState(false);
		}
	}

	useEffect(() => {
		// 用户调用系统默认的退出操作
		const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
			if (downloadState) {
				Alert.alert('文件下载中，是否退出', '', [
					{
						text: '确定',
						style: 'cancel',
						onPress() {},
					},
					{
						text: '取消',
						style: 'default',
					},
				]);
			}

			ChangeStoreState({
				...storeState,
				fileInfo: null,
			});
			return true;
		});

		return () => {
			backHandler.remove();
		};
	}, []);

	return (
		<View
			style={{
				flex: 1,
				paddingHorizontal: 10,
			}}>
			<ScrollView>
				<Card
					title={`${storeState.fileInfo?.address === '/' ? '' : storeState.fileInfo?.address}/${
						option.name
					}`}>
					<View style={[style.item]}>
						<Text style={{fontSize: 17, color: themeStyle.color1}}>名称：</Text>
						<Text style={{fontSize: 17, color: themeStyle.color1}}>{option.name}</Text>
					</View>
					<View style={[style.item, style.border, {borderTopColor: themeStyle.border}]}>
						<Text style={{fontSize: 17, color: themeStyle.color1}}>大小：</Text>
						<Text style={{fontSize: 17, color: themeStyle.color1}}>{option.size}</Text>
					</View>
					<View style={[style.item, style.border, {borderTopColor: themeStyle.border}]}>
						<Text style={{fontSize: 17, color: themeStyle.color1}}>MIME类型：</Text>
						<Text style={{fontSize: 17, color: themeStyle.color1}}>{option.type}</Text>
					</View>
					<View style={[style.item, style.border, {borderTopColor: themeStyle.border}]}>
						<Text style={{fontSize: 17, color: themeStyle.color1}}>地址：</Text>
						<Text style={{fontSize: 17, color: themeStyle.color1}}>{option.address}</Text>
					</View>
				</Card>
			</ScrollView>
			{storeState.fileInfo?.showType === 'remote' ? (
				<View
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						width: '100%',
						height: 150,
					}}>
					<Pressable
						onPress={DownloadFile}
						android_ripple={WhiteAndroidRipple}
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center',
							width: '100%',
							height: 60,
							borderRadius: 20,
							marginTop: 10,
							backgroundColor: themeStyle.focus_color,
						}}>
						<Text style={{color: '#fff', fontSize: 18}}>
							{downloadState ? '文件下载中...' : '下载文件'}
						</Text>
					</Pressable>
				</View>
			) : (
				<></>
			)}
		</View>
	);
}

const style = StyleSheet.create({
	item: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
		height: 60,
		paddingHorizontal: 30,
	},
	border: {
		borderTopWidth: 1,
		borderStyle: 'solid',
	},
	button: {},
});
