import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import EventCard from "./EventCard";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { EventFactory__factory } from "../types/ethers-contracts";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function EventGrid() {
  const abi = EventFactory__factory.abi;
  const { contract } = useContract(
    import.meta.env.VITE_CONTRACT_ADDRESSES,
    abi
  );

  const {
    data: currentEvents,
    isLoading,
    error,
  } = useContractRead(contract, "getCurrentEvents");

  return (
    <Box sx={{ flexGrow: 1, paddingTop: "10px" }}>
      <Grid container spacing={2}>
        {isLoading ? (
          <p>Events Loading...</p>
        ) : (
          currentEvents.map((event: string) => (
            <Grid item key={event}>
              <EventCard address={event} />
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}
