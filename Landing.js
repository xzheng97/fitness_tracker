import React from 'react';
import { createAppContainer } from 'react-navigation';
import {Platform} from 'react-native';
import {createBottomTabNavigator} from 'react-navigation-tabs'
import {createStackNavigator} from 'react-navigation-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Profile from './Profile';
import Button from './Button'
import HomeScreen from './Homescreen'

class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'Profile',
    tabBarIcon: ({ tintColor }) => (
      <Ionicons name={Platform.OS === "ios"?"ios-person":"md-person" } size={30} color={tintColor} style={{bottom:-10}}/>
    )
  };
  render() {
    return (
      <Profile 
          userInfo={this.props.screenProps.userInfo} 
          password ={this.props.screenProps.password} 
          userName = {this.props.screenProps.userName}
          callBacktoLogout = {this.props.screenProps.callBacktoLogout}/>
    );
  }
}

 const bottomNav =  createBottomTabNavigator(
  {
    "Current Day": HomeScreen,
    "Profile": ProfileScreen,
  },
  {
    navigationOptions: ({}),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'white',
      style:{backgroundColor:"rgb(129,150,143)"},
      labelStyle:{fontSize:16,fontWeight: 'bold', bottom:-15}
    },
    
    animationEnabled: true,
  }
);

export default createAppContainer(

  createStackNavigator({
    MyTab: {
      screen: bottomNav,
      navigationOptions:(props)=> ({
        title: 'Welcome',
        headerStyle:{backgroundColor:"rgb(129,150,143)"}, 
        headerRight: <Button buttonStyle={{backgroundColor:"tomato", marginRight:10,marginBottom:5, padding:8,borderRadius:5}} 
                      textStyle={{color: 'white', alignSelf:'center'}} 
                      text={'log out'}
                      onPress={()=>props.screenProps.callBacktoLogout()}/>,
        headerTintColor:'white'
      })
    }
  })

);
