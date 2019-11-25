import React from 'react';
import { View,TextInput, Alert, Text, StyleSheet, ScrollView, Platform} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Card } from 'react-native-paper';
import Button from './Button'
import base64 from 'base-64';
import DatePicker from 'react-native-datepicker';

class Activity extends React.Component {
    constructor(props) {
        super(props);
        this.editList = {};
        this.state={
            times:{},
            editActivity:{},
        }
    }

    render() {
        return (
            <ScrollView style={[styles.container,{flex: 1}]} contentContainerStyle={{flexGrow: 1, justifyContent: 'flex', alignItems: 'center' }}>
              
              <View style={{flexDirection:'row'}}>
              <Ionicons name={Platform.OS === "ios"?"ios-arrow-back":"md-arrow-back" } style={{left:-40}}
                position='absolute' size={40} color='rgb(129,150,143)' onPress={() => {
                  this.props.hide();
                  this.props.refresh();}}/>
                 <Text style={[styles.sectionHeading, { color: 'tomato' }]}>
                Today's Activity Details
              </Text>
             
              </View>
             
             
            <Card style={styles.story}>

                {this.renderActivity()}

            </Card>
            
            </ScrollView>
        );
    }


    // do the render for each activity
    renderActivity() {
        let listAct = [];
        this.props.userActivity.forEach(act => {
          if(!this.state.editActivity[act.id]){
            listAct.push(
              <Card style={{backgroundColor:"rgb(129,150,143)", marginBottom:20}} key={act.id}>
                <Button buttonStyle={{alignItems: 'center', justifyContent: 'center', 
                        width: 70, height: 70, position: 'absolute',zIndex:1, top:-15, right: -10}} 
                        textStyle={{fontSize: 25, color:'white'}} text={'x'} 
                        onPress={() => this.handleDeleteActivity(act.id)}/>
                <View style={{padding:20}}>
                  <View style={{flexDirection:'row', height:30}}>
                    <Text style={[styles.storyHeading,{fontSize:14, width:150, color:'white'}]}>Name: {act.name}</Text>
                    <Text style={{margin: 8, marginLeft:80, textAlign:'center', color:'white'}}>Id: {act.id}</Text>
                  </View>
                  <View style={{flexDirection:'row', height:25, top: 5}}>
                    <Text style={{width:150, color:'white'}}>Calories: {act.calories} cals</Text>
                    <Text style={{marginLeft:50, color:'white'}}>{
                      new Date(act.date).getFullYear() + "/"+ 
                      parseInt(new Date(act.date).getMonth()+1) +"/"+ 
                      new Date(act.date).getDate() + "  " + 
                      new Date(act.date).getHours() + ":" + 
                      new Date(act.date).getMinutes()}
                      </Text>
                  </View>
                  <View style={{flexDirection:'row', marginTop: 5}}>
                    <Text style={{width:150, color:'white'}}>Duration: {act.duration} mins</Text>
                    
                  </View>
                  <View style={{marginTop:10}}>
                    <Button textStyle={{color: 'tomato', alignSelf:'center', textDecorationLine:'underline'}} 
                        text={'edit'} onPress={() => this.handleEdit(act.id)}/>
                  </View>
                </View>
                
              </Card>
            )
          }
          else {
            listAct.push(
              <Card style={{backgroundColor:"rgb(129,150,143)", marginBottom:20}} key={act.id}>
                <Button buttonStyle={{alignItems: 'center', justifyContent: 'center', 
                        width: 70, height: 70, position: 'absolute',zIndex:1, top:-15, right: -10}} 
                        textStyle={{fontSize: 25, color:'white'}} text={'x'} 
                        onPress={() => this.handleDeleteActivity(act.id)}/>
                <View style={{padding:20}}>
                  <View style={{flexDirection:'row', height:30}}>
                    <TextInput placeholder={"Name: "+act.name}
                      style={[styles.storyHeading,{fontSize:14, marginTop:5,marginBottom:5, width: 150,color:'white'}]}
                      onChangeText = {(text)=>this.editList[act.id].name=text}/>
                    <Text style={{margin: 8, marginLeft:80, textAlign:'center',color:'white'}}>Id: {act.id}</Text>
                  </View>   
                  <View style={{flexDirection:'row', height:25, top: 5}}>
                    <TextInput placeholder={"Calories: "+act.calories + " cals"}
                      style={{width:150, color:'white'}} 
                      onChangeText = {(text)=>this.editList[act.id].calories=text}/>
                    <DatePicker
                      style={{width:140,marginLeft:20}}
                      date={this.state.times[act.id]}
                      mode="datetime"
                      placeholder={new Date(act.date).getFullYear() + "/"+ 
                                    parseInt(new Date(act.date).getMonth()+1) +"/"+ 
                                    new Date(act.date).getDate()+ "  " + 
                                    new Date(act.date).getHours() + ":" + 
                                    new Date(act.date).getMinutes()} 
                      format="DD MMMM YYYY h:mm a"
                      minDate= {this.props.today.getFullYear()-1 + '-' + parseInt(this.props.today.getMonth()+1) + '-' + this.props.today.getDate()}
                      maxDate= {this.props.today}
                      customStyles={{
                        dateIcon: {
                          display:'none'
                        },
                        dateInput: {
                          top:-10,
                          left: 15
                        }
                      }}
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      onDateChange={(date) => {
                        let newDate = new Date(date);
                        this.editList[act.id].date=newDate;
                        let new_times = JSON.parse(JSON.stringify(this.state.times));
                        new_times[act.id] = date;
                        this.setState({times: new_times});
                      }}/>
                  </View>
                  <View style={{flexDirection:'row', marginTop: 5}}>
                    <TextInput placeholder={"Duration: "+act.duration + " mins"}
                    style={{width:150, color:'white'}} 
                    onChangeText = {(text)=>this.editList[act.id].duration=text}/>
                   
                  </View>
                  <View style={{marginTop:10}}>
                    <Button textStyle={{color: 'tomato', alignSelf:'center', textDecorationLine:'underline'}} 
                        text={'save'} onPress={() => this.handleSave(act.id)}/>
                  </View>
                </View>
                
              </Card>
            )
          }
        });
        return (listAct);
      }
    
    
      handleEdit(id) {
      let new_editActivity = JSON.parse(JSON.stringify(this.state.editActivity));
      new_editActivity[id] = true;
      this.setState({editActivity:new_editActivity});
      this.editList[id] = {};
    }
  
    handleSave(id) {
      let obj = this.editList[id];
      if(Object.keys(obj).length !== 0){
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
            fetch('https://mysqlcs639.cs.wisc.edu/activities/' + id, {
              method: 'PUT',
              headers: newHeader,
              body: JSON.stringify(obj),
              redirect:"follow"
              })
              .then(newresponse => newresponse.json())
              .then(newresult =>{
                this.props.refresh();
                Alert.alert(newresult.message)
              })
          })
          .catch((error) => {
              console.error(error);
              return;
          });
      }    
      let new_editActivity = JSON.parse(JSON.stringify(this.state.editActivity));
      new_editActivity[id] = false;
      this.setState({editActivity:new_editActivity});
    }

    handleDeleteActivity(id) {
        let tempHeader = new Headers();
        tempHeader.append('Authorization', 'Basic ' + base64.encode(this.props.userName+ ":" + this.props.password));
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
            fetch('https://mysqlcs639.cs.wisc.edu/activities/' + id, {
              method: 'DELETE',
              headers: newHeader,
              redirect:"follow"
              })
              .then(newresponse => newresponse.json())
              .then(newresult =>{
                if(newresult.message) {
                  this.props.refresh();
                  let new_editActivity = JSON.parse(JSON.stringify(this.state.editActivity));
                  new_editActivity[id] = false;
                  this.setState({editActivity:new_editActivity});
                  Alert.alert(newresult.message)
                }
              })
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
      textAlign: 'left',
    },
    button: {
      display: 'flex',
      flexDirection: 'column',
    },
  });



export default Activity;