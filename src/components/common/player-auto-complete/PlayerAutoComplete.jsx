import React, { useEffect, useState, useRef, useCallback } from "react";

import { TextField } from "components/material-ui";
import UserService from "services/userService";

import { CustomAutocomplete } from "./styles";

export const PlayerAutoComplete = (props) => {
  const [users, setUsers] = useState(props.users || []);
  const [term, setTerm] = useState("");
  const mountedRef = useRef();
  const termRef = useRef();

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setUsers(props.users || []);
  }, [props.users]);

  useEffect(() => {
    termRef.current = term;
  }, [term]);

  useEffect(() => {
    let currentTerm = term;

    setTimeout(() => {
      if (currentTerm !== termRef.current) {
        return;
      }

      UserService.searchUsers(term)
        .then((response) => {
          if (mountedRef.current && response.users && response.users.length) {
            setUsers(response.users);
          }
        })
        .catch((error) => {
          if (props.onError) {
            props.onError(error);
          }
          // setUsers([]);
        });
    }, 1000);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  const handleInputChange = (_event, value) => {
    setTerm(value);
  };

  const getOptionLabel = useCallback(
    (option) => {
      if (!option.id.length) return "";
      if (option.name) {
        return option.name.length
          ? option.name.toString() + " (" + option.username.toString() + ")"
          : option.username.toString();
      }
      let user = users.find((item) => item.id === option.id);
      if (user) {
        return user.name.length
          ? user.name.toString() + " (" + user.username.toString() + ")"
          : user.username.toString();
      }
      return option.id;
    },
    [users]
  );

  return (
    <CustomAutocomplete
      options={users}
      getOptionLabel={(option) => getOptionLabel(option)}
      getOptionSelected={(option, value) => option.id === value.id}
      onInputChange={handleInputChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label || "Search People by Name"}
          variant="outlined"
        />
      )}
      {...props}
    />
  );
};
