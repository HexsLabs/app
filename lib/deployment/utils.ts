export const isDeploymentActive = (
  createdAt: string,
  duration: string
): boolean => {
  const createdAtDate = new Date(createdAt);
  let durationSeconds = 0;

  if (duration.endsWith("h")) {
    durationSeconds = parseInt(duration) * 3600;
  } else if (duration.endsWith("m")) {
    durationSeconds = parseInt(duration) * 60;
  } else if (duration.endsWith("s")) {
    durationSeconds = parseInt(duration);
  } else {
    durationSeconds = parseInt(duration) || 0;
  }
  const endTime = new Date(createdAtDate.getTime() + durationSeconds * 1000);
  const now = new Date();
  return endTime.getTime() > now.getTime();
};
