import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Button, TextInput, Card, Title } from 'react-native-paper';
import { url } from '../constant';

const Signup = ({navigation}) => {
  const [name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobile, setMobile] = useState("");

  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [mobileError, setMobileError] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  

  const validateForm = () => {
    let valid = true;

    // Full Name validation
    if (!name.trim()) {
      setFullNameError("Full name is required.");
      valid = false;
    } else {
      setFullNameError("");
    }

    // Email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email.");
      valid = false;
    } else {
      setEmailError("");
    }

    // Mobile validation
    if (!mobile || !/^\d{10}$/.test(mobile)) {
      setMobileError("Please enter a valid 10-digit mobile number.");
      valid = false;
    } else {
      setMobileError("");
    }

    // Password validation
    if (!password) {
      setPasswordError("Password is required.");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      valid = false;
    } else {
      setPasswordError("");
    }

    // Confirm Password validation
    if (!confirmPassword) {
      setConfirmPasswordError("Confirm Password is required.");
      valid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match.");
      valid = false;
    } else {
      setConfirmPasswordError("");
    }

    return valid;
  };


  const handleSignup = async () => {
    if (!validateForm()) return; // Ensure form validation before API call
  
    try {
      console.log("1: Starting signup...");
  
      let response;
      
      try {
        response = await fetch(`${url}/users/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            mobile: mobile.trim(),
            password: password.trim(),
          }),
        });
      } catch (fetchError) {
        console.error("Fetch request failed:", fetchError);
        alert("Server not reachable. Check your internet or backend.");
        return;
      }
  
      console.log("2: Response received");
  
      let data;
      try {
        data = await response.json();
        console.log("3: JSON Parsed", data);
      } catch (jsonError) {
        console.error("Invalid JSON response:", jsonError);
        alert("Server error: Invalid response format.");
        return;
      }
  
      if (response.ok) {
        console.log('Signup Successful:', data);
        alert('Signup Successful!'); // Show success message
        navigation.navigate("Login")
        setFullName("")
        setEmail("")
        setMobile("")
        setPassword("")
        setConfirmPassword("")
      } else {
        console.log('Signup Failed:', data.message || 'Something went wrong');
       
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('Unexpected error. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        {/* Logo */}
        <Image
          source={require('../../../TaskManagerApp/assets/logo.jpg')}
          style={styles.image}
        />

        <Card.Content>
          <Title style={styles.title}>Create Account</Title>

          {/* Full Name */}
          <TextInput
            label="Full Name"
            value={name}
            onChangeText={setFullName}
            mode="outlined"
            style={styles.textInput}
          />
          {fullNameError ? <Text style={styles.errorText}>{fullNameError}</Text> : null}

          {/* Email */}
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.textInput}
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          {/* Mobile */}
          <TextInput
            label="Mobile"
            value={mobile}
            onChangeText={setMobile}
            mode="outlined"
            keyboardType="numeric"
            maxLength={10}
            style={styles.textInput}
          />
          {mobileError ? <Text style={styles.errorText}>{mobileError}</Text> : null}

          {/* Password Input with Eye Icon */}
          <View style={styles.passwordContainer}>
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry={!passwordVisible}
              style={[styles.textInput, styles.passwordInput]}
              maxLength={20}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Text style={styles.eyeText}>
                {passwordVisible ? "👁️" : "🔒"}  
              </Text>
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          {/* Confirm Password Input with Eye Icon */}
          <View style={styles.passwordContainer}>
            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              secureTextEntry={!confirmPasswordVisible}
              style={[styles.textInput, styles.passwordInput]}
              maxLength={20}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              <Text style={styles.eyeText}>
                {confirmPasswordVisible ? "👁️" : "🔒"}  
              </Text>
            </TouchableOpacity>
          </View>
          {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

          {/* Signup Button */}
          <TouchableOpacity onPress={handleSignup} style={styles.button}>
            <Text style={styles.buttonText}>Signup</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>
    </View>
  );
};

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  card: {
    height: "100%",
    backgroundColor: 'white',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 24,
    fontWeight: '600',
    color: '#6200ea',
  },
  textInput: {
    marginBottom: 10,
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 40, // Space for eye icon
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 15,
  },
  eyeText: {
    fontSize: 18,
  },
  button: {
    backgroundColor: '#6200ea',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  }
});

export default Signup;
