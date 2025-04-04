import React, { ReactNode } from "react";

interface TemplateContainerProps {
  children: ReactNode;
}

export default function TemplateContainer({
  children,
}: TemplateContainerProps) {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
      {children}
    </div>
  );
}
