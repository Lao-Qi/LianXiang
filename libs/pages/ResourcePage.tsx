import {useContext, useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Card, DeviceItem, FolderItem, ConnectDeviceItem, FolderContent, FileInfo} from '../components';
import {StoreContext} from '../store';
import {AppLocalStore} from '../utils';

export function ResourcePage() {
	const {storeState, ChangeStoreState} = useContext(StoreContext);
	const [connectAddress, ChangeConnectAddress] = useState('');

	useEffect(() => {
		AppLocalStore.device.GetDevices().then(devices => {
			console.log(devices);

			ChangeStoreState({
				...storeState,
				devices,
			});
		});
	}, []);

	useEffect(() => {
		/** 将扫码获取到的内容通过connectAddress转发给ConnectDeviceItem */
		if (storeState.scan.content !== '') {
			ChangeConnectAddress(storeState.scan.content);
			ChangeStoreState({
				...storeState,
				scan: {
					content: '',
				},
			});
		}
	}, [storeState]);

	return (
		<View
			style={{
				display: 'flex',
				flex: 1,
			}}>
			{/* FileInfo需要在前一步判断 */}
			{storeState.fileInfo ? (
				<FileInfo></FileInfo>
			) : storeState.folder.address ? (
				<FolderContent></FolderContent>
			) : (
				<View style={style.container}>
					<Card title="本地共享资源">
						<FolderItem name="共享目录"></FolderItem>
					</Card>
					<Card title="连接设备">
						<ScrollView>
							<ConnectDeviceItem address={connectAddress} />
							{storeState.devices.map(device => {
								return <DeviceItem device={device} key={device.uuid} />;
							})}
						</ScrollView>
					</Card>
				</View>
			)}
		</View>
	);
}

const style = StyleSheet.create({
	container: {
		paddingHorizontal: 10,
	},
});
