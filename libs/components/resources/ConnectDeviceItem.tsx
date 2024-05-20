import {StyleSheet, Pressable, TextInput, View, Text} from 'react-native';
import {BsDeviceHdd, BsChevronRight} from 'rn-icons/bs';
import {useContext, useEffect, useState} from 'react';
import {ThemeContext} from '../../theme';
import {ToastContext} from '../message/Toast';
import {AppLocalStore, NetWorkUtils} from '../../utils';
import {StoreContext} from '../../store';

type PropsType = {
	address: string;
};

export function ConnectDeviceItem(props: PropsType) {
	const {themeStyle} = useContext(ThemeContext);
	const {ShowToastMessage} = useContext(ToastContext);
	const {ChangeStoreState, storeState} = useContext(StoreContext);
	const [showUrlTextInput, setShowUrlTextInput] = useState(false);
	const [inputConnectAddress, setInputConnectAddress] = useState('');
	const [connectAddress, setConnectAddress] = useState(props.address);

	function HandlePressInputContainer() {
		setShowUrlTextInput(!showUrlTextInput);
	}

	const android_ripple = {
		color: themeStyle.android_ripple_color,
		fontSize: 300,
	};

	/**  校验地址是否为共享服务器*/
	function HandleValidConnectAddress(): Promise<void> {
		return new Promise(res => {
			if (NetWorkUtils.isLocalAddress(connectAddress)) {
				ShowToastMessage('请勿输入本地地址');
				setConnectAddress('');
				return;
			}

			if (!NetWorkUtils.isValidIPAddressAndPortImproved(connectAddress)) {
				ShowToastMessage('地址错误');
				setConnectAddress('');
				return;
			}

			NetWorkUtils.isValidShareServer(connectAddress)
				.then(() => {
					res();
				})
				.catch(err => {
					setConnectAddress('');
					ShowToastMessage(err);
				});
		});
	}

	/** 处理手动输入URL式的连接方式 */
	function HandlePressConnectDevice() {
		if (inputConnectAddress === '') {
			ShowToastMessage('未获取到设备地址');
			return;
		} else {
			setConnectAddress(inputConnectAddress);
			setInputConnectAddress('');
		}
	}

	/**
	 * 实时检测连接地址并加入到本地
	 * 扫码和手动输入都会触发connectAddress的变化
	 */
	useEffect(() => {
		if (connectAddress !== '') {
			HandleValidConnectAddress().then(async () => {
				// 添加到本地存储中
				const device = await AppLocalStore.device.AddDevice(connectAddress);
				// 添加到应用状态中
				const devices = storeState.devices;
				devices.push(device);
				ChangeStoreState({
					...storeState,
					devices: devices,
				});

				setConnectAddress('');
				ShowToastMessage('共享设备连接成功！');
			});
		}
	}, [connectAddress]);

	/** 通过扫码触发的连接方式 */
	useEffect(() => {
		if (props.address !== '') {
			setConnectAddress(props.address);
		}
	}, [props]);

	return (
		<>
			{connectAddress == '' ? (
				<View>
					<Pressable
						onPress={HandlePressInputContainer}
						style={[style.container, style.box]}
						android_ripple={android_ripple}>
						<BsChevronRight
							size={16}
							color={themeStyle.color2}
							style={{transform: [{rotateZ: showUrlTextInput ? '90deg' : '0deg'}]}}
						/>
						<Text style={{fontSize: 16, marginLeft: 10, color: themeStyle.color1}}>通过URL连接</Text>
					</Pressable>
					{showUrlTextInput ? (
						<View style={style.text_input_container}>
							<View
								style={{
									flex: 1,
									display: 'flex',
									flexDirection: 'row',
									alignItems: 'center',
									paddingHorizontal: 10,
									height: 50,
									borderRadius: 5,
									backgroundColor: themeStyle.bgc1,
								}}>
								<Text>http://</Text>
								<TextInput
									keyboardType="number-pad"
									onChange={e => setInputConnectAddress(e.nativeEvent.text)}
									value={inputConnectAddress}
									style={[style.text_input, {flex: 1}]}></TextInput>
							</View>
							<Pressable
								onPress={HandlePressConnectDevice}
								android_ripple={android_ripple}
								style={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									marginLeft: 10,
									width: 70,
									height: 50,
									borderRadius: 5,
									backgroundColor: themeStyle.focus_color,
								}}>
								<Text style={{color: '#fff'}}>连接</Text>
							</Pressable>
						</View>
					) : (
						<></>
					)}
				</View>
			) : (
				<View style={[style.container, style.box]}>
					<BsDeviceHdd size={20} color={themeStyle.color2} />
					<Text style={{marginLeft: 5, color: themeStyle.color1, fontSize: 18}}>{connectAddress}</Text>
					<Text style={{marginLeft: 'auto'}}>连接中...</Text>
				</View>
			)}
		</>
	);
}

const style = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	box: {paddingHorizontal: 16, width: '100%', height: 60},
	text_input_container: {
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
		paddingHorizontal: 16,
		paddingBottom: 20,
	},
	text_input: {
		width: '100%',
		height: 40,
	},
});
