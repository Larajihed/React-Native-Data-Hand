import React from 'react';
import { Text, View, Animated, Easing } from 'react-native';
import { Sizes } from '../../style/Sizes';
import LottieView from 'lottie-react-native';
import Colors from '../../style/Colors';
import { DictationResult } from '../../speech/types';

enum AnimationType {
    Show, Hide
}

const AnimatedValues = {
    shadowOffsetHeight: [2, 24],
    opacity: [0, 1],
    bottom: [0, 64]
}

const InterpolationConfigBase = { inputRange: [0, 1] }

interface Props {
    containerStyle?: any,
    dictationResult: DictationResult
}

interface State {
    interpolation: Animated.Value
}

export class SpeechInputPopup extends React.Component<Props, State> {

    private currentAnimation: Animated.CompositeAnimation

    private currentAnimType: AnimationType
    private queuedAnimType: AnimationType

    constructor(props) {
        super(props)
        this.state = {
            interpolation: new Animated.Value(0)
        }
    }

    show() {
        if (this.currentAnimation) {
            if (this.currentAnimType !== AnimationType.Show) {
                this.queuedAnimType = AnimationType.Show
            }
        } else {
            this.currentAnimation = Animated.timing(this.state.interpolation, { toValue: 1, duration: 500, easing: Easing.inOut(Easing.cubic) })
            this.currentAnimType = AnimationType.Show
            this.currentAnimation.start(finished => {
                this.currentAnimation = null
                this.currentAnimType = null
                if(this.queuedAnimType === AnimationType.Hide){
                    this.queuedAnimType = null
                    this.hide()
                }else{
                    this.queuedAnimType = null
                }
            })    
        }
    }

    hide() {

        if (this.currentAnimation) {
            if (this.currentAnimType !== AnimationType.Hide) {
                this.queuedAnimType = AnimationType.Hide
            }
        } else {
            this.currentAnimation = Animated.timing(this.state.interpolation, { toValue: 0, duration: 800, easing: Easing.inOut(Easing.cubic) })
            this.currentAnimType = AnimationType.Hide
            this.currentAnimation.start(finished => {
                this.currentAnimation = null
                this.currentAnimType = null
                if(this.queuedAnimType === AnimationType.Show){
                    this.queuedAnimType = null
                    this.show()
                }else{
                    this.queuedAnimType = null
                }
            })    
        }
    }

    private interpolate(name: string): any {
        return this.state.interpolation.interpolate({ ...InterpolationConfigBase, outputRange: AnimatedValues[name] })
    }

    render() {
        return (
            <Animated.View
                style={{
                    position: 'absolute',
                    left: 40,
                    right: 40,
                    bottom: this.interpolate("bottom"),
                    backgroundColor: Colors.lightBackground,
                    borderRadius: 8,

                    opacity: this.interpolate("opacity"),
                    shadowColor: 'black',
                    shadowOffset: { width: 0, height: this.interpolate("shadowOffsetHeight") },
                    shadowRadius: 12,
                    shadowOpacity: 0.1,
                    padding: 24,
                    paddingTop: 16
                }}>
                <View style={{
                    flexDirection: 'row', alignSelf: 'center',
                    alignItems: 'center',
                    marginBottom: 12
                }}>
                    <LottieView source={require("../../../assets/lottie/5257-loading.json")} autoPlay loop
                        style={{ width: 36, height: 36, transform: [{ translateY: 0.5 }, { scale: 2 }], opacity: 0.8 }} />
                    <Text style={{
                        color: Colors.textColorDark,
                        fontSize: Sizes.titleFontSize,
                        fontWeight: '200'
                    }}>Listening...</Text>
                </View>

                <Text style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: Colors.link,
                    fontSize: Sizes.subtitleFontSize
                }}>
                    {
                        this.props.dictationResult? (this.props.dictationResult.diffResult? 
                            this.props.dictationResult.diffResult.map((diffElm, i) => {
                                if(diffElm.added == null && diffElm.removed == null){
                                    return <Text key={i} >{diffElm.value}</Text>
                                }else if(diffElm.added === true){
                                    return <Text key={i} style={{color: Colors.accent}}>{diffElm.value}</Text>
                                }
                            }) : this.props.dictationResult.text ) : null
                    }
                    _</Text>
            </Animated.View>
        )
    }
}