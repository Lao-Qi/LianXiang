import AsyncStorage from "@react-native-async-storage/async-storage"
// https://github.com/uuidjs/uuid#getrandomvalues-not-supported
import "react-native-get-random-values"
import { v4 as uuidv4 } from "uuid"

export type StoreDeviceType = {
	uuid: string
	address: string
	addTime: number
}

export type StoreFileType = {
	uuid: string
	name: string
	type: string
	size: number
	uri: string
	fileCopyUri: string
}

export type DeviceType = Omit<StoreDeviceType, "uuid">

/** 针对APP需要封装AsyncStorage */
export class AppLocalStore {
	static server = {
		async GetPort(): Promise<number> {
			return parseInt(await AsyncStorage.getItem("SERVER_PORT") || "9091") as number
		},
		SetPort(port: number) {
			AsyncStorage.setItem("SERVER_PORT", JSON.stringify(port))
		}
	}

	static device = {
		async GetDevices(): Promise<StoreDeviceType[]> {
			const value = await AsyncStorage.getItem("SHARE_DEVICES")
			let devices: StoreDeviceType[] = []
			if (value) {
				devices = JSON.parse(value)
			}

			return devices
		},
		async AddDevice(address: string): Promise<StoreDeviceType> {
			const device = {
				uuid: uuidv4(),
				addTime: Date.now(),
				address
			}

			const devices = await this.GetDevices()
			devices.push(device)
			await AsyncStorage.setItem("SHARE_DEVICES", JSON.stringify(devices))

			return device
		},
		async RemoveDevice(uuid: string): Promise<StoreDeviceType[]> {
			let devices = await this.GetDevices()
			devices = devices.filter(device => device.uuid !== uuid)
			await AsyncStorage.setItem("SHARE_DEVICES", JSON.stringify(devices))
			return devices
		}
	}

	static files = {
		async GetFiles(): Promise<StoreFileType[]> {

			const value = await AsyncStorage.getItem("SHARE_FILES")
			let files: StoreFileType[] = []
			if (value) {
				files = JSON.parse(value)
			}

			return files
		},
		async AddFile(option: Omit<StoreFileType, "uuid">) {
			const file = {
				...option,
				uuid: uuidv4()
			}
			const files = await this.GetFiles()
			files.push(file)
			await AsyncStorage.setItem("SHARE_FILES", JSON.stringify(files))

			return files
		},
		async RemoveFile(option: StoreFileType) {
			const files = await this.GetFiles();
			const newFiles = files.filter(file => file.uuid !== option.uuid);
			await AsyncStorage.setItem("SHARE_FILES", JSON.stringify(newFiles))

			return newFiles
		}
	}

	static clear(callback?: (error: Error | undefined | null) => Promise<void>) {
		AsyncStorage.clear(callback)
	}
}