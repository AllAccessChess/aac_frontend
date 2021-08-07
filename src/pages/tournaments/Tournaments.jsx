import React, { useState, useEffect, useMemo, useCallback } from "react";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useTheme } from "@material-ui/core";

import { TournamentStatus } from "constant";
import { TournamentCard } from "components/common";
import { Box, Button } from "components/material-ui";
import { FilterBar } from "./components";
import { CustomTab, CustomTabs } from "./styles";

import {
  getTournamentList,
  publishTournament,
  unPublishTournament,
} from "redux/reducers/tournamentReducer";
import { isAdmin } from "utils/common";

export const Tournaments = () => {
  const history = useHistory();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);

  const [typeFilter, setTypeFilter] = useState([]);
  const [timeControlFilter, setTimeControlFilter] = useState([]);
  const [variantFilter, setVariantFilter] = useState([]);
  const [ratingFilter, setRatingFilter] = useState([]);
  const [ratedFilter, setRatedFilter] = useState([]);
  const [dateFromFilter, setDateFromFilter] = useState();
  const [dateToFilter, setDateToFilter] = useState();

  const user = useSelector((state) => state.authReducer.user);
  const tournamentList = useSelector((state) => state.tournamentReducer.list);

  const editTournamentPermission = useMemo(
    () => user && user.id && isAdmin(user),
    [user]
  );

  const filteredTournaments = useMemo(
    () =>
      _.orderBy(
        tournamentList,
        ["start"],
        [tabValue === 0 ? "asc" : "desc"]
      ).filter((tournament) => {
        if (tournament.hidden) {
          return false;
        }

        const inTabFilter =
          (tabValue === 0 && tournament.state === TournamentStatus.SCHEDULED) ||
          (tabValue === 1 &&
            user &&
            user.id &&
            tournament.brackets.some(
              (bracket) =>
                bracket.players.findIndex((player) => player.id === user.id) !==
                -1
            )) ||
          (tabValue === 2 && tournament.state === TournamentStatus.ONGOING) ||
          (tabValue === 3 && tournament.state === TournamentStatus.FINISHED);

        const inTypeFilter =
          !typeFilter || !typeFilter.length
            ? true
            : typeFilter.includes(tournament.settings.type);

        const inTimeControlFilter =
          !timeControlFilter || !timeControlFilter.length
            ? true
            : timeControlFilter.includes(tournament.settings.ratingCategory);

        const inVariantFilter =
          !variantFilter || !variantFilter.length
            ? true
            : variantFilter.includes(tournament.settings.variant);

        const inRatingFilter =
          !ratingFilter || !ratingFilter.length
            ? true
            : ratingFilter.includes(tournament.settings.ratingProvider);

        const inRatedFilter =
          !ratedFilter || !ratedFilter.length
            ? true
            : ratedFilter.includes(
                tournament.settings.rated ? "rated" : "unrated"
              );

        const inDateFromFilter = !dateFromFilter
          ? true
          : tournament.start >= dateFromFilter;

        const inDateToFilter = !dateToFilter
          ? true
          : tournament.start <= dateToFilter;

        return (
          inTabFilter &&
          inTypeFilter &&
          inTimeControlFilter &&
          inVariantFilter &&
          inRatingFilter &&
          inDateFromFilter &&
          inDateToFilter &&
          inRatedFilter
        );
      }),
    [
      tournamentList,
      user,
      tabValue,
      typeFilter,
      timeControlFilter,
      variantFilter,
      ratingFilter,
      ratedFilter,
      dateFromFilter,
      dateToFilter,
    ]
  );

  const handleTabChange = useCallback((event, newValue) => {
    setTabValue(newValue);
  }, []);

  const handleViewTounamentDetail = useCallback(
    (tournament) => {
      history.push(`/tournament/${tournament.id}`);
    },
    [history]
  );
  const handleCreateTournament = useCallback(() => {
    history.push("/tournament-save");
  }, [history]);
  const handleEditTournament = useCallback(
    (id) => {
      history.push(`/tournament-save/${id}`);
    },
    [history]
  );
  const handleTogglePublish = useCallback(
    (id, publish) => {
      if (publish) dispatch(publishTournament(id));
      else dispatch(unPublishTournament(id));
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(getTournamentList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      borderRadius={10}
      bgcolor="transparent"
      position="relative"
    >
      <CustomTabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="tournaments"
        indicatorColor="secondary"
      >
        <CustomTab
          label="Upcoming"
          value={0}
          bgcolor={theme.palette.background.paper}
        />
        {user && user.id && (
          <CustomTab
            label="Registered"
            value={1}
            bgcolor={theme.palette.background.paper}
          />
        )}
        <CustomTab
          label="Ongoing"
          value={2}
          bgcolor={theme.palette.background.paper}
        />
        <CustomTab
          label="Completed"
          value={3}
          bgcolor={theme.palette.background.paper}
        />
      </CustomTabs>

      <Box p={5} bgcolor={theme.palette.background.paper} borderRadius="10px">
        <FilterBar
          typeFilter={typeFilter}
          timeControlFilter={timeControlFilter}
          variantFilter={variantFilter}
          ratingFilter={ratingFilter}
          ratedFilter={ratedFilter}
          dateFromFilter={dateFromFilter}
          dateToFilter={dateToFilter}
          setTypeFilter={setTypeFilter}
          setTimeControlFilter={setTimeControlFilter}
          setVariantFilter={setVariantFilter}
          setRatingFilter={setRatingFilter}
          setDateFromFilter={setDateFromFilter}
          setDateToFilter={setDateToFilter}
          setRatedFilter={setRatedFilter}
        />
        {filteredTournaments.map((tournament) => (
          <Box
            width="100%"
            bgcolor="#15375C"
            p={5}
            mb={5}
            borderRadius={10}
            key={tournament.id}
          >
            <TournamentCard
              tournament={tournament}
              onViewDetails={handleViewTounamentDetail}
              onEdit={editTournamentPermission ? handleEditTournament : null}
              onTogglePublish={
                editTournamentPermission ? handleTogglePublish : null
              }
            />
          </Box>
        ))}
      </Box>

      {isAdmin(user) ? (
        <Box position="absolute" right={0} top={10}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCreateTournament}
          >
            Create Tournament
          </Button>
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
};
