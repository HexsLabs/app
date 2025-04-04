import { useInfiniteQuery } from "@tanstack/react-query";
import { apiService } from "@/services/apiService";
import { Deployment } from "@/services/types";

// Define pagination response type
interface PaginatedResponse<T> {
  data: T[];
  nextPage: number | null;
  totalPages: number;
  totalItems: number;
}

// test implementation to fetch paginated deployments (might need to change)
const fetchDeploymentPage = async (
  userId: string,
  page = 1,
  limit = 10
): Promise<PaginatedResponse<Deployment>> => {
  const response = await apiService.request<PaginatedResponse<Deployment>>(
    `/api/deployments/paginated?userId=${userId}&page=${page}&limit=${limit}`
  );
  return response;
};

// Infinite query for deployments pagination
export function useInfiniteDeployments(userId: string, limit = 10) {
  return useInfiniteQuery({
    queryKey: ["infiniteDeployments", userId, limit],
    queryFn: ({ pageParam = 1 }) =>
      fetchDeploymentPage(userId, pageParam, limit),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    // Only fetch the first page initially
    initialPageParam: 1,
  });
}

// Usage example:
/*
function DeploymentsList() {
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    status 
  } = useInfiniteDeployments(userId);

  // Render your list
  return (
    <div>
      {status === 'pending' ? (
        <p>Loading...</p>
      ) : status === 'error' ? (
        <p>Error loading deployments</p>
      ) : (
        <>
          {data.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.data.map((deployment) => (
                <DeploymentItem key={deployment.id} deployment={deployment} />
              ))}
            </React.Fragment>
          ))}
          <div>
            <button
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage
                ? 'Loading more...'
                : hasNextPage
                ? 'Load More'
                : 'Nothing more to load'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
*/
