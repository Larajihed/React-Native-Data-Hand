import React, { Component } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { Button } from 'react-native-elements';
import Colors from '../../style/Colors';
import { StyleTemplates } from '../../style/Styles';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationStackOptions } from 'react-navigation-stack';
import RBSheet from "react-native-raw-bottom-sheet";
import { ConfigurationPanel } from './settings/ConfigurationPanel';
import { Sizes } from '../../style/Sizes';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Logo } from '../Logo';
import { PropsWithNavigation } from '../../PropsWithNavigation';
import { voiceDictator } from '../../speech/VoiceDictator';
import { DictationResult } from '../../speech/types';
import { VoiceInputButton } from '../speech/VoiceInputButton';
import { SpeechInputPopup } from '../speech/SpeechInputPopup';
import { SpeechCommandSession, SessionStatus, TerminationPayload, TerminationReason } from '../../speech/SpeechCommandSession';

const appBarIconStyles = {
    buttonStyle: {
        width: 36,
        height: 36,
        padding: 0,
        paddingTop: 2,
        paddingLeft: 1,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.lightFormBackground
    } as any,
    iconSize: 20,
    iconColor: Colors.textColorLight
}

interface State{
    isLoading: boolean,
    dictationResult: DictationResult,
    speechCommandSessionStatus: SessionStatus
}

export class HomeScreen extends React.Component<PropsWithNavigation, State> {

    static navigationOptions = ({ navigation }) => ({
        headerLeft: (<Logo />),
        headerLeftContainerStyle: { paddingLeft: Sizes.horizontalPadding },
        headerRight: (
            <View style={{
                flexDirection: 'row', alignItems: 'center',
                paddingRight: 12
            }}>
                <Button
                    buttonStyle={appBarIconStyles.buttonStyle}
                    containerStyle={{ marginRight: 8 }}
                    icon={
                        <AntDesignIcon name="setting" size={appBarIconStyles.iconSize} color={appBarIconStyles.iconColor} />
                    }
                    onPress={() => {
                        navigation.getParam('openConfigSheet')()
                    }} />

                <Button
                    buttonStyle={{ ...appBarIconStyles.buttonStyle, backgroundColor: Colors.accent }}
                    icon={
                        <MaterialIcon name="more-horiz" size={appBarIconStyles.iconSize} color="white" />
                    }
                    onPress={() => {
                        navigation.navigate("MeasureSettings")
                    }} />
            </View>
        )
    } as NavigationStackOptions)

    private _configSheetRef: RBSheet = null

    private _speechPopupRef: SpeechInputPopup = null

    private _currentSpeechCommandSession: SpeechCommandSession = null

    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            dictationResult: null,
            speechCommandSessionStatus: SessionStatus.Idle
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({
            openConfigSheet: this._openConfigSheet,
        })
    }

    async componentWillUnmount() {
        await voiceDictator.uninstall()

        if (this._currentSpeechCommandSession) {
            this._currentSpeechCommandSession.dispose()
        }
    }

    private async startNewSpeechCommandSession() {
        if (this._currentSpeechCommandSession == null) {
            this._currentSpeechCommandSession = new SpeechCommandSession(
                (status, payload) => {
                    console.log("status:", status)
                    this.setState({...this.state, speechCommandSessionStatus: status})
                    switch (status) {
                        case SessionStatus.Starting:
                            this._speechPopupRef.show()
                            break;
                        case SessionStatus.Analyzing:
                            this._speechPopupRef.hide()
                            break;
                        case SessionStatus.Terminated:
                            const terminationPayload: TerminationPayload = payload as TerminationPayload
                            console.log("termination reason:", terminationPayload.reason)
                            if(terminationPayload.reason === TerminationReason.Success){

                            }else{
                            }
                            this.setState({...this.state, 
                                dictationResult: null,
                                speechCommandSessionStatus: null
                            })
                            this._currentSpeechCommandSession.dispose()
                            this._currentSpeechCommandSession = null
                            break;
                    }
                },
                (output: DictationResult) => {
                    this.setState({
                        ...this.state,
                        dictationResult: output
                    })
                }
            )
            await this._currentSpeechCommandSession.requestStart()
        }
    }

    private async stopSpeechInput() {
        if (this._currentSpeechCommandSession) {
            await this._currentSpeechCommandSession.requestStopListening()
        }
    }

    _closeConfigSheet = () => {
        if (this._configSheetRef) {
            this._configSheetRef.close()
        }
    }


    _openConfigSheet = () => {
        if (this._configSheetRef) {
            this._configSheetRef.open()
        }
    }

    render() {
        return (
            <LinearGradient
                style={{ flex: 1, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' }}
                colors={Colors.lightBackgroundGradient}>

                <View
                    style={{ flex: 1, alignSelf: 'stretch' }}
                >

                    <SpeechInputPopup ref={ref => this._speechPopupRef = ref} dictationResult={this.state.dictationResult} />

                </View>

                <SafeAreaView style={{
                    alignSelf: 'stretch', /*backgroundColor: 'white',
                    shadowColor: 'black',
                    shadowOffset: { width: 0, height: -1 },
                    shadowRadius: 2,
                    shadowOpacity: 0.07*/
                }}>
                    <VoiceInputButton containerStyle={{ alignSelf: 'center' }}
                        isBusy={this.state.speechCommandSessionStatus != SessionStatus.Terminated && this.state.speechCommandSessionStatus >= SessionStatus.Analyzing}
                        onTouchDown={async () => {
                            await this.startNewSpeechCommandSession()
                        }}
                        onTouchUp={async () => {
                            this._speechPopupRef.hide()
                            await this.stopSpeechInput()
                        }} />
                </SafeAreaView>

                <RBSheet ref={
                    ref => {
                        this._configSheetRef = ref
                    }}
                    duration={240}
                    animationType="fade"
                    customStyles={
                        {
                            container: {
                                borderTopStartRadius: 8,
                                borderTopEndRadius: 8,
                                backgroundColor: Colors.lightBackground
                            }
                        }
                    }
                >

                    <View style={{
                        flexDirection: 'row',
                        padding: Sizes.horizontalPadding,
                        paddingTop: Sizes.verticalPadding,
                        paddingRight: 10,
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Text style={StyleTemplates.titleTextStyle}>Settings</Text>
                        <Button buttonStyle={{
                            backgroundColor: 'transparent'
                        }}
                            icon={<AntDesignIcon name="closecircle" size={26} color={Colors.lightFormBackground} />}
                            onPress={() => this._closeConfigSheet()}
                        />
                    </View>
                    <ConfigurationPanel />
                </RBSheet>
            </LinearGradient>
        );
    }
}
