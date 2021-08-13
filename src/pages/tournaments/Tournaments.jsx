import React, { useEffect, useMemo, useCallback } from "react";
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
  setFilters,
  unPublishTournament,
} from "redux/reducers/tournamentReducer";
import { isAdmin } from "utils/common";

export const Tournaments = () => {
  const history = useHistory();
  const theme = useTheme();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.authReducer.user);
  const tournamentList = useSelector((state) => state.tournamentReducer.list);
  const filters = useSelector((state) => state.tournamentReducer.filters);

  const editTournamentPermission = useMemo(
    () => user && user.id && isAdmin(user),
    [user]
  );

  const filteredTournaments = useMemo(
    () =>
      _.orderBy(
        tournamentList,
        ["start"],
        [filters.tab === 0 ? "asc" : "desc"]
      ).filter((tournament) => {
        if (tournament.hidden) {
          return false;
        }

        const inTabFilter =
          (filters.tab === 0 &&
            tournament.state === TournamentStatus.SCHEDULED) ||
          (filters.tab === 1 &&
            user &&
            user.id &&
            tournament.brackets.some(
              (bracket) =>
                bracket.players.findIndex((player) => player.id === user.id) !==
                -1
            )) ||
          (filters.tab === 2 &&
            tournament.state === TournamentStatus.ONGOING) ||
          (filters.tab === 3 && tournament.state === TournamentStatus.FINISHED);

        const inTypeFilter =
          !filters.type || !filters.type.length
            ? true
            : filters.type.includes(tournament.settings.type);

        const inTimeControlFilter =
          !filters.timeControl || !filters.timeControl.length
            ? true
            : filters.timeControl.includes(tournament.settings.ratingCategory);

        const inVariantFilter =
          !filters.variant || !filters.variant.length
            ? true
            : filters.variant.includes(tournament.settings.variant);

        const inRatingFilter =
          !filters.rating || !filters.rating.length
            ? true
            : filters.rating.includes(tournament.settings.ratingProvider);

        const inRatedFilter =
          !filters.rated || !filters.rated.length
            ? true
            : filters.rated.includes(
                tournament.settings.rated ? "rated" : "unrated"
              );

        const inDateFromFilter = !filters.dateFrom
          ? true
          : tournament.start >= filters.dateFrom;

        // const inDateToFilter = !dateToFilter
        //   ? true
        //   : tournament.start <= dateToFilter;

        return (
          inTabFilter &&
          inTypeFilter &&
          inTimeControlFilter &&
          inVariantFilter &&
          inRatingFilter &&
          inDateFromFilter &&
          // inDateToFilter &&
          inRatedFilter
        );
      }),
    [tournamentList, user, filters]
  );

  const handleTabChange = useCallback(
    (event, newValue) => {
      dispatch(setFilters({ tab: newValue }));
    },
    [dispatch]
  );

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

  const handleSetTypeFilter = useCallback(
    (type) => {
      dispatch(setFilters({ type }));
    },
    [dispatch]
  );

  const handleSetTimeControlFilter = useCallback(
    (timeControl) => {
      dispatch(setFilters({ timeControl }));
    },
    [dispatch]
  );

  const handleSetVariantFilter = useCallback(
    (variant) => {
      dispatch(setFilters({ variant }));
    },
    [dispatch]
  );

  const handleSetRatingFilter = useCallback(
    (rating) => {
      dispatch(setFilters({ rating }));
    },
    [dispatch]
  );

  const handleSetDateFromFilter = useCallback(
    (dateFrom) => {
      dispatch(setFilters({ dateFrom }));
    },
    [dispatch]
  );

  const handleSetRatedFilter = useCallback(
    (rated) => {
      dispatch(setFilters({ rated }));
    },
    [dispatch]
  );

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
        value={filters.tab}
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
          typeFilter={filters.type}
          timeControlFilter={filters.timeControl}
          variantFilter={filters.variant}
          ratingFilter={filters.rating}
          ratedFilter={filters.rated}
          dateFromFilter={filters.dateFrom}
          // dateToFilter={dateToFilter}
          setTypeFilter={handleSetTypeFilter}
          setTimeControlFilter={handleSetTimeControlFilter}
          setVariantFilter={handleSetVariantFilter}
          setRatingFilter={handleSetRatingFilter}
          setDateFromFilter={handleSetDateFromFilter}
          // setDateToFilter={setDateToFilter}
          setRatedFilter={handleSetRatedFilter}
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
