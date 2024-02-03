import { useQuery } from "@tanstack/react-query";
import { getTokenDetails } from "../api/nft";

const key = "nft";

export const useGetTokenDetails = (
  userAddress: string,
  tokenAddresses: string[]
) => {
  return useQuery({
    queryKey: [key, userAddress, tokenAddresses],
    queryFn: () => getTokenDetails(userAddress, tokenAddresses),
  });
};
