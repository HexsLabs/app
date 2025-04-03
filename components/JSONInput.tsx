"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface JSONInputProps {
  value: string;
  onChange: (value: string) => void;
}

function JSONInput({ value, onChange }: JSONInputProps) {
  const [isJsonValid, setIsJsonValid] = useState(true);
  const [envVarsError, setEnvVarsError] = useState("");

  const validateEnvJson = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);

      if (
        typeof parsed !== "object" ||
        parsed === null ||
        Array.isArray(parsed)
      ) {
        setIsJsonValid(false);
        setEnvVarsError("Environment variables must be a valid JSON object");
        return false;
      }

      // Check that all values are strings
      const allValuesAreStrings = Object.values(parsed).every(
        (value) => typeof value === "string"
      );
      if (!allValuesAreStrings) {
        setIsJsonValid(false);
        setEnvVarsError("All environment variable values must be strings");
        return false;
      }

      setIsJsonValid(true);
      setEnvVarsError("");
      return true;
    } catch (error) {
      setIsJsonValid(false);
      setEnvVarsError("Invalid JSON format");
      return false;
    }
  };

  // Format the JSON input
  const formatEnvJson = () => {
    try {
      const parsed = JSON.parse(value);
      const formatted = JSON.stringify(parsed, null, 2);
      onChange(formatted);
      validateEnvJson(formatted);
    } catch (error) {
      // If can't parse, keep as is
    }
  };

  return (
    <div className="relative">
      <div
        className={`absolute right-2 top-2 flex gap-2 ${
          isJsonValid ? "text-green-500" : "text-red-500"
        }`}
      >
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 text-xs hover:bg-secondary/20"
          onClick={formatEnvJson}
        >
          Format JSON
        </Button>
      </div>

      <div className="border rounded-md bg-secondary/10 border-border/30 overflow-hidden font-mono">
        <textarea
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            validateEnvJson(e.target.value);
          }}
          className={`w-full h-40 p-3 bg-transparent resize-none focus:outline-none text-sm ${
            isJsonValid ? "text-foreground" : "text-red-400"
          }`}
          placeholder={'{\n  "EXAMPLE_ENV_VAR": "EXAMPLE_VALUE"\n}'}
        />
      </div>

      {!isJsonValid && (
        <p className="text-xs text-red-400 mt-1">{envVarsError}</p>
      )}
    </div>
  );
}

export default JSONInput;
