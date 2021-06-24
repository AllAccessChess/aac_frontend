import React, { useState } from "react";
import clsx from "clsx";
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@material-ui/icons";

import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "components/material-ui";
import { FullForm, useStyles } from "./styles";

export const InnerForm = (props) => {
  const {
    errors,
    isSubmitting,
    touched,
    values,
    handleBlur,
    handleChange,
    handleSubmit,
  } = props;

  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <FullForm noValidate onSubmit={handleSubmit}>
      {errors.submit && (
        <Alert mt={2} mb={1} severity="warning">
          {errors.submit}
        </Alert>
      )}
      <TextField
        autoComplete="off"
        type="email"
        name="id"
        label="Email"
        variant="outlined"
        color="secondary"
        value={values.id}
        error={Boolean(touched.id && errors.id)}
        fullWidth
        helperText={touched.id && errors.id}
        onBlur={handleBlur}
        onChange={handleChange}
        my={2}
      />
      <FormControl
        className={clsx(classes.margin, classes.textField)}
        variant="outlined"
        color="secondary"
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
                color="default"
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
      {/* <Link component={RouterLink} to="/auth/reset-password" color="secondary">
        Forgot password?
      </Link> */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="secondary"
        size="large"
        disabled={isSubmitting}
        my={5}
      >
        Log in
      </Button>
    </FullForm>
  );
};
