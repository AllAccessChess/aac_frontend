import React, { useMemo } from "react";

import { Box } from "components/material-ui";
import { CustomIcon, ClearButton } from "./styles";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { MultiSelect, ChipArray } from "./components";

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
  } = props;

  const showChips = useMemo(
    () =>
      typeFilter.length ||
      timeControlFilter.length ||
      variantFilter.length ||
      ratingFilter.length,
    [typeFilter, timeControlFilter, variantFilter, ratingFilter]
  );

  const handleClearAll = () => {
    setTypeFilter([]);
    setTimeControlFilter([]);
    setVariantFilter([]);
    setRatingFilter([]);
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
