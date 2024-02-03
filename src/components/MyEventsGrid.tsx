import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { zodResolver } from "@hookform/resolvers/zod";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import EventCard, { StyledButton } from "./EventCard";
import {
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import { EventFactory__factory } from "../types/ethers-contracts";
import MyEventCard, { StyledForm } from "./MyEventCard";
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Modal,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { z } from "zod";
import { FieldValues, useForm } from "react-hook-form";
import { ethers } from "ethers";
import { style } from "./EventCard";
import { CustomTabPanel } from "./FeatureTabs";

const schema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  symbol: z.string().min(1, { message: "Symbol is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  image: z.string().min(1),
  image_validated: z.string().min(1),
  date_time: z.string().min(1),
  location: z.string().min(1),
  price: z.string().min(1, { message: "Price is required" }),
  amount: z.string().min(1, { message: "Amount is required" }),
  max_tickets_per_user: z.string().min(1),
});

const StyledTextField = styled(TextField)(() => ({
  margin: "0.5rem",
  width: "400px",
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function MyEventGrid() {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const { register, reset, handleSubmit, formState } = useForm({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    resolver: zodResolver(schema),
  });

  const { errors } = formState;

  const address = useAddress();
  if (!address) return;
  const abi = EventFactory__factory.abi;
  const { contract } = useContract(
    import.meta.env.VITE_CONTRACT_ADDRESSES,
    abi
  );

  const {
    data: createdEvents,
    isLoading,
    error,
  } = useContractRead(contract, "getCreatedEvents", [address]);

  const { data: listingFee, isError: isCreatingError } = useContractRead(
    contract,
    "listingFee"
  );

  const {
    mutateAsync: create,
    isLoading: isCreating,
    isError: isErrorBought,
    error: createError,
  } = useContractWrite(contract, "create");

  const handleOpen = () => {
    setMessage("");
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleSave = async (formValues: FieldValues) => {
    const args = [
      formValues.name,
      formValues.symbol,
      formValues.description,
      formValues.image,
      formValues.image_validated,
      formValues.date_time,
      formValues.location,
      formValues.amount,
      ethers.utils.parseEther(formValues.price),
      formValues.max_tickets_per_user,
    ];
    console.log("listingFee", listingFee);
    try {
      console.log(args);
      const res = await create({
        args: args,
        overrides: { value: listingFee },
      });
      setMessage("Event creation successful");
      setTimeout(() => {
        console.log("Success!");
        handleClose();
      }, 2000);
    } catch (error) {
      console.log(error.reason);
      setMessage(error.reason);
      setTimeout(() => {
        console.log("Failure!");
        // handleClose();
      }, 2000);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, paddingTop: "10px" }}>
      <StyledButton size="small" variant="contained" onClick={handleOpen}>
        Create Event
      </StyledButton>
      <Grid container spacing={2} paddingTop="15px">
        {isLoading ? (
          <p>Events Loading...</p>
        ) : (
          createdEvents.map((event: string) => (
            <Grid item key={event}>
              <MyEventCard address={event} />
            </Grid>
          ))
        )}
      </Grid>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle align="center" paddingTop="15px">
          Create new event
        </DialogTitle>
        <DialogContent>
          <Box sx={{ width: "100%" }}>
            <StyledForm onSubmit={handleSubmit(handleSave)}>
              <StyledTextField
                {...register("name")}
                variant="outlined"
                label="Name"
                error={errors.name ? true : false}
                helperText={errors.name?.message as string}
              />
              <StyledTextField
                {...register("symbol")}
                variant="outlined"
                label="Symbol"
                error={errors.symbol ? true : false}
                helperText={errors.symbol?.message as string}
              />
              <StyledTextField
                {...register("description")}
                multiline
                maxRows={2}
                variant="outlined"
                label="Description"
                error={errors.description ? true : false}
                helperText={errors.description?.message as string}
              />
              <StyledTextField
                {...register("image")}
                name="image"
                variant="outlined"
                label="Image Url"
                error={errors.image ? true : false}
                helperText={errors.image?.message as string}
              />
              <StyledTextField
                {...register("image_validated")}
                name="image_validated"
                variant="outlined"
                label="Validated Image Url"
                error={errors.image_validated ? true : false}
                helperText={errors.image_validated?.message as string}
              />
              <StyledTextField
                {...register("date_time")}
                name="date_time"
                variant="outlined"
                label="Date Time"
                error={errors.date_time ? true : false}
                helperText={errors.date_time?.message as string}
              />
              <StyledTextField
                {...register("location")}
                name="location"
                variant="outlined"
                label="Location"
                error={errors.location ? true : false}
                helperText={errors.location?.message as string}
              />
              <StyledTextField
                {...register("price")}
                name="price"
                variant="outlined"
                label="Price in Eth"
                type="number"
                inputProps={{ step: "0.0001" }}
                error={errors.price ? true : false}
                helperText={errors.price?.message as string}
              />
              <StyledTextField
                {...register("amount")}
                name="amount"
                variant="outlined"
                label="Amount"
                type="number"
                inputProps={{ step: "1" }}
                error={errors.amount ? true : false}
                helperText={errors.amount?.message as string}
              />
              <StyledTextField
                {...register("max_tickets_per_user")}
                name="max_tickets_per_user"
                variant="outlined"
                label="Max allowed tickets per user"
                type="number"
                inputProps={{ step: "1" }}
                error={errors.amomax_tickets_per_userunt ? true : false}
                helperText={errors.max_tickets_per_user?.message as string}
              />
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

              {isCreating ? (
                <CircularProgress size={35} />
              ) : (
                <StyledButton type="submit" color="primary" variant="contained">
                  Create
                </StyledButton>
              )}
            </StyledForm>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
