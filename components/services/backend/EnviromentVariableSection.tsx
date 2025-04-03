import JSONInput from "@/components/JSONInput";

export default function EnviromentVariableSection({ envVarsJson, setEnvVarsJson }: { envVarsJson: string, setEnvVarsJson: (value: string) => void }) {
  return (
    <div className="dashboard-card mb-8">
      <h3 className="text-lg font-medium mb-4">Environment Variables</h3>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Define environment variables for your deployment as a JSON object.
        </p>

        <JSONInput
          value={envVarsJson}
          onChange={(value) => setEnvVarsJson(value)}
        />
      </div>
    </div>
  );
}
