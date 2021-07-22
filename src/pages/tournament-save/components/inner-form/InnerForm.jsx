import React, { useState, useCallback } from "react";

import { Alert, Box, Button } from "components/material-ui";
import { GeneralInformation, Rounds, Steps, Sections } from "./components";
import { FitedForm } from "./styles";

export const InnerForm = (props) => {
  const { errors, isUpdate, handleSubmit, isSubmitting } = props;

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
    <FitedForm noValidate onSubmit={handleSubmit}>
      <Box position="relative" width="100%" height="100%" py={2}>
        <Box width="100%" height="100%" overflow="auto">
          <Box width="calc(100% - 240px)" p={5}>
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
            {verified[0] && verified[1] && verified[2] ? (
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="contained"
                color="primary"
                my={5}
              >
                {isUpdate ? "Update Tournament" : "Create Tournament"}
              </Button>
            ) : (
              <></>
            )}
          </Box>
        </Box>
        <Steps
          activeStep={activeStep}
          isUpdate={isUpdate}
          verified={verified}
          isSubmitting={isSubmitting}
          width="220px"
          right="20px"
          top="20px"
        />
      </Box>
    </FitedForm>
  );
};
