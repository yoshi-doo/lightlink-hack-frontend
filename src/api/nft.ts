import axios, { AxiosResponse } from "axios";
import { TokenDetailsApi } from "../types/types";

export type TokenDetail = {
  address: string;
  tokenId: string;
};

export const getTokenDetails = async (
  userAddress: string,
  tokenAddresses: string[]
) => {
  const apiResponses: Promise<AxiosResponse<TokenDetailsApi, any>>[] = [];
  tokenAddresses.forEach((address) => {
    const response = axios.get<TokenDetailsApi>(
      `https://pegasus.lightlink.io/api/v2/addresses/${userAddress}/token-transfers?type=ERC-721&filter=from&token=${address}`
    );
    apiResponses.push(response);
  });

  const result: TokenDetail[] = [];

  try {
    const responses = await Promise.all(apiResponses);
    for (const response of responses) {
      for (const item of response.data.items) {
        result.push({
          address: item.token.address,
          tokenId: item.total.token_id,
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
  return result;
};
