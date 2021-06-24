import React, { useCallback, useState } from "react";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle as FaTimesCircleIcon } from "@fortawesome/free-solid-svg-icons";
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@material-ui/icons";

import { VALID_USCF_LENGTH } from "constant";
import { Spinner } from "components/common";
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "components/material-ui";

import { useStyles, EmptyWrapper } from "./styles";

export const InnerForm = (props) => {
  const {
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
    touched,
    values,
    setFieldValue,
    uscfData,
    setUscfData,
    uscfSubmitting,
    onUSCFSubmit,
  } = props;
  const classes = useStyles();

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = useCallback(() => {
    setShowPassword((origin) => !origin);
  }, [setShowPassword]);
  const handleMouseDownPassword = useCallback(
    (event) => event.preventDefault(),
    []
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
      <FormControl
        className={clsx(classes.margin, classes.textField)}
        variant="outlined"
        color="secondary"
        fullWidth
        error={Boolean(touched.password && errors.password)}
      >
        <InputLabel htmlFor="password">Password</InputLabel>
        <OutlinedInput
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={values.password}
          onBlur={handleBlur}
          onChange={handleChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </InputAdornment>
          }
          labelWidth={70}
        />
        <FormHelperText id="password-helper-text">
          {errors.password}
        </FormHelperText>
      </FormControl>

      <FormControl
        className={clsx(classes.margin, classes.textField)}
        variant="outlined"
        color="secondary"
        fullWidth
        error={Boolean(
          touched.password_confirmation && errors.password_confirmation
        )}
      >
        <InputLabel htmlFor="password_confirmation">
          Confirm password
        </InputLabel>
        <OutlinedInput
          id="password_confirmation"
          name="password_confirmation"
          type={showPassword ? "text" : "password"}
          value={values.password_confirmation}
          onBlur={handleBlur}
          onChange={handleChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </InputAdornment>
          }
          labelWidth={120}
        />
        <FormHelperText id="confirm-password-helper-text">
          {errors.password_confirmation}
        </FormHelperText>
      </FormControl>

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
          <Typography variant="h4" mb={2}>
            {uscfData.metadata.name}
          </Typography>
          <Typography variant="h5">{uscfData.id}</Typography>
          <Box position="absolute" right={-20} top={-20}>
            <IconButton onClick={handleClearUSCF}>
              <FontAwesomeIcon icon={FaTimesCircleIcon} />
            </IconButton>
          </Box>
        </Box>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="secondary"
        disabled={isSubmitting}
        size="large"
        my={5}
      >
        Create account
      </Button>
    </form>
  );
};
