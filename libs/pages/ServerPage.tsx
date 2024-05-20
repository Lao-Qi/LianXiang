import {StyleSheet, View, Text, Pressable, ScrollView} from 'react-native';
import {BsServer, BsPassport, BsGlobe2, BsCopy} from 'rn-icons/bs';
import Clipboard from '@react-native-clipboard/clipboard';
import {useContext, useEffect, useState} from 'react';
import {NetworkInfo} from 'react-native-network-info';
import QRCode from 'react-native-qrcode-svg';
import {Card, ToastContext} from '../components';
import {AppLocalStore} from '../utils';
import {ServerContext} from '../server';
import {ThemeContext} from '../theme';

export function ServerPage() {
	// 上下文状态获取
	const {themeStyle} = useContext(ThemeContext);
	const {ShowToastMessage} = useContext(ToastContext);
	const {shareServer} = useContext(ServerContext);
	// 服务器属性
	const [isServerStart, ChangeServerState] = useState(shareServer?.runing);
	const [serverAddress, ChangeServerAddress] = useState('');
	const [serverPort, ChangeServerPort] = useState(9091);
	shareServer?.runingListener && (shareServer.runingListener = ChangeServerState);

	// 属性配置
	const WhiteAndroidRipple = {
		color: 'rgba(255, 255, 255, 0.2)',
		radius: 300,
	};
	const iconSize = 20;
	const textStyle = {
		color: themeStyle.color2,
		fontSize: 17,
	};

	function HandleCopyAddress() {
		Clipboard.setString(`${serverAddress}:${serverPort}`);
		ShowToastMessage('复制成功');
	}

	// 服务器处理函数
	function HandlePress() {
		if (isServerStart && shareServer) {
			shareServer.stopServer();
			ChangeServerState(false);
		} else if (!isServerStart && shareServer) {
			shareServer.startServer(serverPort);
			ChangeServerState(true);
		}
	}

	useEffect(() => {
		// 获取设备的IPV4地址
		NetworkInfo.getIPV4Address().then(value => {
			if (!value) {
				ShowToastMessage('您的设备未连网络');
				return;
			}

			ChangeServerAddress(value);
		});

		// 获取服务器端口
		AppLocalStore.server
			.GetPort()
			.then(port => {
				ChangeServerPort(port);
			})
			.catch(err => {
				ShowToastMessage('端口获取失败');
				ChangeServerPort(9091);
			});
	});

	return (
		<View style={style.container}>
			<ScrollView>
				<Card title="Server Info">
					<View style={style.server_state_container}>
						{!isServerStart ? (
							<Text style={{fontSize: 16}}>服务器未启动</Text>
						) : (
							<View style={style.server_state}>
								<QRCode value={`${serverAddress}:${serverPort}`} size={120} />
								<Pressable onPress={() => HandleCopyAddress()}>
									<Text
										style={{
											marginTop: 20,
											color: themeStyle.color1,
											fontWeight: '700',
											fontSize: 18,
										}}>
										{`http://${serverAddress}:${serverPort}  `}
										<BsCopy size={iconSize - 4} color={themeStyle.color3} />
									</Text>
								</Pressable>
								<View
									style={{
										width: '100%',
										marginTop: 5,
										paddingHorizontal: 50,
									}}>
									<Text style={{marginBottom: 25}}>点击链接即可直接复制。</Text>
									<Text>请使用要互联的设备扫描二维码或在资源页中输入URL连接该设备。</Text>
								</View>
							</View>
						)}
					</View>
					<View style={[style.card_item, {borderColor: themeStyle.border}]}>
						<View style={style.card_item_field}>
							<BsGlobe2 size={iconSize} color={themeStyle.color3} />
							<Text style={[textStyle, {marginLeft: 5}]}>IP</Text>
						</View>
						<View style={style.card_item_field}>
							<Text style={[textStyle, {marginRight: 5}]}>
								{serverAddress !== '' ? serverAddress : '未获取到地址'}
							</Text>
						</View>
					</View>
					<View style={[style.card_item, {borderColor: themeStyle.border}]}>
						<View style={style.card_item_field}>
							<BsPassport size={iconSize} color={themeStyle.color3} />
							<Text style={[textStyle, {marginLeft: 5}]}>PORT</Text>
						</View>
						<View style={style.card_item_field}>
							<Text style={[textStyle, {marginRight: 5}]}>{serverPort}</Text>
						</View>
					</View>
				</Card>
			</ScrollView>
			<View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150}}>
				<Pressable
					style={[style.button, {backgroundColor: isServerStart ? '#e54133' : themeStyle.focus_color}]}
					android_ripple={WhiteAndroidRipple}
					onPress={HandlePress}>
					<BsServer color="#fff" size={20} style={{marginRight: 8}}></BsServer>
					<Text style={{color: '#fff', fontSize: 18}}>{isServerStart ? '关闭' : '开启'}共享服务器</Text>
				</Pressable>
			</View>
		</View>
	);
}

const style = StyleSheet.create({
	container: {
		width: '100%',
		height: '100%',
		paddingHorizontal: 10,
	},
	header: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
		height: 50,
	},
	header_title: {
		fontSize: 24,
	},
	server_state_container: {
		width: '100%',
		height: 'auto',
		minHeight: 100,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	server_state: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 20,
	},
	button: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		height: 60,
		borderRadius: 20,
		marginTop: 10,
	},
	button_text: {
		color: '#fff',
	},
	card_item: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
		height: 55,
		borderTopWidth: 1,
		borderStyle: 'solid',
		paddingHorizontal: 20,
	},
	card_item_field: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	card_item_field_text: {
		fontSize: 18,
	},
});
