
import React from 'react';
import { Text,TextInput, View, TouchableWithoutFeedback, Dimensions, Alert } from 'react-native';
import Button from './Button';


class ModalSignup extends React.Component {
  constructor(props) {
    super(props);
    this.userName = '';
    this.password = '';
  }

  render() {
    if(this.props.show) {
      const screenWidth = Math.round(Dimensions.get('window').width);
      const screenHeight = Math.round(Dimensions.get('window').height);

      return (
        <View style={{position: 'absolute'}}>
          <TouchableWithoutFeedback onPress={() => this.props.hide()}>
            <View style={{width: screenWidth, height: screenHeight, backgroundColor: 'black', opacity: 0.75}}>
            </View>
          </TouchableWithoutFeedback>
          <View style={{position: 'absolute', width: this.props.width, height: this.props.height, left: (screenWidth - this.props.width)/2, top: (screenHeight - this.props.height)/2, backgroundColor: '#ccc', borderRadius: 10}}>
            <Text style={{fontSize: 25, marginLeft: 20, marginTop: 15}}>Get you started</Text>
            <Button buttonStyle={{alignItems: 'center', justifyContent: 'center', width: 70, height: 70, position: 'absolute', right: 0}} textStyle={{fontSize: 25}} text={'✕'} onPress={() => this.props.hide()}/>
            <View style={{flex:1,alignSelf:'center',alignContent:'center',justifyContent:'center'}}>
              <Text style={{fontSize: 15,marginLeft:10,fontWeight:'bold'}}>Username</Text>
              <TextInput style={{borderWidth:1, height:30, width:200,margin:10}}
                        onChangeText={(text) => this.userName = text}/>
              <Text style={{fontSize: 15, marginTop:10,marginLeft:10,fontWeight:'bold'}}>Password</Text>
              <TextInput style={{borderWidth:1, height:30, width:200,margin:10}} secureTextEntry={true}
                        onChangeText={(text) => this.password = text}/>
              <Button buttonStyle={{backgroundColor: 'rgb(129,150,143)', margin: 10, padding:10}} 
                    textStyle={{color: '#ffffff', alignSelf:'center'}} 
                    text={'Sign up'} onPress={() => this.completeSignup()} />
            </View>
              
            
          </View>
        </View>
      )
    }
    return (<View></View>)
  }


  completeSignup() {
    let obj = {};
    obj.username = this.userName;
    obj.password = this.password;
    
    let tempHeader = new Headers();
    tempHeader.append('Accept', 'application/json');
    tempHeader.append( 'Content-Type', 'application/json');
    tempHeader.append('x-access-token', "");
    fetch('https://mysqlcs639.cs.wisc.edu/users', {
    method: 'POST',headers: tempHeader,
    body: JSON.stringify(obj),
    redirect:"follow"
    })
    .then(response => response.json())
    .then(result => {
      console.log(result.message)
      if(result.message.includes('created'))
        this.props.proceed(obj.username,obj.password);
     
      Alert.alert(result.message);
    })
    .catch((error) => {
        console.error(error);
    });

  }

}

export default ModalSignup;
