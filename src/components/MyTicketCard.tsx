import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button, { ButtonProps } from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import VerifiedIcon from "@mui/icons-material/Verified";
import {
  ConnectWallet,
  useConnectionStatus,
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import {
  EventFactory__factory,
  Event__factory,
} from "../types/ethers-contracts";
import { ethers } from "ethers";
import { Modal, Box, Stack, styled, CircularProgress } from "@mui/material";

export interface MetaData {
  name: string;
  description: string;
  image: string;
  attributes: Attribute[];
}

export interface Attribute {
  trait_type: string;
  value: any;
}

const StyledButton = styled(Button)(() => ({
  backgroundColor: "#84309c",
  borderColor: "#84309c",
  "&:hover": {
    backgroundColor: "#4d1d54",
    borderColor: "#4d1d54",
  },
}));

const getTrait = (trait: string, attributes: Attribute[]) => {
  for (const attribute of attributes) {
    if (attribute.trait_type === trait) {
      return attribute.value;
    }
  }
  return;
};

export default function MyTicketCard({
  address,
  tokenId,
}: {
  address: string;
  tokenId: string;
}) {
  const abi = Event__factory.abi;
  const { contract } = useContract(address, abi);

  const { data: tokenMetaData, isLoading } = useContractRead(
    contract,
    "tokenURI",
    [tokenId]
  ) as { data: string; isLoading: boolean };

  if (!tokenMetaData) return <></>;

  const match = tokenMetaData.match(/\{.*\}/);
  const metadata = (match ? JSON.parse(match[0]) : {}) as MetaData;
  const date = getTrait("date_time", metadata.attributes) as string;
  const location = getTrait("location", metadata.attributes) as string;
  const isValidated = getTrait("is_validated", metadata.attributes) as boolean;

  return (
    <>
      {isLoading ? (
        <p></p>
      ) : (
        <Card sx={{ maxWidth: 345 }}>
          <CardMedia
            sx={{ height: 0, paddingTop: "60%", objectFit: "contain" }}
            image={metadata.image}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {metadata.name}
            </Typography>
            <Typography variant="body2">Ticket Id: #{tokenId}</Typography>
            <Typography variant="body2">Date: {date}</Typography>
            <Typography variant="body2">Location: {location}</Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ paddingTop: "5px" }}
            >
              {metadata.description}
            </Typography>

            {isValidated ? (
              <Box display="flex">
                <VerifiedIcon color="success" />
                <Typography variant="body2">Ticket is verified</Typography>
              </Box>
            ) : (
              <Box display="flex" paddingTop="5px">
                <VerifiedIcon sx={{ color: "orange", paddingRight: "5px" }} />
                <Typography variant="body2">
                  Ticket yet to be verified.
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
