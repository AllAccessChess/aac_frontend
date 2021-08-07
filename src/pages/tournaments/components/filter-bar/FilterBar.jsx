import React, { useMemo } from "react";
import moment from "moment";

import { Box } from "components/material-ui";
import {
  CustomIcon,
  ClearButton,
  CustomChip,
  CustomDatePicker,
} from "./styles";
import { MultiSelect, ChipArray } from "./components";

import { faFilter } from "@fortawesome/free-solid-svg-icons";

import {
  TimeControlOptions,
  TournamentTypeOptions,
  VariantOptions,
  RatingProviders,
} from "constant";

export const FilterBar = (props) => {
  const {
    typeFilter,
    setTypeFilter,
    timeControlFilter,
    setTimeControlFilter,
    variantFilter,
    setVariantFilter,
    ratingFilter,
    setRatingFilter,
    dateFromFilter,
    setDateFromFilter,
    dateToFilter,
    setDateToFilter,
    ratedFilter,
    setRatedFilter,
  } = props;
  const ExtraRatingOptions = useMemo(
    () => [
      {
        label: "USCF",
        value: RatingProviders.USCF,
      },
      {
        label: "FIDE",
        value: RatingProviders.FIDE,
      },
    ],
    []
  );
  const RatedOptions = useMemo(
    () => [
      {
        label: "Rated",
        value: "rated",
      },
      {
        label: "Unrated",
        value: "unrated",
      },
    ],
    []
  );

  const showChips = useMemo(
    () =>
      typeFilter.length ||
      timeControlFilter.length ||
      variantFilter.length ||
      ratingFilter.length ||
      dateFromFilter ||
      dateToFilter,
    [
      typeFilter,
      timeControlFilter,
      variantFilter,
      ratingFilter,
      dateFromFilter,
      dateToFilter,
    ]
  );

  const handleClearAll = () => {
    setTypeFilter([]);
    setTimeControlFilter([]);
    setVariantFilter([]);
    setRatingFilter([]);
    setDateFromFilter(null);
    setDateToFilter(null);
  };

  return (
    <Box>
      <Box width="100%" bgcolor="#15375C" px={5} py={3} mb={2} display="flex">
        <CustomIcon icon={faFilter} />
        <MultiSelect
          options={TournamentTypeOptions}
          value={typeFilter}
          variant="outlined"
          displayEmpty
          onChange={(event) => setTypeFilter(event.target.value)}
          placeholder="Tournament type"
          mr={2}
        />
        <MultiSelect
          options={TimeControlOptions}
          value={timeControlFilter}
          variant="outlined"
          displayEmpty
          onChange={(event) => setTimeControlFilter(event.target.value)}
          placeholder="Time control"
          mr={2}
        />
        <CustomDatePicker
          variant="inline"
          color="secondary"
          placeholder="Date from"
          format="MM/dd/yyyy"
          value={null}
          onChange={(date) =>
            setDateFromFilter(new Date(date.toDateString()).getTime())
          }
        />
        <CustomDatePicker
          variant="inline"
          color="secondary"
          placeholder="Date to"
          format="MM/dd/yyyy"
          value={null}
          onChange={(date) =>
            setDateToFilter(new Date(date.toDateString()).getTime())
          }
        />
        <MultiSelect
          options={VariantOptions}
          value={variantFilter}
          variant="outlined"
          displayEmpty
          onChange={(event) => setVariantFilter(event.target.value)}
          placeholder="Variant"
          mr={2}
        />
        <MultiSelect
          options={ExtraRatingOptions}
          value={ratingFilter}
          variant="outlined"
          displayEmpty
          onChange={(event) => setRatingFilter(event.target.value)}
          placeholder="Rated by"
          mr={2}
        />
        <MultiSelect
          options={RatedOptions}
          value={ratedFilter}
          variant="outlined"
          displayEmpty
          onChange={(event) => setRatedFilter(event.target.value)}
          placeholder="Is rated"
          mr={2}
        />
      </Box>
      {showChips ? (
        <Box width="100%" py={3} mb={2} display="flex">
          <ChipArray
            options={TournamentTypeOptions}
            filter={typeFilter}
            setFilter={setTypeFilter}
          />
          <ChipArray
            options={TimeControlOptions}
            filter={timeControlFilter}
            setFilter={setTimeControlFilter}
          />
          <ChipArray
            options={VariantOptions}
            filter={variantFilter}
            setFilter={setVariantFilter}
          />
          <ChipArray
            options={ExtraRatingOptions}
            filter={ratingFilter}
            setFilter={setRatingFilter}
          />
          <ChipArray
            options={RatedOptions}
            filter={ratedFilter}
            setFilter={setRatedFilter}
          />
          {dateFromFilter ? (
            <CustomChip
              label={moment(dateFromFilter).format("> MM/DD/yyy")}
              color="primary"
              mr={2}
              onDelete={() => setDateFromFilter(null)}
            />
          ) : (
            <></>
          )}
          {dateToFilter ? (
            <CustomChip
              label={moment(dateToFilter).format("< MM/DD/yyy")}
              color="primary"
              mr={2}
              onDelete={() => setDateToFilter(null)}
            />
          ) : (
            <></>
          )}

          <ClearButton
            variant="contained"
            color="secondary"
            onClick={handleClearAll}
          >
            Clear all
          </ClearButton>
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
};
