import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children?: React.ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn("space-y-6 max-w-5xl mx-auto w-full", className)}>
      {children}
    </div>
  );
};

export default Container;
