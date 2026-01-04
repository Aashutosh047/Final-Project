import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { UserDetailsForm } from "./UserDetailsForm";
import { QuestionnaireForm } from "./QuestionnaireForm";
import { ImageUploadForm } from "./ImageUploadForm";
import { ReportDisplay } from "./ReportDisplay";
import { generateReport } from "@/lib/reportGenerator";
import {
  AssessmentData,
  HairHealthReport,
  initialUserDetails,
  initialQuestionnaire,
} from "@/types/assessment";
import { useToast } from "@/hooks/use-toast";

const steps = [
  { id: 1, title: "Your Details", description: "Basic information" },
  { id: 2, title: "Questionnaire", description: "Health & lifestyle" },
  { id: 3, title: "Upload Images", description: "Hair & scalp photos" },
  { id: 4, title: "Your Report", description: "Personalized results" },
];

// API Configuration
const API_BASE_URL = "http://localhost:8000"; // Update this to your backend URL

export function AssessmentSection() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [report, setReport] = useState<HairHealthReport | null>(null);
  const [data, setData] = useState<AssessmentData>({
    userDetails: initialUserDetails,
    questionnaire: initialQuestionnaire,
    images: [],
  });

  // Function to send user details to backend
  const sendUserDetailsToBackend = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.userDetails.name,
          email: data.userDetails.email,
          age: parseInt(data.userDetails.age),
          gender: data.userDetails.gender,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send user details");
      }

      const result = await response.json();
      console.log("User details sent successfully:", result);
      
      toast({
        title: "Success",
        description: "Your details have been saved",
      });
      
      return true;
    } catch (error) {
      console.error("Error sending user details:", error);
      toast({
        title: "Error",
        description: "Failed to save your details. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Function to send questionnaire to backend
  const sendQuestionnaireToBackend = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/questionnaire`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data.questionnaire),
      });

      if (!response.ok) {
        throw new Error("Failed to send questionnaire");
      }

      const result = await response.json();
      console.log("Questionnaire sent successfully:", result);
      return true;
    } catch (error) {
      console.error("Error sending questionnaire:", error);
      toast({
        title: "Error",
        description: "Failed to save questionnaire. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!data.userDetails.name || !data.userDetails.email || !data.userDetails.age || !data.userDetails.gender) {
          toast({
            title: "Missing information",
            description: "Please fill in all required fields",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 2:
        if (!data.questionnaire.hairFallSeverity || !data.questionnaire.familyHistory || 
            !data.questionnaire.stressLevel || !data.questionnaire.dietQuality || 
            !data.questionnaire.sleepDuration || !data.questionnaire.hairWashFrequency) {
          toast({
            title: "Missing answers",
            description: "Please answer all questions",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 3:
        return true;
      default:
        return true;
    }
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) return;

    // Send data to backend when moving to next step
    if (currentStep === 1) {
      setIsSubmitting(true);
      const success = await sendUserDetailsToBackend();
      setIsSubmitting(false);
      
      if (!success) return; // Don't proceed if sending failed
      
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setIsSubmitting(true);
      const success = await sendQuestionnaireToBackend();
      setIsSubmitting(false);
      
      if (!success) return;
      
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Generate report
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const generatedReport = generateReport(data.questionnaire);
      setReport(generatedReport);
      setIsSubmitting(false);
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleReset = () => {
    setData({
      userDetails: initialUserDetails,
      questionnaire: initialQuestionnaire,
      images: [],
    });
    setReport(null);
    setCurrentStep(1);
  };

  return (
    <section id="assessment" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Assessment</span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-2 mb-4">
            Take the Hair Health Test
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Complete the assessment to receive your personalized hair health report
          </p>
        </motion.div>

        {/* Progress Steps */}
        {currentStep < 4 && (
          <div className="max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-between">
              {steps.slice(0, 3).map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                        currentStep > step.id
                          ? "gradient-primary text-primary-foreground"
                          : currentStep === step.id
                          ? "border-2 border-primary text-primary"
                          : "border-2 border-border text-muted-foreground"
                      }`}
                    >
                      {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : step.id}
                    </div>
                    <span className="text-xs mt-2 text-muted-foreground hidden md:block">
                      {step.title}
                    </span>
                  </div>
                  {index < 2 && (
                    <div
                      className={`w-16 md:w-24 lg:w-32 h-1 mx-2 rounded transition-all duration-300 ${
                        currentStep > step.id ? "gradient-primary" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="max-w-3xl mx-auto bg-card rounded-2xl p-6 md:p-10 shadow-card border border-border/50">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <UserDetailsForm
                key="step1"
                data={data.userDetails}
                onChange={(userDetails) => setData({ ...data, userDetails })}
              />
            )}
            {currentStep === 2 && (
              <QuestionnaireForm
                key="step2"
                data={data.questionnaire}
                onChange={(questionnaire) => setData({ ...data, questionnaire })}
              />
            )}
            {currentStep === 3 && (
              <ImageUploadForm
                key="step3"
                images={data.images}
                onChange={(images) => setData({ ...data, images })}
              />
            )}
            {currentStep === 4 && report && (
              <ReportDisplay
                key="step4"
                report={report}
                images={data.images}
                onReset={handleReset}
              />
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          {currentStep < 4 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 1 || isSubmitting}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button
                variant="hero"
                onClick={handleNext}
                disabled={isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? (
                  currentStep === 3 ? "Generating Report..." : "Saving..."
                ) : currentStep === 3 ? (
                  <>
                    Generate Report
                    <CheckCircle className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}