import React from 'react';
import { View,TextInput, Image, Alert } from 'react-native';
import base64 from 'base-64';
import ModalSignup from './ModalSignup';
import Button from './Button';
import Landing from './Landing';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.userName = "";
    this.password = "";
    this.state = {
      loginPage: true,
      showSignup: false,
      userInfo: {}
    }
  }

  render() {
    return (
      <>
        {this.loginPage()}
        {this.landingPage()}
      </>
    );
  }

  landingPage() {
    if(!this.state.loginPage) {
      let param = {
        userInfo:this.state.userInfo,
        password:this.password,
        userName:this.userName,
        callBacktoLogout: this.LogoutCallBack,
      }
      return (
        <Landing screenProps = {param}/>
      )
    }
  }

  loginPage() {
    if(this.state.loginPage) {
      return (
        <View style={{flex: 1, alignContent:'center',justifyContent:'center', backgroundColor:'rgb(129,150,143)'}}>
          <View style={{position:'absolute', alignSelf:'center',top:100}}>
            <Image style={{width:300, height:200}} source={require('./assets/splash.png')} />
          </View>
          <View style={{alignSelf:'center',backgroundColor:'#aaaaaa22', borderRadius:20, width:350, height:300,justifyContent:'center'}}>
          
            <View style={{alignSelf:'center', padding:10}}>
              <TextInput placeholder='Username' style={{borderBottomWidth:1, height:30, width:200}}
              onChangeText={(text) => this.userName = text} />
              <TextInput placeholder='Password' style={{borderBottomWidth:1, height:30, width:200, marginTop:40}}
              secureTextEntry={true} onChangeText={(text) => this.password = text}/>
            </View>

            <View style={{alignSelf:'center', marginTop:20}}>
              <Button buttonStyle={{backgroundColor: '#aaaaaa', padding:10, borderRadius: 10}} 
                      textStyle={{color: '#ffffff', alignSelf:'center'}} 
                      text={'Log in'} onPress={() => this.showProfile(this.userName,this.password)}/>
              <Button buttonStyle={{marginTop:20}}
                      textStyle={{color: '#eee', textDecorationLine:'underline'}} 
                      text={'Don\' have an account? Sign up'} onPress={() => this.showSignup()}/>
            </View>
          </View>
          <ModalSignup width={300} height={600} show={this.state.showSignup} 
            hide={() => this.hideSignup()} proceed={(username,password)=>this.showProfile(username,password)}/>
    
        </View>
      )
    }
  }

  showSignup() {
    this.setState({showSignup: true});
  }
  hideSignup() {
    this.setState({showSignup:false})
  }

  showProfile(username,password) {
    this.userName = username;
    this.password = password;
    console.log(username,password);
    let tempHeader = new Headers();
    tempHeader.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
    tempHeader.append('x-access-token', "");
    tempHeader.append('Content-Type', 'application/json');
    fetch('https://mysqlcs639.cs.wisc.edu/login', {
      method: 'GET',
      headers: tempHeader,
      redirect:"follow"
      })
      .then(response => response.json())
      .then(result =>{
        let newHeader = new Headers();
        newHeader.append('x-access-token', result.token);
        newHeader.append('Content-Type', 'application/json');
        fetch('https://mysqlcs639.cs.wisc.edu/users/' + username, {
          method: 'GET',
          headers: newHeader,
          redirect:"follow"
          })
          .then(newresponse => newresponse.json())
          .then(newresult =>{
            if(newresult.message) {
              Alert.alert(newresult.message)
            }
            else {
              this.setState({userInfo:newresult, loginPage:false});
            }
          })

      })
      .catch((error) => {
          console.error(error);
          return;
      });
  }




  LogoutCallBack =()=> {
    this.setState({
      loginPage: true,
      showSignup: false,
      userInfo: {}
    })
    this.userName = "";
    this.password = "";
  }



}

export default App;
