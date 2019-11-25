
import React from 'react';
import { Text,TextInput, View, Alert,StyleSheet,ScrollView ,Dimensions} from 'react-native';
import base64 from 'base-64';
import Button from './Button';
import { Card } from 'react-native-paper';


class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.modified={
      password: false,
      firstName: false,
      lastName: false,
      goalDailyActivity: false,
      goalDailyCalories: false,
      goalDailyProtein: false,
      goalDailyCarbohydrates: false,
      goalDailyFat: false
    }
    this.state = {
      password: this.props.password,
      firstName: this.props.userInfo.firstName,
      lastName: this.props.userInfo.lastName,
      goalDailyActivity: this.props.userInfo.goalDailyActivity,
      goalDailyCalories: this.props.userInfo.goalDailyCalories,
      goalDailyProtein: this.props.userInfo.goalDailyProtein,
      goalDailyCarbohydrates: this.props.userInfo.goalDailyCarbohydrates,
      goalDailyFat: this.props.userInfo.goalDailyFat
    }
  }

  render() {
      return (
          <ScrollView >
            <Text style={[styles.sectionHeading, { color: 'tomato' }]}> Profile</Text>
              <Card style={styles.story}>
                <Text style={styles.storyHeading}>Account Info</Text>
                <View style={{flexDirection:'row', margin:10, marginLeft:40,marginRight:40}} key={'password'}>
                  <Text style={{width:250}}>Password</Text>
                  <TextInput value={(String)(this.modified.password?this.state.password:this.props.password)} 
                  onChangeText = {(text)=>{
                    this.setState({password:text},()=>this.modified.password=true);
                  }}
                  style={{borderBottomWidth:1}}/>
                </View>
                <View style={{marginTop:10}}>
                <Button textStyle={{color: 'tomato', alignSelf:'center', textDecorationLine:'underline'}} 
                      text={'save password and log out'} onPress={() => {
                        this.handleSubmit();
                        this.props.callBacktoLogout();
                      }}/>
                </View>
              </Card>
              <Card style={styles.story}>
                <Text style={styles.storyHeading}>Personal Info</Text>
                <View style={{flexDirection:'row',  margin:10, marginLeft:40,marginRight:40}} key={'firstName'}>
                  <Text style={{width:250}}>First Name</Text>
                  <TextInput value={(String)(this.modified.firstName?this.state.firstName:this.props.userInfo.firstName)} 
                  onChangeText = {(text)=>{
                    this.setState({firstName:text},()=>this.modified.firstName=true);
                  }}
                  style={{borderBottomWidth:1}}/>
                </View>
                <View style={{flexDirection:'row', margin:10, marginLeft:40,marginRight:40}} key={'lastName'}>
                  <Text style={{width:250}}>Last Name</Text>
                  <TextInput value={(String)(this.modified.lastName?this.state.lastName:this.props.userInfo.lastName)} 
                  // onSubmitEditing={()=>this.handleSubmit()}
                  onChangeText = {(text)=>{
                    this.setState({lastName:text})
                    this.modified.lastName=true;
                  }}
                  style={{borderBottomWidth:1}}/>
                </View>
                <View style={{marginTop:10}}>
                </View>
              </Card>
              <Card style={styles.story}>
                <Text style={styles.storyHeading}>Activity Goal</Text>
                <View style={{flexDirection:'row', margin:10, marginLeft:40,marginRight:40}} key={'goalDailyActivity'}>
                  <Text style={{width:250}}>Daily Activity Goal</Text>
                  <TextInput value={(String)(this.modified.goalDailyActivity?this.state.goalDailyActivity:this.props.userInfo.goalDailyActivity)} 
                  onChangeText = {(text)=>{
                    this.modified.goalDailyActivity=true;
                    this.setState({goalDailyActivity:text})
                  }}
                  style={{borderBottomWidth:1}}/>
                </View>
              </Card>
              <Card style={styles.story}>
                <Text style={styles.storyHeading}>Nutrition Goal</Text>
                <View style={{flexDirection:'row', margin:10, marginLeft:40,marginRight:40}} key={'goalDailyCalories'}>
                  <Text style={{width:250}}>Daily Calories Goal</Text>
                  <TextInput value={(String)(this.modified.goalDailyCalories?this.state.goalDailyCalories:this.props.userInfo.goalDailyCalories)} 
                  onChangeText = {(text)=>{
                    this.modified.goalDailyCalories=true;
                    this.setState({goalDailyCalories:text})
                  }}
                  style={{borderBottomWidth:1}}/>
                </View>
                <View style={{flexDirection:'row', margin:10, marginLeft:40,marginRight:40}} key={'goalDailyProtein'}>
                  <Text style={{width:250}}>Daily Protein Goal</Text>
                  <TextInput value={(String)(this.modified.goalDailyProtein?this.state.goalDailyProtein:this.props.userInfo.goalDailyProtein)} 
                  onChangeText = {(text)=>{
                    this.modified.goalDailyProtein=true;
                    this.setState({goalDailyProtein:text})
                  }}
                  style={{borderBottomWidth:1}}/>
                </View>
                <View style={{flexDirection:'row', margin:10, marginLeft:40,marginRight:40}} key={'goalDailyCarbohydrates'}>
                  <Text style={{width:250}}>Daily Carbohydrates Goal</Text>
                  <TextInput value={(String)(this.modified.goalDailyCarbohydrates?this.state.goalDailyCarbohydrates:this.props.userInfo.goalDailyCarbohydrates)} 
                  onChangeText = {(text)=>{
                    this.modified.goalDailyCarbohydrates=true;
                    this.setState({goalDailyCarbohydrates:text})
                  }}
                  style={{borderBottomWidth:1}}/>
                </View>
                <View style={{flexDirection:'row', margin:10, marginLeft:40,marginRight:40}} key={'goalDailyFat'}>
                  <Text style={{width:250}}>Daily Fat Goal</Text>
                  <TextInput value={(String)(this.modified.goalDailyFat?this.state.goalDailyFat:this.props.userInfo.goalDailyFat)} 
                  onChangeText = {(text)=>{
                    this.modified.goalDailyFat=true;
                    this.setState({goalDailyFat:text})
                  }}
                  style={{borderBottomWidth:1}}/>
              </View>
            </Card>

            <View style={{marginTop:10}}>
            <Button buttonStyle={{backgroundColor: 'tomato', alignSelf:'center', padding:10, borderRadius: 10}} 
                          textStyle={{color: '#ffffff', alignSelf:'center'}} 
                          text={'Save Changes'} onPress={() => this.handleSubmit()} />
            </View>
            <View style={{marginTop:10, marginBottom:20}}>
            <Button buttonStyle={{backgroundColor: 'tomato', alignSelf:'center', padding:10, borderRadius: 10}} 
                          textStyle={{color: '#ffffff', alignSelf:'center'}} 
                          text={'Delete Account'} onPress={() => this.handleDelete()} />
            </View>
        </ScrollView>
      )
  }

  handleSubmit() {  
    let tempHeader = new Headers();
    tempHeader.append('Authorization', 'Basic ' + base64.encode(this.props.userName + ":" + this.props.password));
    tempHeader.append('x-access-token', "");
    tempHeader.append('Content-Type', 'application/json');
    let newBody = {}
    for(let key of Object.keys(this.modified)) {
      if(this.modified[key]){
        newBody[key]= this.state[key];
      }
    }
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
        fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.props.userName, {
          method: 'PUT',
          headers: newHeader,
          body: JSON.stringify(newBody),
          redirect:"follow"
          })
          .then(newresponse => newresponse.json())
          .then(newresult =>Alert.alert(newresult.message))
      })
      .catch((error) => {
          console.error(error);
          return;
      });
  }

  handleDelete() {
    let tempHeader = new Headers();
    tempHeader.append('Authorization', 'Basic ' + base64.encode(this.props.userName + ":" + this.props.password));
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
        fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.props.userName, {
          method: 'DELETE',
          headers: newHeader,
          redirect:"follow"
          })
          .then(newresponse => newresponse.json())
          .then(newresult =>Alert.alert(newresult.message))
          .then(this.props.callBacktoLogout())
      })
      .catch((error) => {
          console.error(error);
          return;
      });
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    paddingBottom: 10,
  },
  story: {
    margin: 10,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    width: '100%',
    padding: 10,
  },
  sectionHeading: {
    margin: 8,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  storyHeading: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    display: 'flex',
    flexDirection: 'column',
  },
});

export default Profile;
