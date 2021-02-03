import React, { Component } from "react";
import {
    StyleSheet,
    View,
    ImageBackground,
    Dimensions,
    Text
} from "react-native";
import MaterialButtonDark from "../components/MaterialButtonDark";
import languageJSON from '../common/language';

export default class IntroScreen extends Component {
    static navigationOptions = {
        headerShown:false
    }

    constructor(props) {
        super(props);
    }

    onPressLoginEmail = async () => {
        this.props.navigation.navigate("EmailLogin");
    }

    onPressLoginMobile = async () => {
        this.props.navigation.navigate("MobileLogin");
    }

    render() {
        return (
            <View>
                <Text style={{color:"blue", fontSize:80,marginTop:40, marginStart:73}}>Opp</Text>
                <Text style={{color:"orange", fontSize:70, marginStart:160,marginTop:105, position:"absolute"}}>Up</Text>
                <View style={styles.topSpace}></View>
                <MaterialButtonDark
                    onPress={() => this.onPressLoginEmail()}
                    style={styles.materialButtonDark}
                >{languageJSON.email_login}</MaterialButtonDark>
                <MaterialButtonDark
                    onPress={this.onPressLoginMobile}
                    style={styles.materialButtonDark2}
                >{languageJSON.login_title}</MaterialButtonDark>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    imagebg: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    topSpace: {
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
        height: Dimensions.get('window').height * 0.2,
        width: Dimensions.get('window').width
    },
    materialButtonDark: {
        height: 40,
        marginTop: 20,
        marginLeft: 35,
        marginRight: 35,
        backgroundColor: "blue",
        borderRadius:25
    },
    materialButtonDark2: {
        height: 40,
        marginTop: 14,
        marginLeft: 35,
        marginRight: 35,
        backgroundColor: "blue",
        borderRadius:25
    },    
    actionLine: {
        height: 20,
        flexDirection: "row",
        marginTop: 20,
        alignSelf: 'center'
    },
    actionItem: {
        height: 20,
        marginLeft: 15,
        marginRight: 15,
        alignSelf: "center"
    },
    actionText: {
        fontSize: 15,
        fontFamily: "Roboto-Regular",
        fontWeight: 'bold'
    }
});
