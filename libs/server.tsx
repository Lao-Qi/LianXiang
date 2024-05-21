import {PropsWithChildren, createContext} from 'react';
import {BridgeServer} from 'react-native-http-bridge-refurbished';
import {AppLocalStore} from './utils';
import {readFile} from 'react-native-fs';

class ShareServer {
	private server: BridgeServer = BridgeServer.server || new BridgeServer('share_server', __DEV__);
	runingListener: ((runing: boolean) => void) | null = null;
	runing = false;

	constructor() {
		this.server.get('/', async (_, res) => {
			res.html(
				'<!DOCTYPE html><html lang="zh-cn"><head><meta charset="UTF-8"/><meta name="viewport"content="width=device-width, initial-scale=1.0"/><title>Document</title><style>*{margin:0;padding:0;box-sizing:border-box}body{display:flex;justify-content:center;align-items:center;background-color:#aaa}main{display:flex;flex-direction:column;width:100vw;max-width:600px;height:100vh}header{display:flex;align-items:center;padding:0 10px;width:100%;height:80px;font-size:20px;font-weight:700;background-color:#fff}.search{position:relative;display:flex;width:100%;height:60px;padding:5px 10px;background-color:#fff;border-bottom:1px solid#ccc}.search input{flex:1;height:100%;border:none;border-radius:5px;padding-left:12px;font-size:16px;outline:none;color:#000;background-color:#f2f2f2}.search input::placeholder{color:#747a7e}.search .button{display:flex;justify-content:center;align-items:center;color:#fff;width:60px;height:100%;border-radius:5px;margin-left:10px;background-color:#482dea}.files{width:100%;height:calc(100%);overflow-x:hidden;overflow-y:auto;background-color:#f2f2f2;padding:10px}.card{width:100%;height:max-content;background-color:#fff;border-radius:10px;border:1px solid#eee}.not-files{justify-content:center}.file-item:nth-child(1){border-top:none}.file-item{display:flex;align-items:center;width:100%;height:60px;padding:0 10px;font-size:18px;border-top:1px solid#eee}.file-item svg{width:26px;height:26px;margin-right:5px}.file-item .go-icon{margin-left:auto}</style></head><body><main><header><div>10.49.57.179:9091</div></header><div class="search"><input class="search-input"type="text"placeholder="请输入文件名"/><div class="button"onclick="SearchFile(event)"ontouchend="SearchFile(event)">搜索</div></div><div class="files"><div class="card"><div class="file-item not-files">获取文件列表中...</div></div></div></main><script>let files=[];function ShowFileInfo(event){event.preventDefault();localStorage.setItem("file_uuid",event.target.dataset.uuid);window.location.href="./fileinfo"}function renderFileEle(files){const card=document.querySelector(".card");card.innerHTML=files.map(file=>{return`<a class="file-item"onclick="ShowFileInfo(event)"ontouchend="ShowFileInfo(event)"data-uuid="${file.uuid}"><svg data-uuid="${file.uuid}"fill="#585f65"class="icon"viewBox="0 0 1024 1024"version="1.1"xmlns="http://www.w3.org/2000/svg"><path d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326z m1.8 562H232V136h302v216c0 23.2 18.8 42 42 42h216v494z"></path></svg>${file.name.length>18?`${file.name.slice(0,15)}...`:file.name}<svg data-uuid="${file.uuid}"fill="#585f65"class="icon go-icon"viewBox="0 0 1024 1024"version="1.1"xmlns="http://www.w3.org/2000/svg"><path d="M394.496 125.333333a32 32 0 0 0-44.672 45.717334l2.346667 2.282666L736.426667 512 352.170667 850.666667a32 32 0 0 0-4.885334 42.602666l2.048 2.56a32 32 0 0 0 42.602667 4.885334l2.56-2.048 411.477333-362.666667a32 32 0 0 0 2.389334-45.653333l-2.389334-2.346667-411.477333-362.666667z"></path></svg></a>`}).join("")}function RenderFiles(){const notFilesEle=document.querySelector(".not-files");const ajax=new XMLHttpRequest();ajax.open("GET","./files");ajax.send();ajax.onreadystatechange=function(){if(ajax.readyState!==4){return}if(ajax.status!==200){notFilesEle.innerHTML="文件列表获取失败";return}const data=JSON.parse(ajax.response);if(!data.status){notFilesEle.innerHTML="文件列表获取失败";return}if(!data.files.length){notFilesEle.innerHTML="暂无共享文件";return}files=data.files;renderFileEle(data.files)};ajax.onerror=function(err){console.log(err);notFilesEle.innerHTML="文件列表获取失败"}}function SearchFile(event){event.preventDefault();const searchInput=document.querySelector(".search-input");if(searchInput.value===""){renderFileEle(files)}else{const regex=new RegExp(`[${searchInput.value.split("").join("].*?[")}].*?`,"i");renderFileEle(files.filter(file=>regex.test(file.name)))}}window.onload=()=>{const title=document.querySelector("header div");title.innerHTML=window.location.host;RenderFiles()};</script></body></html>',
			);
		});

		this.server.get('/fileinfo', async (req, res) => {
			res.html(
				'<!DOCTYPE html><html lang="zh-cn"><head><meta charset="UTF-8"><meta name="viewport"content="width=device-width, initial-scale=1.0"><title>Document</title><style>*{margin:0;padding:0;box-sizing:border-box}body{display:flex;justify-content:center;align-items:center;background-color:#aaa}main{display:flex;flex-direction:column;width:100vw;max-width:600px;height:100vh;background-color:#f2f2f2}header{display:flex;align-items:center;padding:0 10px;width:100%;height:90px;font-size:20px;font-weight:700;background-color:#fff}.file-info{width:100%;height:calc(100%);overflow-x:hidden;overflow-y:auto;padding:10px}.card{width:100%;height:max-content;background-color:#fff;border-radius:10px;border:1px solid#eee;box-shadow:0 2px 8px 4px#eee}.info-item{display:flex;align-items:center;justify-content:space-between;width:100%;height:60px;padding:0 20px;font-size:18px}.not-info{justify-content:center}.download-button{width:100%;height:max-content;padding:0 10px}.download-button div{display:flex;justify-content:center;align-items:center;width:100%;height:60px;color:#fff;font-size:18px;font-weight:700;border-radius:10px;background-color:#482dea;margin-bottom:30px;box-shadow:0 2px 8px 4px#ccc}</style></head><body><main><header><div>10.49.57.179:9091</div></header><div class="file-info"><div class="card"><div class="not-info info-item">获取文件信息中...</div></div></div><div class="download-button"style="display: none;"><div>下载文件</div></div></main><script>window.onload=()=>{const title=document.querySelector("header div");title.innerHTML=window.location.host;RenderFilesInfo()};function DownloadFile(event){event.preventDefault();const ajax=new XMLHttpRequest();ajax.open("POST","./download");ajax.send(JSON.stringify({uuid:localStorage.getItem("file_uuid")}));ajax.onreadystatechange=function(){if(ajax.readyState!==4){return}if(ajax.status!==200){alert("文件下载失败");return}const data=JSON.parse(ajax.response);if(!data.status){alert("文件下载失败");return};downloadFileFromBase64(`data:${data.mimetype};base64,${data.content}`,data.name,data.mimetype)};ajax.onprogress=function(event){console.log(event)};ajax.onerror=function(err){console.log(err);alert("文件下载失败")}};function downloadFileFromBase64(base64Data,filename,contentType){const sliceSize=1024;const byteCharacters=atob(base64Data.split(",")[1]);const byteArrays=[];for(let offset=0;offset<byteCharacters.length;offset+=sliceSize){const slice=byteCharacters.slice(offset,offset+sliceSize);const byteNumbers=new Array(slice.length);for(let i=0;i<slice.length;i++){byteNumbers[i]=slice.charCodeAt(i)}const byteArray=new Uint8Array(byteNumbers);byteArrays.push(byteArray)}const blob=new Blob(byteArrays,{type:contentType});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=filename;a.style.display="none";document.body.appendChild(a);a.click();URL.revokeObjectURL(url);document.body.removeChild(a)};function convertBytesToMBGB(bytes,decimalPlaces=2){if(bytes<1024){return`${bytes}B`}if(bytes<1024*1024){return`${(bytes/1024).toFixed(decimalPlaces)}KB`}if(bytes<1024*1024*1024){return`${(bytes/(1024*1024)).toFixed(decimalPlaces)}MB`}return`${(bytes/(1024*1024*1024)).toFixed(decimalPlaces)}GB`};function RenderFilesInfo(){const card=document.querySelector(".card");const notInfoEle=document.querySelector(".not-info");const downloadButton=document.querySelector(".download-button");const ajax=new XMLHttpRequest();ajax.open("POST","./file_info");ajax.send(JSON.stringify({uuid:localStorage.getItem("file_uuid")}));ajax.onreadystatechange=function(){if(ajax.readyState!==4){return}if(ajax.status!==200){notInfoEle.innerHTML="文件信息获取失败";return}const data=JSON.parse(ajax.response);if(!data.status){notInfoEle.innerHTML="文件信息获取失败";return}const file=data.file;card.innerHTML=`<div class="info-item"><span>名称：</span><span class="info-name">${file.name.length>18?`${file.name.slice(0,15)}...`:file.name}</span></div><div class="info-item"><span>大小：</span><span class="info-size">${convertBytesToMBGB(file.size)}</span></div><div class="info-item"><span>MIME类型：</span><span class="info-mimetype">${file.mimetype}</span></div><div class="info-item"><span>类型：</span><span class="info-type">共享文件</span></div>`;downloadButton.setAttribute("style","display: block;");downloadButton.addEventListener("touchend",DownloadFile);downloadButton.addEventListener("click",DownloadFile)};ajax.onerror=function(err){console.log(err);notInfoEle.innerHTML="文件信息获取失败"}}</script></body></html>',
			);
		});

		this.server.post('/file_info', async (req, res) => {
			if (!req.postData) {
				return {
					status: false,
				};
			}
			try {
				const data = JSON.parse(req.postData as string);
				console.log('file_info', data);
				if (!data.uuid) {
					return {
						status: false,
					};
				}

				const files = await AppLocalStore.files.GetFiles();
				const file = files.find(file => file.uuid === data.uuid);
				if (!file) {
					return {
						status: false,
					};
				}
				return {
					status: true,
					file: {
						uuid: file.uuid,
						name: file.name,
						mimetype: file.type,
						size: file.size,
					},
				};
			} catch (err) {
				console.log(err);
				return {
					status: false,
				};
			}
		});
		/** 用于判断当前设备是否是共享设备和共享服务器是否处于开启中 */
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
				files: files.map(file => {
					return {
						uuid: file.uuid,
						name: file.name,
					};
				}),
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
				if (!data.uuid) {
					return {
						status: false,
					};
				}

				// 通过uuid获取共享文件
				const files = await AppLocalStore.files.GetFiles();
				const file = files.find(file => file.uuid === data.uuid);
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
					mimetype: file.type,
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
		if (this.runing) {
			return;
		}

		this.server.listen(port);
		this.runing = true;
		this.runingListener && this.runingListener(this.runing);
	}

	stopServer() {
		if (!this.runing) {
			return;
		}

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
