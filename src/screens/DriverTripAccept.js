import React from 'react';
import { Text, View, StyleSheet, Dimensions, FlatList, Modal, TouchableHighlight, TouchableWithoutFeedback, StatusBar } from 'react-native';
import { Button, Header } from 'react-native-elements';
import Polyline from '@mapbox/polyline';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { colors } from '../common/theme';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
var { width, height } = Dimensions.get('window');
import * as firebase from 'firebase'
var { height } = Dimensions.get('window');
var google;
import { RequestPushMsg } from '../common/RequestPushMsg';
import {  registerForPushNotificationsAsync } from '../common/GetPushToken';
import { google_map_key } from '../common/key';
import languageJSON from '../common/language';
import dateStyle from '../common/dateStyle';



export default class DriverTripAccept extends React.Component {


    


    render() {
        return (
              
            <View style={styles.mainViewStyle}>
                <StatusBar backgroundColor="#bf5d04" hidden={false} barStyle='light-content' translucent={true} />
                <Header
                    backgroundColor={colors.GREY.default}
                    leftComponent={{ icon: 'md-menu', type: 'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback, onPress: () => { this.props.navigation.toggleDrawer(); } }}
                    centerComponent={<Text style={styles.headerTitleStyle}>Offres</Text>}
                    containerStyle={styles.headerStyle}
                    innerContainerStyles={styles.headerInnerStyle}
                />
               
                            <View style={styles.listItemView}>
                                <View style={styles.mapcontainer}>
                                    
                                        <Text>entreprise image</Text>

                                </View>

                                <View style={styles.mapDetails}>
                                    <View style={styles.dateView}>
                                        <Text style={styles.listDate}>offre title</Text>
                                    </View>
                                    <View style={styles.addressViewStyle}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={styles.addressViewTextStyle}>offre discription</Text>
                                        </View>
                                        
                                       
                                    </View>

                                    <View style={styles.detailsBtnView}>
                                        <View style={styles.viewFlex1}>
                                            <Button
                                                title="more détails"
                                                titleStyle={styles.titleStyles}
                                                
                                                buttonStyle={{
                                                    backgroundColor: colors.GREEN.light,
                                                    width: height / 4,
                                                    padding: 2,
                                                    borderColor: colors.TRANSPARENT,
                                                    borderWidth: 0,
                                                    borderRadius: 5,
                                                }}
                                                containerStyle={{
                                                    flex: 1,
                                                    alignSelf: 'flex-start',
                                                    paddingLeft: 100
                                                }}
                                            />
                                        </View>
                                    </View>
                                </View>
                                
                            </View>
                       

            </View>

        )
    }



}

//Screen Styling
const styles = StyleSheet.create({
    headerStyle: {
        backgroundColor: "#d77b28",
        borderBottomWidth: 0,
        borderRadius:20,


    },
    headerInnerStyle: {
        marginLeft: 10,
        marginRight: 10,

    },
    headerTitleStyle: {
        color: colors.WHITE,
        fontFamily: 'Roboto-Bold',
        fontSize: 20,
    },
    mapcontainer: {
        height: 150,
        borderWidth: 7,
        borderColor: colors.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapDetails: {
        backgroundColor: colors.WHITE,
        flex: 0.8,
        flexDirection: 'column',
    },
    map: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden'
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: colors.TRANSPARENT,
        borderStyle: 'solid',
        borderLeftWidth: 9,
        borderRightWidth: 9,
        borderBottomWidth: 10,
        borderLeftColor: colors.TRANSPARENT,
        borderRightColor: colors.TRANSPARENT,
        borderBottomColor: colors.YELLOW.secondary,
        transform: [
            { rotate: '180deg' }
        ]
    },
    signInTextStyle: {
        fontFamily: 'Roboto-Bold',
        fontWeight: "700",
        color: colors.WHITE
    },
    listItemView: {
        flex: 0.6,
        width: '100%',
         height: 100,
        flexDirection: 'column',
    },
    dateView: {
        flex: 1.1
    },
    listDate: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingLeft: 10,
        color: colors.GREY.default,
        flex: 1
    },
    addressViewStyle: {
        flex: 2,
        paddingLeft: 10
    },
    addressViewTextStyle: {
        color: colors.GREY.secondary,
        fontSize: 15,
        marginLeft: 15,
        lineHeight: 24
        , flexWrap: "wrap",
    },
    greenDot: {
        backgroundColor: colors.GREEN.default,
        width: 10,
        height: 10,
        borderRadius: 50
    },
    redDot: {
        backgroundColor: colors.RED,
        width: 10,
        height: 10,
        borderRadius: 50
    },
    detailsBtnView: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: width,
        marginTop: 10,
        marginBottom: 10
    },

    modalPage: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalMain: {
        flex: 1,
        backgroundColor: colors.GREY.background,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        width: '80%',
        backgroundColor: colors.WHITE,
        borderRadius: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 15,
        flex: 1,
        maxHeight: 180
    },
    modalHeading: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalBody: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalFooter: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        borderTopColor: colors.GREY.iconPrimary,
        borderTopWidth: 1,
        width: '100%',
    },
    btnStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainViewStyle: {
        flex: 1,
        //marginTop: StatusBar.currentHeight
    },
    fixAdressStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    myButtonStyle: {
        backgroundColor: colors.RED,
        width: height / 6,
        padding: 1,
        borderColor: colors.TRANSPARENT,
        borderWidth: 0,
        borderRadius: 5,
    },
    alertStyle: {
        fontWeight: 'bold',
        fontSize: 18,
        width: '100%',
        textAlign: 'center'
    },
    cancelTextStyle: {
        color: colors.BLUE.secondary,
        fontSize: 18,
        fontWeight: 'bold',
        width: "100%",
        textAlign: 'center'
    },
    okStyle: {
        color: colors.BLUE.secondary,
        fontSize: 18,
        fontWeight: 'bold'
    },
    viewFlex1: {
        flex: 1,
        alignSelf: 'center'
    },
    clickText: {
        borderRightColor: colors.GREY.iconPrimary,
        borderRightWidth: 1
    },
    titleStyles: {
        width: "100%",
        alignSelf: 'center'
    }
});