import {useState, createContext} from 'react';
import type {PropsWithChildren, SetStateAction, Dispatch} from 'react';
import {StoreDeviceType, StoreFileType} from './utils';

type StoreType = {
	scan: {
		content: string;
	};
	folder: StoreDeviceType & {
		type: 'local' | 'remote';
	};
	fileInfo: {
		address: string;
		size: number;
		type: string;
		uuid: string;
		name: string;
		showType: 'local' | 'remote';
	} | null;
	folderFiles: StoreFileType[];
	devices: StoreDeviceType[];
};

/** 存储库默认配置 */
const StoreDefaultState: StoreType = {
	// 扫码内容
	scan: {
		content: '',
	},
	// 资源目录配置
	folder: {
		uuid: '',
		address: '',
		addTime: 0,
		type: 'local',
	},
	fileInfo: null,
	folderFiles: [],
	// 已连接的共享设备列表
	devices: [],
};

type StoreContextType = {
	storeState: StoreType;
	ChangeStoreState: Dispatch<SetStateAction<StoreType>>;
};

export const StoreContext = createContext<StoreContextType>({
	storeState: StoreDefaultState,
	ChangeStoreState: () => {},
});

export function StoreContextProvider({children}: PropsWithChildren) {
	const [storeState, ChangeStoreState] = useState(StoreDefaultState);
	return <StoreContext.Provider value={{storeState, ChangeStoreState}}>{children}</StoreContext.Provider>;
}
