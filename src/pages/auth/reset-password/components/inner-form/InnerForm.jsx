import React from "react";
import { Alert, Box, TextField, Button } from "components/material-ui";

export const InnerForm = (props) => {
  const {
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
    touched,
    values,
  } = props;
  return (
    <form noValidate onSubmit={handleSubmit}>
      {errors.submit && (
        <Alert mt={2} mb={1} severity="warning">
          {errors.submit}
        </Alert>
      )}
      <TextField
        type="email"
        name="email"
        label="Email"
        variant="outlined"
        color="secondary"
        value={values.email}
        error={Boolean(touched.email && errors.email)}
        fullWidth
        helperText={touched.email && errors.email}
        onBlur={handleBlur}
        onChange={handleChange}
        my={3}
      />
      <Box my={5}>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="secondary"
          disabled={isSubmitting}
          size="large"
        >
          Continue
        </Button>
      </Box>
    </form>
  );
};
