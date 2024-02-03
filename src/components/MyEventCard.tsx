import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button, { ButtonProps } from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  ConnectWallet,
  useConnectionStatus,
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import { EventFactory__factory } from "../types/ethers-contracts";
import { ethers } from "ethers";
import {
  Modal,
  Box,
  Stack,
  styled,
  CircularProgress,
  TextField,
} from "@mui/material";

const StyledButton = styled(Button)(() => ({
  backgroundColor: "#84309c",
  borderColor: "#84309c",
  "&:hover": {
    backgroundColor: "#4d1d54",
    borderColor: "#4d1d54",
  },
}));

const StyledTextField = styled(TextField)(() => ({
  margin: "0.5rem",
  width: "400px",
}));

export const StyledForm = styled("form")(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "2rem",
}));

export default function MyEventCard({ address }: { address: string }) {
  const abi = EventFactory__factory.abi;
  const { contract } = useContract(
    import.meta.env.VITE_CONTRACT_ADDRESSES,
    abi
  );

  const { data: eventDetails, isLoading } = useContractRead(
    contract,
    "getEventDetails",
    [address]
  );

  const {
    mutateAsync: validate,
    isLoading: isValidating,
    isError: isErrorBought,
    error,
  } = useContractWrite(contract, "validate");

  const connectionStatus = useConnectionStatus();

  const [userAddress, setUserAddress] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [errorMsg, setErrMsg] = React.useState("");
  const [tokenId, setTokenId] = React.useState("");

  const handleOpen = () => {
    setErrMsg("");
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const handleChangeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAddress(e.target.value);
  };

  const handleChangeTokenId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTokenId(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await validate({
        args: [address, tokenId, userAddress],
      });
      console.log("res", res);
    } catch (e) {
      const error = e as Error;
      console.error(error.message);
    } finally {
      handleClose();
    }
  };

  return (
    <>
      {isLoading ? (
        <p></p>
      ) : (
        <Card sx={{ maxWidth: 345 }}>
          <CardMedia
            sx={{ height: 0, paddingTop: "60%", objectFit: "contain" }}
            image={eventDetails.imageUrl}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {eventDetails.name}
            </Typography>
            <Typography variant="body2">
              Date: {eventDetails.dateTime}
            </Typography>
            <Typography variant="body2">
              Location: {eventDetails.location}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ paddingTop: "5px" }}
            >
              {eventDetails.description}
            </Typography>
            <Typography variant="body2" sx={{ paddingTop: "10px" }}>
              Price: {ethers.utils.formatEther(eventDetails.price)} Ether
            </Typography>
            <Typography variant="body2" sx={{ paddingTop: "5px" }}>
              Tickets available:{" "}
              {ethers.utils.formatUnits(eventDetails.availableTickets, 0)}
            </Typography>
          </CardContent>
          <CardActions>
            <StyledButton size="small" variant="contained" onClick={handleOpen}>
              Validate User
            </StyledButton>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <>
                  <Typography
                    id="modal-modal-title"
                    component="h4"
                    color="black"
                    sx={{ paddingBottom: "15px" }}
                  >
                    Please enter the user address and token id to validate{" "}
                  </Typography>
                  <StyledForm onSubmit={handleSubmit}>
                    <TextField
                      name="User address"
                      label="User address"
                      value={userAddress}
                      onChange={handleChangeAddress}
                      variant="outlined"
                      type="string"
                      sx={{ paddingBottom: "10px" }}
                    />
                    <TextField
                      name="Token Id"
                      label="Token Id"
                      value={tokenId}
                      onChange={handleChangeTokenId}
                      variant="outlined"
                      type="number"
                      sx={{ paddingBottom: "10px" }}
                    />

                    {isValidating ? (
                      <CircularProgress size={35} />
                    ) : (
                      <StyledButton
                        type="submit"
                        color="primary"
                        variant="contained"
                      >
                        Validate
                      </StyledButton>
                    )}
                  </StyledForm>
                </>
              </Box>
            </Modal>
          </CardActions>
        </Card>
      )}
    </>
  );
}
