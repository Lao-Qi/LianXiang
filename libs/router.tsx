import React, {createContext, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {SharePage, ServerPage} from './pages';

/** 路由配置 */
const RouterConfig = {
	defaultPath: 'resource',
	pages: {
		resource: {
			title: 'Resource',
			path: 'resource',
			mainView: true,
			Component: SharePage,
		},
		server: {
			title: 'Server',
			path: 'server',
			mainView: true,
			Component: ServerPage,
		},
	},
};

type RouteConfigType = {
	title: string;
	path: string;
	mainView: boolean;
	Component: () => React.JSX.Element;
};

export type Paths = keyof typeof RouterConfig.pages;

type RouterContextType = {
	currentPath: Paths;
	TogglePage(path: Paths): void;
	GetPageConfig(path: Paths): RouteConfigType;
};

function GetPageConfig(path: Paths): RouteConfigType {
	return RouterConfig.pages[path];
}

export const RouterContext = createContext<RouterContextType>({
	currentPath: RouterConfig.defaultPath as Paths,
	TogglePage(_path: Paths) {},
	GetPageConfig,
});

export function RouterContextProvider({children}: PropsWithChildren) {
	const [currentPath, TogglePage] = useState(RouterConfig.defaultPath as Paths);
	return <RouterContext.Provider value={{currentPath, GetPageConfig, TogglePage}}>{children}</RouterContext.Provider>;
}
