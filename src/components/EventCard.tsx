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
  Snackbar,
} from "@mui/material";

export const StyledButton = styled(Button)(() => ({
  backgroundColor: "#84309c",
  borderColor: "#84309c",
  "&:hover": {
    backgroundColor: "#4d1d54",
    borderColor: "#4d1d54",
  },
}));
export const style = {
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
export default function EventCard({ address }: { address: string }) {
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
    mutateAsync: buy,
    isLoading: isBuying,
    isSuccess: isSuccessfullyBought,
    isError: isErrorBought,
    error,
  } = useContractWrite(contract, "buy");

  const connectionStatus = useConnectionStatus();

  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const handleOpen = () => {
    setMessage("");
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

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
              Buy
            </StyledButton>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                {connectionStatus !== "connected" ? (
                  <>
                    <Typography
                      id="modal-modal-title"
                      component="h2"
                      color="black"
                      sx={{ paddingBottom: "15px" }}
                    >
                      Please connect your wallet to continue ...
                    </Typography>
                    <ConnectWallet
                      theme={"dark"}
                      switchToActiveChain={true}
                      modalSize={"compact"}
                    />
                  </>
                ) : (
                  <>
                    <Typography
                      id="modal-modal-title"
                      component="h2"
                      color="black"
                      sx={{ paddingBottom: "15px" }}
                    >
                      Buy ticket for {eventDetails.name} with{" "}
                      {ethers.utils.formatEther(eventDetails.price)} Ether?
                    </Typography>
                    {isBuying && (
                      <CircularProgress
                        size={36}
                        sx={{
                          color: "#84309c",
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          marginTop: "-12px",
                          marginLeft: "-12px",
                        }}
                      />
                    )}
                    {message && (
                      <Typography
                        id="modal-modal-title"
                        component="h2"
                        color="orange"
                        sx={{ paddingBottom: "15px" }}
                      >
                        {message ? `${message}` : ""}
                      </Typography>
                    )}
                    <Stack
                      spacing={2}
                      direction="row"
                      sx={{
                        marginTop: "35px",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <StyledButton
                        type="submit"
                        variant="contained"
                        onClick={async () => {
                          try {
                            const res = await buy({
                              args: [address, 1],
                              overrides: { value: eventDetails.price },
                            });
                            setMessage("Purchase successful");
                            setTimeout(() => {
                              handleClose();
                            }, 2000);
                          } catch (error) {
                            // @ts-ignore
                            console.error(error?.reason as s);
                            // @ts-ignore
                            setMessage(error.reason);
                            setTimeout(() => {
                              handleClose();
                            }, 2000);
                          }
                        }}
                      >
                        Yes
                      </StyledButton>
                      <StyledButton
                        type="submit"
                        variant="contained"
                        onClick={handleClose}
                      >
                        No
                      </StyledButton>
                    </Stack>
                  </>
                )}
              </Box>
            </Modal>
          </CardActions>
        </Card>
      )}
    </>
  );
}
