import MatrixService from "@/services/MatrixService";
import { useModel } from "umi";

export default function useAog(): { data: any, loading: boolean } {
  const { matrixService, loading } = useModel("useServices");

  if (loading) {
    return { data: { matrix: [], lastModified: 0 }, loading: true };
  }


  return {
    data: matrixService.matrix,
    loading: false,
  };
}
