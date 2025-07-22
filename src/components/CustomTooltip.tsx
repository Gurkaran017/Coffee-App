// src/components/CustomTooltip.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTSIZE, FONTFAMILY, SPACING } from '../theme/theme';

const CustomTooltip = ({
  isFirstStep,
  isLastStep,
  handleNext,
  handlePrev,
  handleStop,
  currentStep,
}) => {
  if (!currentStep) return null; // <- Early return if currentStep is undefined

  return (
    <View style={styles.container}>
      <Text style={styles.tooltipText}>{currentStep.text}</Text>

      <View style={styles.footer}>
        {!isFirstStep && (
          <TouchableOpacity onPress={handlePrev}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        )}

        {!isLastStep ? (
          <TouchableOpacity onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleStop}>
            <Text style={styles.buttonText}>Got it!</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primaryDarkGreyHex,
    borderRadius: 16,
    padding: SPACING.space_20,
    maxWidth: 280,
  },
  tooltipText: {
    color: COLORS.primaryWhiteHex,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    marginBottom: SPACING.space_10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonText: {
    color: COLORS.primaryOrangeHex,
    fontFamily: FONTFAMILY.poppins_bold,
    fontSize: FONTSIZE.size_14,
  },
});

export default CustomTooltip;
