import React, { ReactNode } from "react";

interface TemplateContainerProps {
  children: ReactNode;
}

export default function TemplateContainer({
  children,
}: TemplateContainerProps) {
  return <div className="container mx-auto px-16 py-6 ">{children}</div>;
}
