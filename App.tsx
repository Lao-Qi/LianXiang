import React, {StrictMode} from 'react';
import {
	AppConfigContextProvider,
	AppViewContainer,
	NavigationBar,
	NavigationPage,
	NavigationHeader,
} from './libs/components';

function App(): React.JSX.Element {
	return (
		<StrictMode>
			<AppConfigContextProvider>
				<AppViewContainer>
					<NavigationHeader></NavigationHeader>
					<NavigationPage></NavigationPage>
					<NavigationBar></NavigationBar>
				</AppViewContainer>
			</AppConfigContextProvider>
		</StrictMode>
	);
}

export default App;
