import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendChatMessage } from "@/lib/reactQuery/apiWrappers";
import { ChatRequest } from "@/services/types";

// Query key factory
export const chatKeys = {
  all: ["chat"] as const,
  history: () => [...chatKeys.all, "history"] as const,
};

// Send chat message
export function useSendChatMessage(onStream?: (text: string) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ChatRequest) => sendChatMessage(request, onStream),
    onSuccess: () => {
      // Invalidate chat history if you have a query for it
      queryClient.invalidateQueries({ queryKey: chatKeys.history() });
    },
  });
}
