import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, AlertCircle, Heart, TrendingUp, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HairHealthReport, UploadedImage, imageLabels } from "@/types/assessment";

interface ReportDisplayProps {
  report: HairHealthReport;
  images: UploadedImage[];
  onReset: () => void;
}

export function ReportDisplay({ report, images, onReset }: ReportDisplayProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "high":
        return "text-red-600 bg-red-100";
      default:
        return "text-muted-foreground bg-secondary";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "low":
        return <CheckCircle className="w-6 h-6" />;
      case "medium":
        return <AlertCircle className="w-6 h-6" />;
      case "high":
        return <AlertTriangle className="w-6 h-6" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h3 className="text-2xl font-bold text-foreground mb-2">Your Hair Health Report</h3>
        <p className="text-muted-foreground">
          Generated on {report.generatedAt.toLocaleDateString()}
        </p>
      </div>

      {/* Risk Level Card */}
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-foreground">Overall Risk Level</h4>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${getRiskColor(report.overallRiskLevel)}`}>
            {getRiskIcon(report.overallRiskLevel)}
            <span className="font-semibold capitalize">{report.overallRiskLevel}</span>
          </div>
        </div>
        
        <div className="relative h-4 bg-secondary rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${report.riskScore}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`absolute left-0 top-0 h-full rounded-full ${
              report.riskScore >= 50 ? "bg-red-500" : report.riskScore >= 25 ? "bg-yellow-500" : "bg-green-500"
            }`}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Risk Score: {report.riskScore}/100
        </p>
      </div>

      {/* Uploaded Images */}
      {images.length > 0 && (
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
          <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Submitted Images
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="space-y-2">
                <img
                  src={image.preview}
                  alt={imageLabels[image.label]}
                  className="w-full aspect-square object-cover rounded-xl"
                />
                <p className="text-xs text-center text-muted-foreground">
                  {imageLabels[image.label]}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lifestyle Impact */}
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Lifestyle Impact Assessment
        </h4>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
          report.lifestyleImpact === "significant" 
            ? "bg-red-100 text-red-600" 
            : report.lifestyleImpact === "moderate"
            ? "bg-yellow-100 text-yellow-600"
            : "bg-green-100 text-green-600"
        }`}>
          <span className="font-medium capitalize">{report.lifestyleImpact} Impact</span>
        </div>
        {report.scalpHealthWarning && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800">
                <strong>Scalp Health Warning:</strong> Multiple scalp issues detected. 
                Consider consulting a dermatologist for proper evaluation.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Possible Causes */}
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-primary" />
          Identified Factors
        </h4>
        <ul className="space-y-2">
          {report.possibleCauses.map((cause, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
              <span className="text-muted-foreground">{cause}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recommendations */}
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          Recommendations
        </h4>
        <ul className="space-y-3">
          {report.recommendations.map((rec, index) => (
            <li key={index} className="flex items-start gap-3 p-3 bg-secondary/30 rounded-xl">
              <span className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
                {index + 1}
              </span>
              <span className="text-foreground">{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Disclaimer */}
      <div className="bg-secondary/50 rounded-xl p-4 border border-border/50">
        <p className="text-sm text-muted-foreground text-center">
          <strong>Disclaimer:</strong> This report provides general guidance based on your responses 
          and is not a substitute for professional medical advice. Please consult a qualified 
          healthcare provider or dermatologist for diagnosis and treatment.
        </p>
      </div>

      <div className="text-center">
        <Button variant="outline" size="lg" onClick={onReset}>
          Take Another Assessment
        </Button>
      </div>
    </motion.div>
  );
}
