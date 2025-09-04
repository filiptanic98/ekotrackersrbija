import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { CreateDumpInput, EnvironmentType, ApiResponse } from '@ekotracker/shared';

const API_BASE_URL = __DEV__ ? 'http://localhost:4000/api' : 'https://your-api-url.com/api';

export default function DumpReportForm() {
  const [formData, setFormData] = useState<CreateDumpInput>({
    description: '',
    latitude: 44.8176, // Belgrade coordinates as default
    longitude: 20.4633,
    urgency: 1,
    appearance: 1,
    environmentType: EnvironmentType.OTHER,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.description.trim()) {
      Alert.alert('Greška', 'Molimo unesite opis deponije.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/dumps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result: ApiResponse<any> = await response.json();

      if (result.success) {
        Alert.alert(
          'Uspešno!',
          'Deponija je uspešno prijavljena. Hvala vam na doprinosu čišćoj prirodi!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Reset form
                setFormData({
                  description: '',
                  latitude: 44.8176,
                  longitude: 20.4633,
                  urgency: 1,
                  appearance: 1,
                  environmentType: EnvironmentType.OTHER,
                });
              },
            },
          ]
        );
      } else {
        Alert.alert('Greška', result.error || 'Došlo je do greške prilikom slanja prijave.');
      }
    } catch (error) {
      console.error('Error submitting dump:', error);
      Alert.alert('Greška', 'Nije moguće poslati prijavu. Proverite internetsku vezu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Prijavi divlju deponiju</Text>
        
        <View style={styles.field}>
          <Text style={styles.label}>Opis deponije *</Text>
          <TextInput
            style={styles.textInput}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Opišite šta vidite na deponiji..."
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={styles.label}>Geografska širina</Text>
            <TextInput
              style={styles.textInput}
              value={formData.latitude.toString()}
              onChangeText={(text) => setFormData({ ...formData, latitude: parseFloat(text) || 0 })}
              keyboardType="numeric"
              placeholder="44.8176"
            />
          </View>
          <View style={styles.halfField}>
            <Text style={styles.label}>Geografska dužina</Text>
            <TextInput
              style={styles.textInput}
              value={formData.longitude.toString()}
              onChangeText={(text) => setFormData({ ...formData, longitude: parseFloat(text) || 0 })}
              keyboardType="numeric"
              placeholder="20.4633"
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Hitnost (1-5)</Text>
          <Picker
            selectedValue={formData.urgency}
            style={styles.picker}
            onValueChange={(value) => setFormData({ ...formData, urgency: value })}
          >
            <Picker.Item label="1 - Malo hitno" value={1} />
            <Picker.Item label="2 - Umereno hitno" value={2} />
            <Picker.Item label="3 - Hitno" value={3} />
            <Picker.Item label="4 - Vrlo hitno" value={4} />
            <Picker.Item label="5 - Kritično hitno" value={5} />
          </Picker>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Izgled deponije (1-5)</Text>
          <Picker
            selectedValue={formData.appearance}
            style={styles.picker}
            onValueChange={(value) => setFormData({ ...formData, appearance: value })}
          >
            <Picker.Item label="1 - Malo otpada" value={1} />
            <Picker.Item label="2 - Umereno otpada" value={2} />
            <Picker.Item label="3 - Dosta otpada" value={3} />
            <Picker.Item label="4 - Mnogo otpada" value={4} />
            <Picker.Item label="5 - Ogromna količina otpada" value={5} />
          </Picker>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Tip okruženja</Text>
          <Picker
            selectedValue={formData.environmentType}
            style={styles.picker}
            onValueChange={(value) => setFormData({ ...formData, environmentType: value })}
          >
            <Picker.Item label="Reka/Voda" value={EnvironmentType.RIVER} />
            <Picker.Item label="Park/Priroda" value={EnvironmentType.PARK} />
            <Picker.Item label="Stambeno područje" value={EnvironmentType.RESIDENTIAL} />
            <Picker.Item label="Industrijska zona" value={EnvironmentType.INDUSTRIAL} />
            <Picker.Item label="Ostalo" value={EnvironmentType.OTHER} />
          </Picker>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Šalje se...' : 'Prijavi deponiju'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  field: {
    marginBottom: 15,
  },
  halfField: {
    flex: 1,
    marginHorizontal: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    ...Platform.select({
      android: {
        color: '#333',
      },
    }),
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});