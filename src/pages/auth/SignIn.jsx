import React from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import clsx from "clsx";

import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

import {
  Box,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
} from "@material-ui/core";
import {
  Alert,
  TextField,
  Button,
  Link,
  Typography,
} from "components/common/SpacedMui";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

import { signIn } from "redux/reducers/authReducer";
import LichessButton from "components/common/LichessButton";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  margin: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: "100%",
  },
}));

const InnerForm = (props) => {
  const {
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
    touched,
    values,
  } = props;

  const classes = useStyles();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      {errors.submit && (
        <Alert mt={2} mb={1} severity="warning">
          {errors.submit}
        </Alert>
      )}
      <TextField
        autoComplete="off"
        type="email"
        name="id"
        label="Name or Email"
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
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          labelWidth={70}
        />
        <FormHelperText id="password-helper-text">
          {errors.password}
        </FormHelperText>
      </FormControl>
      <Link component={RouterLink} to="/auth/reset-password" color="secondary">
        Forgot password?
      </Link>
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
    </form>
  );
};

const SignIn = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.authReducer.user);

  React.useEffect(() => {
    if (user) {
      history.push("/");
    }
  }, [user, history]);

  const handleSubmit = async (
    values,
    { setErrors, setStatus, setSubmitting }
  ) => {
    try {
      dispatch(signIn({ id: values.id, password: values.password }));
    } catch (error) {
      const message = "Invalid Data";

      setStatus({ success: false });
      setErrors({ submit: message });
      setSubmitting(false);
    }
  };

  return (
    <Box width="100%" padding={1}>
      <Helmet title="Sign In" />

      <Formik
        initialValues={{
          id: "",
          password: "",
          submit: false,
        }}
        validationSchema={Yup.object().shape({
          id: Yup.string().max(255).required("Name or Email is required"),
          password: Yup.string().max(255).required("Password is required"),
        })}
        onSubmit={handleSubmit}
      >
        {(formProps) => <InnerForm {...formProps} />}
      </Formik>

      <Typography variant="h4" align="center" color="textSecondary">
        or
      </Typography>

      <LichessButton color="default" size="large" fullWidth my={5}>
        Login with Lichess
      </LichessButton>

      <Typography variant="h4" align="center">
        Not a member?
        <Link
          component={RouterLink}
          to="/auth/sign-up"
          color="secondary"
          ml={2}
        >
          Signup
        </Link>
      </Typography>
    </Box>
  );
};

export default SignIn;
