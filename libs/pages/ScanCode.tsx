import {StyleSheet, View, BackHandler} from 'react-native';
import {BsChevronLeft, BsFullscreen} from 'rn-icons/bs';
import {useContext, useEffect, useState} from 'react';
import {RNCamera, BarCodeReadEvent} from 'react-native-camera';
import {RouterContext} from '../router';
import {StoreContext} from '../store';
import {ToastContext} from '../components';

export function ScanCode() {
	const {TogglePage} = useContext(RouterContext);
	const {storeState, ChangeStoreState} = useContext(StoreContext);
	const {ShowToastMessage} = useContext(ToastContext);
	const [camera, changeCamera] = useState<RNCamera | null>(null);

	function onScanResult(event: BarCodeReadEvent) {
		ChangeStoreState({
			...storeState,
			scan: {
				content: event.data,
			},
		});

		camera?.pausePreview();
		TogglePage('resource');
		ShowToastMessage('连接设备中...');
	}

	/**  处理用户调用系统默认的退出操作*/
	const handleUserBack = function () {
		// 关闭摄像头
		camera?.pausePreview();

		// 回到主页
		TogglePage('resource');
		ShowToastMessage('扫码已关闭');
		return true;
	};

	useEffect(() => {
		// 用户调用系统默认的退出操作
		const backHandler = BackHandler.addEventListener('hardwareBackPress', handleUserBack);
		return () => {
			backHandler.remove();
		};
	});

	return (
		<View style={{display: 'flex', width: '100%', height: '100%'}}>
			<RNCamera
				ref={ref => changeCamera(ref)}
				style={{display: 'flex', flex: 1}}
				captureAudio={false}
				barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
				onBarCodeRead={onScanResult}>
				<View style={style.container}>
					<BsChevronLeft onPress={handleUserBack} style={style.backIcon} size={24} color={'#fff'} />
					<BsFullscreen size={230} color={'#fff'} />
				</View>
			</RNCamera>
		</View>
	);
}

const style = StyleSheet.create({
	container: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
	},
	backIcon: {
		position: 'absolute',
		top: 20,
		left: 20,
	},
});
