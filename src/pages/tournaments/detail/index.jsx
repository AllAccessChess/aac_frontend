import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";

import { Button } from "components/common/SpacedMui";
import { Box } from "@material-ui/core";
import { ChevronLeft as BackIcon } from "@material-ui/icons";

import ScreenLoader from "components/common/ScreenLoader";
import TournamentCard from "../TournamentCard";
import Pairings from "./Pairings";
import Members from "./Members";

import {
  getTournament,
  clearCurrent as clearCurrentTournament,
} from "redux/reducers/tournamentReducer";

const Detail = () => {
  const history = useHistory();
  const params = useParams();
  const dispatch = useDispatch();

  const currentTournament = useSelector(
    (state) => state.tournamentReducer.current
  );
  const user = useSelector((state) => state.authReducer.user);

  const handleBack = () => {
    dispatch(clearCurrentTournament());
    history.push("/tournaments");
  };

  const handleRigster = () => {
    console.log("Registering Now");
  };

  useEffect(() => {
    if (params.id && !currentTournament) dispatch(getTournament(params.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currentTournament) return <ScreenLoader />;
  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
    >
      <Button startIcon={<BackIcon />} onClick={handleBack}>
        Go Back
      </Button>

      <Box width="100%" my={5}>
        <TournamentCard
          tournament={currentTournament}
          onRegister={handleRigster}
        />
      </Box>
      <Pairings rounds={currentTournament.rounds} user={user} />
      <Members members={currentTournament.members} />
    </Box>
  );
};

export default Detail;
