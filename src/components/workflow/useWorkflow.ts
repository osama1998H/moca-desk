import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { get, post } from "../../api/client";
import type {
  WorkflowActionRecord,
  WorkflowStateResponse,
  WorkflowTransitionRequest,
  WorkflowTransitionResponse,
} from "../../api/types";

export function useWorkflowState(
  doctype: string,
  name: string,
): UseQueryResult<WorkflowStateResponse, Error> {
  return useQuery({
    queryKey: ["workflowState", doctype, name],
    queryFn: () =>
      get<WorkflowStateResponse>(
        `workflow/${doctype}/${encodeURIComponent(name)}/state`,
      ),
    enabled: doctype.length > 0 && name.length > 0,
  });
}

export function useWorkflowHistory(
  doctype: string,
  name: string,
): UseQueryResult<WorkflowActionRecord[], Error> {
  return useQuery({
    queryKey: ["workflowHistory", doctype, name],
    queryFn: async () => {
      const res = await get<{ data: WorkflowActionRecord[] }>(
        `workflow/${doctype}/${encodeURIComponent(name)}/history`,
      );
      return res.data;
    },
    enabled: doctype.length > 0 && name.length > 0,
  });
}

export function useWorkflowTransition(
  doctype: string,
  name: string,
): UseMutationResult<WorkflowTransitionResponse, Error, WorkflowTransitionRequest> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: WorkflowTransitionRequest) =>
      post<WorkflowTransitionResponse>(
        `workflow/${doctype}/${encodeURIComponent(name)}/transition`,
        req,
      ),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["workflowState", doctype, name] });
      void qc.invalidateQueries({ queryKey: ["workflowHistory", doctype, name] });
      void qc.invalidateQueries({ queryKey: ["doc", doctype, name] });
    },
  });
}
