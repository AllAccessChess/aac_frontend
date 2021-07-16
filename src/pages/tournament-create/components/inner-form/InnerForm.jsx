import React, { useState } from "react";

import { Alert, Box } from "components/material-ui";
import { GeneralInformation, Rounds, Steps, Sections } from "./components";

export const InnerForm = (props) => {
  const { errors, handleSubmit, isSubmitting } = props;
  const [activeStep, setActiveStep] = useState(0);

  return (
    <form noValidate onSubmit={handleSubmit}>
      <Box position="relative" width="100%">
        <Box width="calc(100% - 220px)">
          {errors.submit && (
            <Alert mt={2} mb={1} severity="warning">
              {errors.submit}
            </Alert>
          )}
          <GeneralInformation
            {...props}
            status={activeStep === 0 ? "active" : null}
            onNext={() => setActiveStep(1)}
            onOpen={() => setActiveStep(0)}
          />
          <Sections
            {...props}
            status={activeStep === 1 ? "active" : null}
            onNext={() => setActiveStep(2)}
            onOpen={() => setActiveStep(1)}
          />
          <Rounds
            {...props}
            status={activeStep === 2 ? "active" : null}
            onOpen={() => setActiveStep(2)}
          />
        </Box>
        <Steps
          activeStep={activeStep}
          isSubmitting={isSubmitting}
          width="200px"
        />
      </Box>
    </form>
  );
};
