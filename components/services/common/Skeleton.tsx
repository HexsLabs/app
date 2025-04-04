import React from "react";

interface SkeletonProps {
  className: string;
}

const Skeleton = ({ className }: SkeletonProps) => (
  <div className={`animate-pulse bg-secondary/40 rounded ${className}`}></div>
);

export default Skeleton;
