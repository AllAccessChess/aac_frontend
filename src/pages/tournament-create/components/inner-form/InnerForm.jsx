import React, { useState, useCallback } from "react";

import { Alert, Box } from "components/material-ui";
import { GeneralInformation, Rounds, Steps, Sections } from "./components";

export const InnerForm = (props) => {
  const { errors, handleSubmit, isSubmitting } = props;

  const [activeStep, setActiveStep] = useState(0);
  const [verified, setVerified] = useState([false, false, false]);

  const handleSetVeified = useCallback(
    (index, value) => {
      setVerified((previous) => {
        let newState = [...previous];
        newState[index] = value;
        return newState;
      });
    },
    [setVerified]
  );

  return (
    <form noValidate onSubmit={handleSubmit}>
      <Box position="relative" width="100%">
        <Box width="calc(100% - 240px)">
          {errors.submit && (
            <Alert mt={2} mb={1} severity="warning">
              {errors.submit}
            </Alert>
          )}
          <GeneralInformation
            {...props}
            active={activeStep === 0}
            verified={verified}
            onOpen={() => setActiveStep(0)}
            onNext={() => setActiveStep(1)}
            onVerify={(value) => handleSetVeified(0, value)}
          />
          <Sections
            {...props}
            active={activeStep === 1}
            verified={verified}
            onOpen={() => setActiveStep(1)}
            onNext={() => setActiveStep(2)}
            onVerify={(value) => handleSetVeified(1, value)}
          />
          <Rounds
            {...props}
            active={activeStep === 2}
            verified={verified}
            onOpen={() => setActiveStep(2)}
            onVerify={(value) => handleSetVeified(2, value)}
          />
        </Box>
        <Steps
          activeStep={activeStep}
          verified={verified}
          isSubmitting={isSubmitting}
          width="220px"
        />
      </Box>
    </form>
  );
};
