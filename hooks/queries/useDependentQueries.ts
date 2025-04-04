import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/apiService";
import { useUserProfile } from "./useUser";
import { useDeployments } from "./useDeployments";

export function useUserDeployments() {
  // query to get the user profile
  const {
    data: userProfile,
    isLoading: isLoadingUser,
    error: userError,
  } = useUserProfile();

  // query that depends on the result of the first query
  // only call it when userProfile?.id exists
  const {
    data: deployments,
    isLoading: isLoadingDeployments,
    error: deploymentsError,
  } = userProfile?.id
    ? useDeployments(userProfile.id, undefined, undefined)
    : { data: undefined, isLoading: false, error: undefined };

  return {
    userProfile,
    deployments,
    isLoading: isLoadingUser || isLoadingDeployments,
    error: userError || deploymentsError,
  };
}

interface Project {
  id: number;
  name: string;
}

interface Task {
  id: number;
  projectId: number;
  title: string;
}

// fetch a project by ID
const fetchProject = async (projectId: number): Promise<Project> => {
  return apiService.request<Project>(`/api/projects/${projectId}`);
};

// fetch tasks for a project
const fetchProjectTasks = async (projectId: number): Promise<Task[]> => {
  return apiService.request<Task[]>(`/api/projects/${projectId}/tasks`);
};

// hook to fetch a project and its tasks
export function useProjectWithTasks(projectId: number) {
  // query for the project
  const projectQuery = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProject(projectId),
    enabled: !!projectId,
  });

  // query for the project's tasks (depends on project query)
  const tasksQuery = useQuery({
    queryKey: ["project", projectId, "tasks"],
    queryFn: () => fetchProjectTasks(projectId),
    // run this query only if the project query was successful
    enabled: !!projectId && !!projectQuery.data,
  });

  return {
    project: projectQuery.data,
    tasks: tasksQuery.data,
    isLoading: projectQuery.isLoading || tasksQuery.isLoading,
    isError: projectQuery.isError || tasksQuery.isError,
  };
}
