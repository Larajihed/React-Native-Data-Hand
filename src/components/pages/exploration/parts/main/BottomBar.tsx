import React from 'react';
import { View, SafeAreaView, StyleSheet, Dimensions, TouchableOpacity, Text, Platform } from 'react-native';
import Colors from '../../../../../style/Colors';
import { Sizes } from '../../../../../style/Sizes';
import { StyleTemplates } from '../../../../../style/Styles';
import Svg, { Path } from 'react-native-svg';
import { VoiceInputButton } from '../../../../exploration/VoiceInputButton';
import { ExplorationMode } from '../../../../../core/exploration/types';
import { useSelector } from 'react-redux';
import { ReduxAppState } from '../../../../../state/types';
import { SpeechRecognizerSessionStatus } from '../../../../../state/speech/types';
import { useSafeArea } from 'react-native-safe-area-context';
import { ZIndices } from '../zIndices';

const bottomBarIconSize = 21

const Styles = StyleSheet.create({
    selectMeasureContainerStyle: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Sizes.verticalPadding
    },
    selectMeasureMainMessageStyle: {
        ...StyleTemplates.titleTextStyle,
        color: Colors.textColorLight
    },

    bottomBarContainerStyle: {
        backgroundColor: "#F5F5F5",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: -1 },
        shadowRadius: 3,
        elevation: 4,
        overflow: "visible",
        borderTopColor: Platform.OS === 'android' ? '#00000020' : null,
        borderTopWidth: Platform.OS === 'android' ? 1 : null,
    },

    bottomBarInnerListStyle: {
        flexDirection: 'row',
        padding: 0
    },

    bottomBarButtonContainerStyle: {
        alignSelf: 'stretch', alignItems: 'center'
    },

    bottomBarButtonStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    bottomBarButtonTextStyle: {
        marginTop: 5,
        fontSize: 10
    },

    bottomBarVoiceButtonContainerStyle: {
        position: 'absolute',
        top: -14,
        left: Math.round((Dimensions.get('window').width - Sizes.speechInputButtonSize) / 2),
        zIndex: ZIndices.Footer
    }
})

interface Props {
    mode: ExplorationMode,
    onModePressIn?: (mode: ExplorationMode) => void,
    onModePressOut?: (mode: ExplorationMode) => void,
    onModePress?: (mode: ExplorationMode) => void,
    onVoiceButtonPressIn?: () => void,
    onVoiceButtonPressOut?: () => void
}

export const BottomBar = (props: Props) => {
    const speechSessionStatus = useSelector((state: ReduxAppState) => state.speechRecognizerState.status)

    return <View style={Styles.bottomBarContainerStyle} removeClippedSubviews={false}>
        <SafeAreaView style={Styles.bottomBarInnerListStyle}>
            <BottomBarButton isOn={props.mode === 'browse'} title="Browse" mode={ExplorationMode.Browse} onPress={() => { props.onModePress(ExplorationMode.Browse) }} />
            <BottomBarButton isOn={props.mode === 'compare'} title="Compare" mode={ExplorationMode.Compare} onPress={() => { props.onModePress(ExplorationMode.Compare) }} />
            <View style={Styles.bottomBarVoiceButtonContainerStyle}>
                <VoiceInputButton isBusy={speechSessionStatus === SpeechRecognizerSessionStatus.Analyzing} onTouchDown={props.onVoiceButtonPressIn} onTouchUp={props.onVoiceButtonPressOut} />
            </View>
        </SafeAreaView>
    </View>
}


const BottomBarButton = (prop: { isOn: boolean, mode: ExplorationMode, title: string, onPress?: () => void }) => {
    //const color = prop.isOn === true ? Colors.primary : Colors.chartLightText
    const color = Colors.textGray

    const insets = useSafeArea()

    return <View style={{
        ...Styles.bottomBarButtonStyle,
        paddingTop: insets.bottom > 0 ? 12 : 0,
        height: insets.bottom > 0 ? 45 : 70,
    }}>
        {/*prop.isOn===true && <View style={{
                    height: 2, 
                    backgroundColor: Colors.primary, 
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0
                }}/>*/}
        <TouchableOpacity style={Styles.bottomBarButtonContainerStyle} onPress={prop.onPress}>

            {
                prop.mode == 'compare' && <Svg width={bottomBarIconSize} height={bottomBarIconSize} viewBox="0 0 153.04 193.85">
                    <Path id="Rectangle_763" data-name="Rectangle 763"
                        d="M54,24.09h51a10.21,10.21,0,0,1,10.2,10.21V218H43.79V34.3A10.21,10.21,0,0,1,54,24.09Z"
                        transform="translate(-43.79 -24.09)"
                        fill={color}
                    />
                    <Path id="Rectangle_764" data-name="Rectangle 764" d="M135.62,85.31h51a10.2,10.2,0,0,1,10.2,10.2V218H125.41V95.51A10.21,10.21,0,0,1,135.62,85.31Z"
                        transform="translate(-43.79 -24.09)"
                        fill={color}
                    />
                </Svg>
            }
            {
                prop.mode == 'browse' && <Svg width={bottomBarIconSize} height={bottomBarIconSize} viewBox="0 0 215.64 215.63">
                    <Path id="Icon_material-pie-chart" data-name="Icon material-pie-chart" d="M108.38,12.21V227.82a108.4,108.4,0,0,1,0-215.61Zm21.88,0v96.92H227A108.28,108.28,0,0,0,130.26,12.21Zm0,118.7v96.92A108.15,108.15,0,0,0,227,130.91Z" transform="translate(-11.33 -12.21)" fill={color} />
                </Svg>
            }
            <Text style={{
                ...Styles.bottomBarButtonTextStyle,
                color: color,
                fontWeight: "bold" /*prop.isOn === true ? "bold" : "normal"*/
            }}>{prop.title}</Text>
        </TouchableOpacity>
    </View>
}