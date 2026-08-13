import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function AuthScreen() {
  const { user, loading, signUp, signIn, logOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = async () => {
    try {
      await signUp(email, password);
      setMessage('Account created!');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setMessage(`Sign Up Error: ${errorMsg}`);
    }
  };

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
      setMessage('Signed in!');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setMessage(`Sign In Error: ${errorMsg}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Sale Intel - Mobile Auth</Text>

        {user ? (
          <View style={styles.card}>
            <Text style={styles.userText}>Logged in as:</Text>
            <Text style={styles.emailText}>{user.email}</Text>
            <TouchableOpacity style={styles.logoutBtn} onPress={() => logOut()}>
              <Text style={styles.btnText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <View style={styles.row}>
              <TouchableOpacity style={[styles.button, styles.primary]} onPress={handleSignUp}>
                <Text style={styles.btnText}>Sign Up</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.secondary]} onPress={handleSignIn}>
                <Text style={styles.btnText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  inner: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  form: { width: '100%' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  row: { flexDirection: 'row', gap: 12, marginTop: 8 },
  button: { flex: 1, padding: 14, borderRadius: 8, alignItems: 'center' },
  primary: { backgroundColor: '#2563eb' },
  secondary: { backgroundColor: '#1e293b' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  card: { padding: 16, backgroundColor: '#f0fdf4', borderRadius: 8, borderWidth: 1, borderColor: '#bbf7d0' },
  userText: { color: '#166534', fontSize: 14 },
  emailText: { color: '#166534', fontWeight: 'bold', fontSize: 16, marginBottom: 16 },
  logoutBtn: { backgroundColor: '#dc2626', padding: 12, borderRadius: 8, alignItems: 'center' },
  message: { marginTop: 16, textAlign: 'center', color: '#475569' },
});