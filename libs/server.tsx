import {PropsWithChildren, createContext} from 'react';
import {BridgeServer} from 'react-native-http-bridge-refurbished';
import {AppLocalStore} from './utils';
import {readFile} from 'react-native-fs';

class ShareServer {
	private server: BridgeServer = new BridgeServer('share_server', __DEV__);
	runingListener: ((runing: boolean) => void) | null = null;
	runing = false;

	constructor() {
		/**
		 * 用于判断当前设备是否是共享设备和共享服务器是否处于开启中
		 */
		this.server.get('/connect', async () => {
			return {
				status: true,
			};
		});

		/** 获取文件列表 */
		this.server.get('/files', async () => {
			const files = await AppLocalStore.files.GetFiles();
			return {
				status: true,
				files,
			};
		});

		this.server.post('/download', async req => {
			console.log('download');
			console.log(req);
			if (!req.postData) {
				return {
					status: false,
				};
			}

			try {
				const data = JSON.parse(req.postData as string);

				console.log('download', data);

				if (!data.uuid) {
					return {
						status: false,
					};
				}

				// 通过uuid获取共享文件
				const files = await AppLocalStore.files.GetFiles();
				const file = files.find(file => file.uuid === data.uuid);

				console.log('download', file);

				if (!file) {
					return {
						status: false,
					};
				}
				const content = await readFile(file.fileCopyUri, 'base64');

				return {
					status: true,
					content,
					name: file.name,
					size: file.size,
					encodeing: 'base64',
				};
			} catch (err) {
				console.log(err);
				return {
					status: false,
				};
			}
		});
	}

	startServer(port: number) {
		this.server.listen(port);
		this.runing = true;
		this.runingListener && this.runingListener(this.runing);
	}

	stopServer() {
		this.server.stop();
		this.runing = false;
		this.runingListener && this.runingListener(this.runing);
	}
}

type StoreContextType = {
	shareServer: ShareServer | null;
};

export const ServerContext = createContext<StoreContextType>({shareServer: null});

/** 使用上下文注册服务器，确保在整个应用的生命周期中都保持着最新的服务器状态 */
export function ServerContextProvider({children}: PropsWithChildren) {
	const server = new ShareServer();

	return <ServerContext.Provider value={{shareServer: server}}>{children}</ServerContext.Provider>;
}
