import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { get } from "@/api/client";
import type { ApiResponse, MetaType } from "@/api/types";
import { useI18n } from "@/providers/I18nProvider";

const META_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const META_GC_TIME = 30 * 60 * 1000; // 30 minutes

export function useMetaType(
  doctype: string,
): UseQueryResult<MetaType, Error> {
  const { language } = useI18n();
  return useQuery({
    queryKey: ["meta", doctype, language],
    queryFn: async () => {
      const res = await get<ApiResponse<MetaType>>(`meta/${doctype}`);
      return res.data;
    },
    staleTime: META_STALE_TIME,
    gcTime: META_GC_TIME,
    enabled: doctype.length > 0,
  });
}
