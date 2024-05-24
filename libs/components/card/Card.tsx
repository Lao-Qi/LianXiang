import {StyleSheet, View, Text} from 'react-native';
import {themeStyle} from '../../theme';
import type {PropsWithChildren} from 'react';

type CardProps = PropsWithChildren & {
	title: string;
};

export function Card({title, children}: CardProps) {
	return (
		<View style={style.card}>
			<Text style={[style.card_title, {color: themeStyle.color3}]}>{title}</Text>
			<View style={[style.card_container, {backgroundColor: themeStyle.bgc2, borderColor: themeStyle.border}]}>
				{children}
			</View>
		</View>
	);
}

const style = StyleSheet.create({
	card: {
		width: '100%',
		height: 'auto',
	},
	card_title: {
		fontSize: 14,
		fontWeight: '700',
		marginBottom: 10,
		marginTop: 24,
		marginLeft: 10,
	},
	card_container: {
		width: '100%',
		height: 'auto',
		borderRadius: 6,
		borderWidth: 1,
		borderStyle: 'solid',
		overflow: 'hidden',
	},
});
