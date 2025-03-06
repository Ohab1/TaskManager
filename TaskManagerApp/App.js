import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/auth/Login';
import Signup from './src/auth/Signup';
import Home from './src/home/Home';
import CreateTask from './src/task/CreateTask';
import TaskList from './src/task/TaskList';
import EditTask from './src/task/EditTask';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" >
        <Stack.Screen name="Login" component={Login}  options={{headerShown:false}} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="CreateTask" component={CreateTask} />
        <Stack.Screen name="TaskList" component={TaskList} />
        <Stack.Screen name="EditTask" component={EditTask} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
