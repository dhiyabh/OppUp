import React from 'react';
import { Header } from 'react-native-elements';
import { colors } from '../common/theme';
import { 
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableWithoutFeedback,
    Dimensions,
    Image,
    StatusBar
  } from 'react-native';
  var {width} = Dimensions.get('window'); 
  import * as firebase from 'firebase';
  import  languageJSON  from '../common/language';

export default class AboutPage extends React.Component {
    constructor(props){
        super(props);
        this.state={};
    }

    componentDidMount(){
        const about=firebase.database().ref('About_Us/');
        about.once('value',aboutData=>{
            if(aboutData.val()){
                let data = aboutData.val()
                this.setState(data);
            }
        })
    }

    render() {  
        return (
        
            <View style={styles.mainView}>
                <StatusBar backgroundColor="#bf5d04" hidden={false} barStyle='light-content' translucent={true} />
                <Header 
                    backgroundColor={colors.GREY.default}
                    leftComponent={{icon:'md-menu', type:'ionicon', color:colors.WHITE, size: 30, component: TouchableWithoutFeedback,onPress: ()=>{this.props.navigation.toggleDrawer();} }}
                    centerComponent={<Text style={styles.headerTitleStyle}>{languageJSON.about_us}</Text>}
                    containerStyle={styles.headerStyle}
                    innerContainerStyles={{marginLeft:10, marginRight: 10}}
                />
                
           </View>
           
        );
      }
    
}
const styles = StyleSheet.create({
    mainView:{ 
        flex:1, 
        backgroundColor: colors.WHITE, 
        //marginTop: StatusBar.currentHeight,
    } ,
    headerStyle: { 
        backgroundColor: "#d77b28", 
        borderBottomWidth: 0,
        borderRadius:20,
    },
    headerTitleStyle: { 
        color: colors.WHITE,
        fontFamily:'Roboto-Bold',
        fontSize: 20
    },
    aboutTitleStyle:{
        color: colors.BLACK,
        fontFamily:'Roboto-Bold',
        fontSize: 20,
        marginLeft:8,
        marginTop:8
    },
    aboutcontentmainStyle:{
        marginTop:12,
        marginBottom:60
    },
    aboutcontentStyle:{
        color: colors.GREY.secondary,
        fontFamily:'Roboto-Regular',
        fontSize: 15,
        textAlign: "justify",
        alignSelf:'center',
        width:width-20,
        letterSpacing:1,
        marginTop:6,
    },
    contact:{
        marginTop:6,
        marginLeft:8,
        //flexDirection:'row',
        width:"100%",
        marginBottom:30
    },
    contacttype1:{
        textAlign:'left',
        color: colors.GREY.secondary,
        fontFamily:'Roboto-Bold',
        fontSize: 15,
    },
    contacttype2:{
        textAlign:'left',
        marginTop:4,
        color: colors.GREY.secondary,
        fontFamily:'Roboto-Bold',
        fontSize: 15,
    }
})