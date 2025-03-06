import { StyleSheet, Text, View, Image, TouchableOpacity,DevMenu } from 'react-native';
import React, { useState } from 'react';
import { TextInput, Card, Title } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from '../constant';

const Login = ({ navigation }) => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  // ✅ Validate Mobile & Password
  const validateForm = () => {
    let valid = true;

    if (!mobile || !/^\d{10}$/.test(mobile)) {
      setMobileError("Please enter a valid 10-digit mobile number.");
      valid = false;
    } else {
      setMobileError("");
    }

    if (!password) {
      setPasswordError("Password is required.");
      valid = false;
    } else {
      setPasswordError("");
    }

    return valid;
  };
  // setTimeout(()=>{
  //   DevMenu.show()
  // },[500])

  // const handleLogin = () => {
 
    
  //   if(!validateForm()){
  //     return;
  //   }
  //   console.log("kjkj");
  //   fetch(`${url}/users/login`,{
  //     method:"post",
  //     body:JSON.stringify({mobile:mobile,password:password})
  //   }).then((response)=>{
  //     console.log("res",response);
      
  //   }).catch((error)=>{
  //     console.log("error",error);
      
  //   })
  // }

  // ✅ Handle Login Request
  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      console.log("1: Starting login...");

      let response = await fetch(`${url}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, password }),
      });

      let data = await response.json();

      if (response.ok) {
        console.log("Login Successful:", data);

        // ✅ Save user details in AsyncStorage
        await AsyncStorage.setItem("userData", JSON.stringify({
          token: data.jwtToken,
          role: data.role,
          name: data.name,
          mobile: data.mobile
        }));
        setMobile("")
        setPassword("")
        // ✅ Navigate based on role
      
          navigation.replace("Home");  // Navigate to Home Page
        

      } else {
        console.log("Login Failed:", data.message || "Something went wrong");
        alert(data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Unexpected error. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Image source={require('../../../TaskManagerApp/assets/logo.jpg')} style={styles.image} />

        <Card.Content>
          <Title style={styles.title}>Welcome to Task Manager</Title>

          {/* Mobile Input */}
          <TextInput label="Mobile" value={mobile} onChangeText={setMobile} keyboardType="phone-pad" mode="outlined" maxLength={10} style={styles.textInput} />
          {mobileError ? <Text style={styles.errorText}>{mobileError}</Text> : null}

          {/* Password Input */}
          <View style={styles.passwordContainer}>
            <TextInput label="Password" value={password} onChangeText={setPassword} mode="outlined" secureTextEntry={!passwordVisible} style={[styles.textInput, styles.passwordInput]} maxLength={20} />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setPasswordVisible(!passwordVisible)}>
              <Text style={styles.eyeText}>{passwordVisible ? "👁️" : "🔒"}</Text>
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          {/* Login Button */}
          <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}> Login</Text>
          </TouchableOpacity>

          {/* Signup Button */}
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.signupText}>Don't have an account? <Text style={styles.signupLink}>Sign Up</Text></Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>
    </View>
  );
};

// ✅ Styles
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#f5f5f5' },
  image: { width: '100%', height: 150, resizeMode: 'cover', marginBottom: 10 },
  card: { backgroundColor: 'white', height: "100%" },
  title: { textAlign: 'center', marginBottom: 20, fontSize: 24, fontWeight: '600', color: '#6200ea' },
  textInput: { marginBottom: 10 },
  passwordContainer: { position: "relative" },
  passwordInput: { paddingRight: 40 },
  eyeIcon: { position: "absolute", right: 10, top: 15 },
  eyeText: { fontSize: 18 },
  button: { backgroundColor: '#6200ea', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 15, elevation: 5 },
  signupText: { textAlign: 'center', marginTop: 15, fontSize: 14, color: '#666' },
  signupLink: { color: '#6200ea', fontWeight: '600' },
  errorText: { color: 'red', fontSize: 12, marginBottom: 10 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});

export default Login;
