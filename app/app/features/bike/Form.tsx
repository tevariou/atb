import { useEffect } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm, Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

interface IFormInput {
  firstName: string;
}

const Form = () => {
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      firstName: "",
    },
  })

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data)
  }

  useEffect(() => {
    const subscription = watch(() => handleSubmit(onSubmit)())
    return () => subscription.unsubscribe();
  }, [handleSubmit, watch]);

  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <Controller
        name="firstName"
        control={control}
        render={({ field }) => <TextField {...field} />}
      />
    </Box>
  )
}

export default Form;
