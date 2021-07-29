import React, { useMemo, useState } from "react";
import _ from "lodash";

import {
  Box,
  Button,
  Typography,
  Grid,
  TextField,
  FormControl,
  FormHelperText,
} from "components/material-ui";
import { SmallTextField, FormSelect } from "components/common";
import { CustomAutocomplete, FitedForm } from "./styles";
import { TournamentVariants } from "constant";
import { getRatingCategory } from "utils/common";

export const InnerForm = (props) => {
  const {
    errors,
    users,
    handleBlur,
    handleChange,
    setFieldValue,
    touched,
    dirty,
    values,
    handleSubmit,
  } = props;

  const [search, setSearch] = useState();

  console.log(values, errors);

  const VariantList = useMemo(
    () => [
      {
        label: "Standard",
        value: TournamentVariants.STANDARD,
      },
      {
        label: "Chess960",
        value: TournamentVariants.CHESS960,
      },
    ],
    []
  );

  const whitePlayer = useMemo(
    () =>
      users.length ? users.find((item) => item.id === values.white) : null,
    [values.white, users]
  );
  const blackPlayer = useMemo(
    () =>
      users.length ? users.find((item) => item.id === values.black) : null,
    [values.black, users]
  );
  const sortedUsersByName = useMemo(
    () => _.orderBy(users, ["name", "username"], ["asc", "asc"]),
    [users]
  );

  return (
    <FitedForm noValidate onSubmit={handleSubmit}>
      <Box py={2} px={4} width="100%">
        <Box mt={5} mb={10} width="100%" display="flex" alignItems="flex-start">
          <Box width="50%">
            <FormControl
              error={Boolean(dirty && errors.white)}
              fullWidth
              onBlur={handleBlur}
            >
              <CustomAutocomplete
                options={sortedUsersByName}
                getOptionLabel={(option) =>
                  option.name.length
                    ? option.name.toString() +
                      " (" +
                      option.username.toString() +
                      ")"
                    : option.username.toString()
                }
                onBlur={handleBlur}
                onChange={(event, newValue) => {
                  setSearch(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search People by Name"
                    variant="outlined"
                  />
                )}
              />
            </FormControl>
          </Box>
          {search ? (
            <Box
              display="flex"
              justifyContent="space-between"
              flexGrow={1}
              ml={5}
              mt="-5px"
            >
              <Box>
                <Typography>{search.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  ID {search.id}
                </Typography>
              </Box>
            </Box>
          ) : (
            <></>
          )}
        </Box>

        <Box my={5} width="100%" display="flex" alignItems="flex-start">
          <Box width="50%">
            <FormControl
              error={Boolean(dirty && errors.white)}
              fullWidth
              onBlur={handleBlur}
            >
              <CustomAutocomplete
                options={users}
                getOptionLabel={(option) => option.id.toString()}
                onBlur={handleBlur}
                onChange={(event, newValue) => {
                  setFieldValue("white", newValue ? newValue.id : "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="White Player ID"
                    variant="outlined"
                  />
                )}
              />

              {dirty && errors.white ? (
                <FormHelperText>{dirty && errors.white}</FormHelperText>
              ) : (
                <></>
              )}
            </FormControl>
          </Box>
          {whitePlayer ? (
            <Box
              display="flex"
              justifyContent="space-between"
              flexGrow={1}
              ml={5}
              mt="-5px"
            >
              <Box>
                <Typography>{whitePlayer.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  ID {whitePlayer.id}
                </Typography>
              </Box>
            </Box>
          ) : (
            <></>
          )}
        </Box>
        <Box my={5} width="100%" display="flex" alignItems="flex-start">
          <Box width="50%">
            <FormControl
              error={Boolean(dirty && errors.black)}
              fullWidth
              onBlur={handleBlur}
            >
              <CustomAutocomplete
                options={users}
                getOptionLabel={(option) => option.id.toString()}
                onBlur={handleBlur}
                onChange={(event, newValue) => {
                  setFieldValue("black", newValue ? newValue.id : "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Black Player ID"
                    variant="outlined"
                  />
                )}
              />

              {dirty && errors.black ? (
                <FormHelperText>{dirty && errors.black}</FormHelperText>
              ) : (
                <></>
              )}
            </FormControl>
          </Box>
          {blackPlayer ? (
            <Box
              display="flex"
              justifyContent="space-between"
              flexGrow={1}
              ml={5}
              mt="-5px"
            >
              <Box>
                <Typography>{blackPlayer.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  ID {blackPlayer.id}
                </Typography>
              </Box>
            </Box>
          ) : (
            <></>
          )}
        </Box>
        <Box my={3} width="50%">
          <Box display="flex" alignItems="center">
            <Typography variant="body1" color="textSecondary">
              Chess Variant
            </Typography>
          </Box>
          <FormSelect
            variant="outlined"
            name="settings.variant"
            value={values.settings.variant}
            placeholder="Select a chess variant"
            displayEmpty
            options={VariantList}
            error={
              touched.settings &&
              errors.settings &&
              touched.settings.variant &&
              errors.settings.variant
            }
            fullWidth
            onChange={handleChange}
          />
        </Box>
        <Box my={3} width="50%">
          <Grid container spacing={5} my={1}>
            <Grid item sm={4}>
              <Typography color="textSecondary">Game time (min)</Typography>
            </Grid>
            <Grid item sm={4}>
              <Typography color="textSecondary">Increment (sec)</Typography>
            </Grid>
            <Grid item sm={4}>
              <Typography color="textSecondary">Time Control</Typography>
            </Grid>
          </Grid>

          <Grid container spacing={5}>
            <Grid item sm={4}>
              <SmallTextField
                type="number"
                name="settings.startTime"
                variant="outlined"
                color="secondary"
                value={values.settings.startTime}
                error={Boolean(
                  touched.settings &&
                    touched.settings.startTime &&
                    errors.settings &&
                    errors.settings.startTime
                )}
                fullWidth
                helperText={
                  touched.settings &&
                  touched.settings.startTime &&
                  errors.settings &&
                  errors.settings.startTime
                }
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </Grid>
            <Grid item sm={4}>
              <SmallTextField
                type="number"
                name="settings.increment"
                variant="outlined"
                color="secondary"
                value={values.settings.increment}
                error={Boolean(
                  touched.settings &&
                    touched.settings.increment &&
                    errors.settings &&
                    errors.settings.increment
                )}
                fullWidth
                helperText={
                  touched.settings &&
                  touched.settings.increment &&
                  errors.settings &&
                  errors.settings.increment
                }
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </Grid>

            <Grid item sm={4}>
              <Box display="flex" alignItems="center" height="100%">
                <Typography>
                  {getRatingCategory(
                    values.settings.startTime,
                    values.settings.increment
                  )}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box width="150px">
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Create Game
          </Button>
        </Box>
      </Box>
    </FitedForm>
  );
};
