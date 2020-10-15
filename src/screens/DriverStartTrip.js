import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    Dimensions,
    TouchableWithoutFeedback,
    AsyncStorage,
    Linking,
    TouchableOpacity
} from 'react-native';
import { MapComponent, TripStartModal } from '../components';
import { Button, Header, Icon } from 'react-native-elements';
import { colors } from '../common/theme';
import { RequestPushMsg } from '../common/RequestPushMsg';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import * as firebase from 'firebase';
import languageJSON from '../common/language';
var { width, height } = Dimensions.get('window');
import dateStyle from '../common/dateStyle';
import getDirections from 'react-native-google-maps-directions'
export default class DriverStartTrip extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            region: {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.9922,
                longitudeDelta: 0.9421,
            },
            mediaSelectModal: false,
            allData: "",
            inputCode: "",
            pushSent:false
        }
    }

    componentWillMount() {
        const allDetails = this.props.navigation.getParam('allDetails')
        console.log(allDetails);
        this.setState({
            rideDetails: allDetails,
            region: {
                latitude: allDetails.pickup.lat,
                longitude: allDetails.pickup.lng,
                latitudeDelta: 0.9922,
                longitudeDelta: 0.9421,
            },
            curUid: firebase.auth().currentUser.uid
        }, () => {
            this.checkStaus()
        })
        setInterval(this.updateLocation.bind(this), 10000);
    }

    checkStaus() {
        let tripRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/my_bookings/' + this.state.rideDetails.bookingId + '/');
        tripRef.on('value', (snap) => {
            let tripData = snap.val();
            console.log('tripData', tripData)
            if (tripData) {
                this.setState({ status: tripData.status })
                if (tripData.status == "CANCELLED") {
                    this.props.navigation.navigate('DriverTripAccept');
                    alert(languageJSON.rider_ride_cancel_text)
                }
            }
        })

        // console.log('curuser',firebase.auth().currentUser.uid)
    }


    GetDistance = (lat1, lon1, lat2, lon2) => {
        if ((lat1 === lat2) && (lon1 === lon2)) {
            return 0;
        }
        else {
            var radlat1 = Math.PI * lat1 / 180;
            var radlat2 = Math.PI * lat2 / 180;
            var theta = lon1 - lon2;
            var radtheta = Math.PI * theta / 180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180 / Math.PI;
            dist = dist * 60 * 1.1515;
            dist = dist * 1.609344;
            return dist;
        }
    };

    updateLocation = async () => {
        if (this.state.status == 'ACCEPTED') {

            let { status } = await Location.requestPermissionsAsync();
            if (status !== 'granted') {
                console.log('i am called')
                this.setState({
                    errorMessage: 'Permission to access location was denied',
                });
            }

            let location = await Location.getCurrentPositionAsync({});

            firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/location').update({
                lat: location.coords.latitude,
                lng: location.coords.longitude,
            })

            if(!this.state.pushSent){
                let distance = this.GetDistance(location.coords.latitude,location.coords.longitude,this.state.region.latitude,this.state.region.longitude);
                if(distance<0.05){
                    const customerRoot = firebase.database().ref('users/' + this.state.rideDetails.customer);
                    customerRoot.once('value', customerData => {
                        if (customerData.val()) {
                            let allData = customerData.val()
                            RequestPushMsg(allData.pushToken ? allData.pushToken : null, languageJSON.driver_reached)
                        }
                    })
                    this.setState({...this.state, pushSent:true});
                }
            }
            

        }
    };

    //start trip button press function
    onPressStartTrip(item) {
        this.setState({ allData: item }, () => {
            console.log(this.state.allData);
            if (this.state.allData.otp) {
                this.setState({ mediaSelectModal: true })
            } else {
                this.codeEnter(false, this.state.allData.otp);
            }
            //this.setState({mediaSelectModal:true})
        });


    }
    closeModal() {
        this.setState({ mediaSelectModal: false })
    }

    chat() {
        this.props.navigation.navigate("Chat", { passData: this.state.rideDetails });
    }

    callToCustomer(data) {
        if (data.customer) {
            const cusData = firebase.database().ref('users/' + data.customer);
            cusData.once('value', customerData => {
                if (customerData.val() && customerData.val().mobile) {
                    var customerPhoneNo = customerData.val().mobile
                    Linking.canOpenURL('tel:' + customerPhoneNo).then(supported => {
                        if (!supported) {
                            console.log('Can\'t handle Phone Number: ' + customerPhoneNo);
                        } else {
                            return Linking.openURL('tel:' + customerPhoneNo);
                        }
                    }).catch(err => console.error('An error occurred', err));
                } else {
                    alert(languageJSON.mobile_no_found)
                }
            })
        }

    }
    //Promo code enter function
    codeEnter(codeRequired, inputCode) {
        if (codeRequired && (inputCode == "" || inputCode == undefined || inputCode == null)) {
            alert("Please enter OTP");
        } else {
            if (this.state.allData) {
                if ((codeRequired && inputCode == this.state.allData.otp) || !codeRequired) {
                    var data = {
                        status: "START",
                        payment_status: "DUE",
                        trip_start_time: new Date().toLocaleTimeString(dateStyle),
                    }

                    var riderData = {
                        status: "START",
                        payment_status: "DUE",
                        trip_start_time: new Date().toLocaleTimeString(dateStyle),
                    }

                    let dbRef = firebase.database().ref('users/' + this.state.curUid + '/my_bookings/' + this.state.allData.bookingId + '/');
                    dbRef.update(data).then(() => {
                        firebase.database().ref('bookings/' + this.state.allData.bookingId + '/').update(data).then(() => {
                            let userDbRef = firebase.database().ref('users/' + this.state.allData.customer + '/my-booking/' + this.state.allData.bookingId + '/');
                            userDbRef.update(riderData).then(() => {
                                this.closeModal();
                                let startTime = new Date().getTime().toString();
                                AsyncStorage.setItem('startTime', startTime);
                                this.props.navigation.navigate('DriverTripComplete', { allDetails: this.state.allData, startTime: startTime });
                                
                                this.sendPushNotification(this.state.allData.customer, this.state.allData.bookingId);
                            })
                        })
                    })

                } else {
                    alert(languageJSON.otp_error);
                }

            }
        }

    }

    sendPushNotification(customerUID, bookingId) {
        const customerRoot = firebase.database().ref('users/' + customerUID);
        customerRoot.once('value', customerData => {
            if (customerData.val()) {
                let allData = customerData.val()
                RequestPushMsg(allData.pushToken ? allData.pushToken : null, languageJSON.driver_journey_err + bookingId)
            }
        })
    }

    navigateToPickup(){

            const data = {
                destination: {
                    latitude: this.state.region.latitude,
                    longitude: this.state.region.longitude
                },               
                destination: {
                    latitude: this.state.rideDetails.pickup.lat,
                    longitude: this.state.rideDetails.pickup.lng
                },
                params: [
                    {
                        key: "travelmode",
                        value: "driving"        // may be "walking", "bicycling" or "transit" as well
                    },
                    {
                        key: "dir_action",
                        value: "navigate"       // this instantly initializes navigation using the given travel mode
                    }
                ],
            }
    
            getDirections(data)
    }

    render() {
        return (
            <View style={styles.containerView}>
                <Header
                    backgroundColor={colors.GREY.default}
                    leftComponent={{ icon: 'md-menu', type: 'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback, onPress: () => { this.props.navigation.toggleDrawer(); } }}
                    centerComponent={<Text style={styles.headerTitleStyle}>{languageJSON.on_trip}</Text>}
                    containerStyle={styles.headerStyle}
                    innerContainerStyles={styles.innerContStyle}
                />

                <View style={styles.segment1}>
                    <Text style={styles.textContainer}>{this.state.rideDetails.pickup.add}</Text>
                </View>

                <View style={styles.segment2}>
                    <MapComponent mapStyle={styles.map} mapRegion={this.state.region} markerCord={this.state.region} />
                    <TouchableOpacity
                        style={styles.NavfloatButtonStyle}
                        onPress={() => this.navigateToPickup()}
                    >
                        <Icon
                            name="ios-navigate"
                            type="ionicon"
                            // icon: 'chat', color: '#fff',
                            size={30}
                            color={colors.WHITE}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.CallfloatButtonStyle}
                        onPress={() => this.callToCustomer(this.state.rideDetails)}
                    >
                        <Icon
                            name="ios-call"
                            type="ionicon"
                            // icon: 'chat', color: '#fff',
                            size={30}
                            color={colors.WHITE}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.ChatfloatButtonStyle}
                        onPress={() => this.chat()}
                    >
                        <Icon
                            name="ios-chatbubbles"
                            type="ionicon"
                            // icon: 'chat', color: '#fff',
                            size={30}
                            color={colors.WHITE}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.segment3}>
                    <View style={styles.segment3Style}>
                        <View style={styles.segView}>
                            <Image source={require('../../assets/images/alarm-clock.png')} resizeMode={'contain'} style={{ width: 38, height: height / 15 }} />
                        </View>
                        <View style={styles.riderTextStyle}>
                            <Text style={styles.riderText}>{this.state.pushSent?languageJSON.wait_for_rider:languageJSON.drive_to_pickup}</Text>
                            <Text style={styles.riderTextSubheading}>{this.state.pushSent?languageJSON.rider_notified:languageJSON.rider_is_waiting}</Text>
                        </View>
                    </View>

                    <View style={styles.newViewStyle} />

                    <View style={styles.fixContenStyle}>
                        <Button
                            title={languageJSON.start_trip}
                            onPress={() => {
                                this.onPressStartTrip(this.state.rideDetails)
                            }}
                            titleStyle={{ fontFamily: 'Roboto-Bold' }}
                            buttonStyle={styles.myButtonStyle}
                        />
                    </View>
                </View>
                <TripStartModal
                    modalvisable={this.state.mediaSelectModal}
                    requestmodalclose={() => { this.closeModal() }}
                    onChangeText={text => this.setState({ inputCode: text })}
                    enterCode={() => this.codeEnter(true, this.state.inputCode)}
                />

            </View>
        );
    }
}

//Screen Styling
const styles = StyleSheet.create({
    containerView: {
        flex: 1,
        backgroundColor: colors.GREY.btnSecondary,
        //marginTop: StatusBar.currentHeight
    },
    textContainer: {
        textAlign: "center",
        fontSize: 16.2,
        color: colors.BLUE.dark,
        fontFamily: 'Roboto-Medium',
        lineHeight: 22
    },
    headerStyle: {
        backgroundColor: colors.GREY.default,
        borderBottomWidth: 0
    },
    headerTitleStyle: {
        color: colors.WHITE,
        fontFamily: 'Roboto-Bold',
        fontSize: 20
    },
    segment1: {
        width: '97.4%',
        flex: 1,
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: colors.WHITE,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        paddingTop: 12,
        paddingBottom: 12,
        paddingRight: 8,
        paddingLeft: 8
    },
    segment2: {
        flex: 7.5,
        width: '97.4%',
        alignSelf: 'center',
        borderRadius: 10,
        backgroundColor: colors.WHITE,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        paddingTop: 12,
        paddingBottom: 12,
        paddingRight: 8,
        paddingLeft: 8,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    riderText: { alignSelf: "flex-start", fontSize: 16.2, color: colors.BLUE.dark, fontFamily: 'Roboto-Medium' },
    riderTextSubheading: { alignSelf: "flex-start", fontSize: 14, color: colors.BLUE.sky, fontFamily: 'Roboto-Medium' },
    segment3: {
        flex: 2.5,
        borderRadius: 10,
        backgroundColor: colors.WHITE,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        marginBottom: 5,
        paddingTop: 12,
        paddingBottom: 3,
        paddingRight: 8,
        paddingLeft: 8,
        alignItems: 'center'
    },
    map: {
        flex: 1,
        borderRadius: 10,
        ...StyleSheet.absoluteFillObject,
    },
    innerContainerStyles: {
        marginLeft: 10,
        marginRight: 10
    },
    segment3Style: {
        flex: 0.6,
        flexDirection: 'row',
        alignItems: 'center'
    },
    segView: {
        flex: 3,
        alignItems: 'flex-end'
    },
    riderTextStyle: {
        flex: 7,
        paddingLeft: 15
    },
    newViewStyle: {
        width: '100%',
        height: 1,
        backgroundColor: colors.GREY.secondary
    },
    fixContenStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    myButtonStyle: {
        backgroundColor: colors.GREEN.default,
        width: width - 40,
        padding: 8,
        borderColor: colors.TRANSPARENT,
        borderWidth: 0,
        borderRadius: 5,
        elevation: 0,
        marginTop: 4
    },
    NavfloatButtonStyle: {
        borderWidth: 1,
        borderColor: colors.BLACK,
        alignItems: "center",
        justifyContent: "center",
        width: 60,
        position: "absolute",
        bottom: 150,
        right: 10,
        height: 60,
        backgroundColor: colors.BLACK,
        borderRadius: 30
    },
    CallfloatButtonStyle: {
        borderWidth: 1,
        borderColor: colors.BLACK,
        alignItems: "center",
        justifyContent: "center",
        width: 60,
        position: "absolute",
        bottom: 80,
        right: 10,
        height: 60,
        backgroundColor: colors.BLACK,
        borderRadius: 30
    },
    ChatfloatButtonStyle: {
        borderWidth: 1,
        borderColor: colors.BLACK,
        alignItems: "center",
        justifyContent: "center",
        width: 60,
        position: "absolute",
        bottom: 10,
        right: 10,
        height: 60,
        backgroundColor: colors.BLACK,
        borderRadius: 30
    },

});