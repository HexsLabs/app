"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import TemplateContainer from "@/components/templates/TemplateContainer";
import TemplateHeader from "@/components/templates/TemplateHeader";
import TemplateDetailsCard from "@/components/templates/TemplateDetailsCard";
import { useTemplateDeploy } from "@/components/templates/TemplateDeployLogic";

const StreamlitCalculatorTemplate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/app/templates";
  const { user, isLoading } = useAuth();

  const handleBack = () => {
    router.push(from);
  };

  const templateDetails = {
    "Repository URL": "https://github.com/Aquanodeio/templates.git",
    "Branch Name": "streamlit-example",
    "Run Commands": "pip3 install -r requirements.txt && streamlit run main.py",
    "App Port": "8501",
    "Deployment Duration": "1h",
    "CPU Units": "0.5",
    "Memory Size": "1Gi",
    "Storage Size": "3Gi",
  };

  const { isDeploying, handleDeploy, isButtonDisabled } = useTemplateDeploy({
    templateDetails,
    user,
    isAuthLoading: isLoading,
  });

  return (
    <TemplateContainer>
      <TemplateHeader
        title="Streamlit Python Calculator Template"
        description="Interactive calculator built with Python and Streamlit for a modern data-focused web interface."
        onBackClick={handleBack}
      />

      <TemplateDetailsCard
        templateDetails={templateDetails}
        isDeploying={isDeploying}
        onDeploy={handleDeploy}
        disabled={isButtonDisabled}
      />
    </TemplateContainer>
  );
};

export default StreamlitCalculatorTemplate;
