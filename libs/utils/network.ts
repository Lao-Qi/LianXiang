// import { NetworkInfo } from "react-native-network-info"

export class NetWorkUtils {
	static isLocalAddress(address: string): boolean {
		// return `${NetworkInfo.getIPV4Address()}:9091` === address || `127.0.0.1:9091` === address
		return false
	}

	static IsURL(text: string): boolean {
		return /^(https?:\/\/)/.test(text)
	}

	/**
	 * 校验一个字符串是否为ip:port格式的
	 * @param text 要校验的字符串
	 * @returns 
	 */
	static isValidIPAddressAndPortImproved(text: string): boolean {
		return /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?):([1-9]\d{0,4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/.test(text)
	}

	/**
	 * 校验一个地址是否为共享设备的地址
	 * @param address 
	 */
	static isValidShareServer(address: string): Promise<void> {
		return new Promise((resolve, reject) => {
			// 向服务器请求连接
			fetch(`http:${address}/connect`).then(async res => {
				const data = await res.json()
				if (!data["status"]) {
					return reject("URL不是共享服务器")
				}

				resolve()
			}).catch((err) => {
				console.log(err);
				reject("请求失败，请确保链接正确且对方服务器开启中")
			})
		})
	}
}