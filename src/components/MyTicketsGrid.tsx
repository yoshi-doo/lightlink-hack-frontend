import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import { EventFactory__factory } from "../types/ethers-contracts";
import { TokenDetail, getTokenDetails } from "../api/nft";
import { useGetTokenDetails } from "../hooks/useNft";
import MyTicketCard from "./MyTicketCard";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function MyTicketsGrid() {
  const address = useAddress();
  if (!address) return;
  const [tokenLoading, setTokenLoading] = React.useState(false);
  const [tokenDetails, setTokenDetails] = React.useState<TokenDetail[] | null>(
    null
  );
  const abi = EventFactory__factory.abi;
  const { contract } = useContract(
    import.meta.env.VITE_CONTRACT_ADDRESSES,
    abi
  );

  const { data: eventAddresses, isLoading } = useContractRead(
    contract,
    "getOwnedTicketEvents",
    [address]
  ) as { data: string[]; isLoading: boolean };
  React.useEffect(() => {
    if (!eventAddresses) setTokenDetails(null);
    setTokenLoading(true);
    getTokenDetails(address, [...new Set(eventAddresses)]).then((response) =>
      setTokenDetails(response)
    );
    setTokenLoading(false);
  }, [eventAddresses]);

  return (
    <Box sx={{ flexGrow: 1, paddingTop: "10px" }}>
      <Grid container spacing={2}>
        {tokenLoading ? (
          <p>Events Loading...</p>
        ) : (
          tokenDetails &&
          tokenDetails.map((tokenDetail) => (
            <Grid item key={`#${tokenDetail.tokenId}-${tokenDetail.address}`}>
              <MyTicketCard
                address={tokenDetail.address}
                tokenId={tokenDetail.tokenId}
              />
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}
