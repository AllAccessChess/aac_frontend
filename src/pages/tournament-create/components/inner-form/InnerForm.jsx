import React from "react";

import { Alert, Button } from "components/material-ui";
import { BasicInformation, Rounds } from "./components";

export const InnerForm = (props) => {
  const { errors, handleSubmit, isSubmitting } = props;

  return (
    <form noValidate onSubmit={handleSubmit}>
      {errors.submit && (
        <Alert mt={2} mb={1} severity="warning">
          {errors.submit}
        </Alert>
      )}
      <BasicInformation {...props} />
      <Rounds {...props} />

      <Button
        type="submit"
        fullWidth
        disabled={isSubmitting}
        variant="contained"
        color="secondary"
        size="large"
        my={5}
      >
        Create Tournament
      </Button>
    </form>
  );
};
