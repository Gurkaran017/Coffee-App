import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native"
import { useCopilot } from "react-native-copilot"
import { useWalkthrough } from "../../WalkthroughContext"

const TooltipComponent = () => {
  const {
    isFirstStep,
    isLastStep,
    goToPrev: handlePrev,
    stop: handleStop,
    currentStep,
    totalStepsNumber,
    goToNext: handleNext,
    currentStepNumber,
  } = useCopilot()

  const totalSteps = totalStepsNumber || 1
  const currentStepNum = currentStepNumber || 1
  const { scrollAndHighlightStep } = useWalkthrough();

  const handleNextStep = async () => {
    let nextStep: { name: string; order: number } | null = null;

    switch (currentStep?.order) {
      case 1:
        nextStep = { name: "Step 2", order: 2 };
        break;
      case 2:
        nextStep = { name: 'Upcoming Events', order: 3 };
        break;
      case 3:
        nextStep = { name: 'Announcements', order: 4 };
        break;
      case 4:
        nextStep = { name: 'Featured Videos', order: 5 };
        break;
      default:
        break;
    }

    if (nextStep) {
      await scrollAndHighlightStep(nextStep);
    }
    handleNext()
  };
  const handlePrevStep = async () => {
    let prevStep: { name: string; order: number } | null = null;
    console.log("current Step",currentStep);

    switch (currentStep?.order) {
      case 3:
        prevStep = { name: "Start Your Journey", order: 2 };
        break;
      case 4:
        prevStep = { name: 'Upcoming Events', order: 3 };
        break;
      case 5:
        prevStep = { name: 'Announcements', order: 4 };
        break;
      case 6:
        prevStep = { name: 'Featured Videos', order: 5 };
        break;
      default:
        break;
    }
    console.log("previous step",prevStep)

    if (prevStep) {
      await scrollAndHighlightStep(prevStep);
    }
    handlePrev()
  };

  // Generate progress dots
  const renderProgressDots = () => {
    const dots = []
    for (let i = 1; i <= totalSteps; i++) {
      dots.push(
        <View
          key={i}
          style={[styles.progressDot, i === currentStepNum ? styles.progressDotActive : styles.progressDotInactive]}
        />,
      )
    }
    return dots
  }

  // Get step title from step name or use default
  const getStepTitle = () => {
    if (currentStep?.name) {
      // Convert camelCase to Title Case
      return currentStep.name
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
        .trim()
    }
    return "Tutorial Step"
  }

  return (
    <View>
      {/* Header with title and close button */}
      <View style={styles.header}>
        <Text style={styles.title}>{getStepTitle()}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={handleStop}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Tooltip Content */}
      <View style={styles.tooltipContent}>
        <Text style={styles.tooltipText}>{currentStep?.text || "Welcome to the tutorial!"}</Text>
      </View>

      {/* Progress Dots */}
      <View style={styles.progressContainer}>{renderProgressDots()}</View>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        {/* Previous Button */}
        <TouchableOpacity
          style={[styles.navButton, styles.prevButton, isFirstStep && styles.disabledButton]}
          onPress={handlePrevStep}
          disabled={isFirstStep}
        >
          <Text style={[styles.prevButtonText, isFirstStep && styles.disabledButtonText]}>← Previous</Text>
        </TouchableOpacity>

        {/* Step Counter */}
        <Text style={styles.stepCounter}>
          {currentStepNum} of {totalSteps}
        </Text>

        {/* Next Button */}
        <TouchableOpacity style={[styles.navButton, styles.nextButton]} onPress={isLastStep ? handleStop : handleNextStep}>
          <Text style={styles.nextButtonText}>{isLastStep ? "Finish" : "Next →"}</Text>
        </TouchableOpacity>
      </View>

      {/* Skip Tour Button */}
      <TouchableOpacity style={styles.skipTourButton} onPress={handleStop}>
        <Text style={styles.skipTourText}>Skip Tour</Text>
      </TouchableOpacity>
    </View>
  )
}

// Updated StepComponent to match the design
type StepComponentProps = {
  isFirstStep: boolean
  isLastStep: boolean
  currentStepNumber: number
  currentStep: { [key: string]: any } | null
}

const StepComponent = ({ currentStepNumber }: StepComponentProps) => {
  const stepNum = currentStepNumber || 1

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepText}>{stepNum}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
    flex: 1,
  },
  closeButton: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#999",
    fontWeight: "300",
  },
  tooltipContent: {
    marginBottom: 20,
  },
  tooltipText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
    textAlign: "left",
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  progressDotActive: {
    backgroundColor: "#4A90E2",
  },
  progressDotInactive: {
    backgroundColor: "#D1D5DB",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  navButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  prevButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  prevButtonText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "500",
  },
  nextButton: {
    backgroundColor: "#F59E0B",
  },
  nextButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledButtonText: {
    color: "#9CA3AF",
  },
  stepCounter: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  skipTourButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  skipTourText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  // Step component styles
  stepContainer: {
    backgroundColor: "#4A90E2",
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
  },
  stepText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
})

export { TooltipComponent, StepComponent }