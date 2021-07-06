import React, { useCallback, useMemo } from "react";
import { diff } from "deep-object-diff";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle as FaTimesCircleIcon } from "@fortawesome/free-solid-svg-icons";

import { VALID_USCF_LENGTH } from "constant";
import { Spinner } from "components/common";
import {
  Alert,
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
} from "components/material-ui";

import { EmptyWrapper } from "./styles";

export const InnerForm = (props) => {
  const {
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
    touched,
    values,
    initialValues,
    setFieldValue,
    uscfData,
    setUscfData,
    uscfSubmitting,
    onUSCFSubmit,
  } = props;

  const isDirty = useMemo(
    () => Object.keys(diff(values, initialValues)).length,
    [values, initialValues]
  );

  const handleUSCFChange = useCallback(
    (event) => {
      const uscfValue = event.target.value;
      setFieldValue("uscf", uscfValue);
      if (uscfValue && uscfValue.length === VALID_USCF_LENGTH) {
        onUSCFSubmit(uscfValue);
      }
    },
    [setFieldValue, onUSCFSubmit]
  );
  const handleClearUSCF = useCallback(() => {
    setFieldValue("uscf", "");
    setUscfData(null);
  }, [setFieldValue, setUscfData]);

  return (
    <form noValidate onSubmit={handleSubmit}>
      {errors.submit && (
        <Alert mt={2} mb={1} severity="warning">
          {errors.submit}
        </Alert>
      )}
      <TextField
        type="text"
        name="name"
        label="Name"
        variant="outlined"
        color="secondary"
        value={values.name}
        error={Boolean(touched.name && errors.name)}
        fullWidth
        helperText={touched.name && errors.name}
        onBlur={handleBlur}
        onChange={handleChange}
        my={3}
      />
      <TextField
        type="text"
        name="username"
        label="UserName"
        variant="outlined"
        color="secondary"
        value={values.username}
        error={Boolean(touched.username && errors.username)}
        fullWidth
        helperText={touched.username && errors.username}
        onBlur={handleBlur}
        onChange={handleChange}
        my={3}
      />
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

      <TextField
        type="text"
        name="uscf"
        label="USCF ID"
        variant="outlined"
        color="secondary"
        disabled={uscfSubmitting}
        value={values.uscf}
        error={Boolean(touched.uscf && errors.uscf)}
        fullWidth
        helperText={touched.uscf && errors.uscf}
        onBlur={handleBlur}
        onChange={handleUSCFChange}
        my={3}
      />

      {!uscfData || uscfSubmitting ? (
        <EmptyWrapper>
          {uscfSubmitting ? (
            <Spinner />
          ) : (
            <Typography variant="body2">Fetched USCF profile</Typography>
          )}
        </EmptyWrapper>
      ) : (
        <Box
          display="flex"
          justifyContent="flex-start"
          alignItems="flex-start"
          flexDirection="column"
          borderRadius={4}
          bgcolor="#15375C"
          position="relative"
          mt={5}
          p={4}
        >
          {uscfData.metadata && uscfData.metadata.name ? (
            <Typography variant="h4" mb={2}>
              {uscfData.metadata.name}
            </Typography>
          ) : (
            <></>
          )}

          <Typography variant="body1" mb={3}>
            USCF ID: {uscfData.id}
          </Typography>
          {uscfData.ratings ? (
            <Box
              display="flex"
              borderTop="1px solid rgba(0,0,0, 0.3)"
              width="100%"
              pt={3}
            >
              {uscfData.ratings.blitz ? (
                <Box mr={10}>
                  <Typography variant="body1" color="textSecondary">
                    Blitz
                  </Typography>
                  <Typography variant="body1">
                    {uscfData.ratings.blitz.rating}
                  </Typography>
                </Box>
              ) : (
                <></>
              )}
              {uscfData.ratings.rapid ? (
                <Box mr={10}>
                  <Typography variant="body1" color="textSecondary">
                    Rapid
                  </Typography>
                  <Typography variant="body1">
                    {uscfData.ratings.rapid.rating}
                  </Typography>
                </Box>
              ) : (
                <></>
              )}
              {uscfData.ratings.classical ? (
                <Box mr={10}>
                  <Typography variant="body1" color="textSecondary">
                    Classic
                  </Typography>
                  <Typography variant="body1">
                    {uscfData.ratings.classical.rating}
                  </Typography>
                </Box>
              ) : (
                <></>
              )}
            </Box>
          ) : (
            <></>
          )}
          <Box position="absolute" right={-20} top={-20}>
            <IconButton onClick={handleClearUSCF}>
              <FontAwesomeIcon icon={FaTimesCircleIcon} />
            </IconButton>
          </Box>
        </Box>
      )}
      {isDirty ? (
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="secondary"
          disabled={isSubmitting}
          size="large"
          my={5}
        >
          Update account
        </Button>
      ) : (
        <></>
      )}
    </form>
  );
};
