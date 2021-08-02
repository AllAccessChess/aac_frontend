import React, { useMemo } from "react";
import moment from "moment";

import { Box } from "components/material-ui";
import { CustomIcon, ClearButton, CustomChip } from "./styles";
import { MultiSelect, ChipArray } from "./components";
import { OutlinedKeyboardDatePicker } from "components/common";

import { faFilter } from "@fortawesome/free-solid-svg-icons";

import {
  TimeControlOptions,
  TournamentTypeOptions,
  VariantOptions,
  RatingOptions,
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
    dateFilter,
    setDateFilter,
  } = props;

  const showChips = useMemo(
    () =>
      typeFilter.length ||
      timeControlFilter.length ||
      variantFilter.length ||
      ratingFilter.length ||
      dateFilter,
    [typeFilter, timeControlFilter, variantFilter, ratingFilter, dateFilter]
  );

  const handleClearAll = () => {
    setTypeFilter([]);
    setTimeControlFilter([]);
    setVariantFilter([]);
    setRatingFilter([]);
    setDateFilter(null);
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
          placeholder="Time Control"
          mr={2}
        />
        <OutlinedKeyboardDatePicker
          disableToolbar
          variant="inline"
          color="secondary"
          placeholder="Start Date"
          format="MM/dd/yyyy"
          value={dateFilter ? new Date(dateFilter) : null}
          render={"Start Date"}
          onChange={(date) => setDateFilter(new Date(date).getTime())}
        />
        <MultiSelect
          options={VariantOptions}
          value={variantFilter}
          variant="outlined"
          displayEmpty
          onChange={(event) => setVariantFilter(event.target.value)}
          placeholder="Variant"
          mx={2}
        />
        <MultiSelect
          options={RatingOptions}
          value={ratingFilter}
          variant="outlined"
          displayEmpty
          onChange={(event) => setRatingFilter(event.target.value)}
          placeholder="Rated by"
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
            options={RatingOptions}
            filter={ratingFilter}
            setFilter={setRatingFilter}
          />
          {dateFilter ? (
            <CustomChip
              label={moment(dateFilter).format("> MM/DD/yyy")}
              color="primary"
              mr={2}
              onDelete={() => setDateFilter(null)}
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
