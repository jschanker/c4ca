"use client";
import React, { useEffect, useState } from "react";
import {
  TextField,
  Box,
  Button,
  Typography,
  InputAdornment,
  useMediaQuery,
  styled,
} from "@mui/material";
import { SearchOutlined, Add } from "@mui/icons-material";
import FacilitatorAddModal from "./FacilitatorAddModal";
import FacilatorTable from "./FacilatorTable";

function FacilitatorFilter({ data,id }) {
  console.log("filter", id);

  const [openModal, setOpenModal] = useState(false);

  const [allFacilitator, setAllFacilitator] = useState();
  const [filteredFacilitator, setFilteredFacilitator] = useState();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (data) {
      setAllFacilitator(data);
      setFilteredFacilitator(data);
    }
  }, [data]);

  // const [searchResults, setSearchResults] = useState([]);

  const filterTerms = [
    "All Partners",
    "Newly Onboarded",
    "Active",
    "Inactive",
    "Archived",
  ];

  const handleModalToggle = () => {
    setOpenModal(!openModal);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const datar = filterFacilitator(searchTerm, allFacilitator);
    console.log(datar);
    setFilteredFacilitator(datar);
  };

  function filterFacilitator(searchText, allFacilitator) {
    console.log(allFacilitator);
    const filterData = allFacilitator.filter(
      (facilitator) =>
        facilitator?.name?.toLowerCase()?.includes(searchText?.toLowerCase()) ||
        facilitator?.point_of_contact_name
          ?.toLowerCase()
          ?.includes(searchText?.toLowerCase())
    );
    return filterData;
  }

  // function handleFilterClick(data, selectedTerm) {
  //   let filterData = [];
  //   console.log(`Selected filter term: ${selectedTerm}`);
  //   if (selectedTerm === "All Partners") {
  //     return data;
  //   } else {
  //     filterData = data.filter((item) => item.status === selectedTerm);
  //     console.log(filterData, "filterData");
  //     return filterData;
  //   }
  // }

  // const filterButtons = filterTerms.map((term) => (
  //   <Button
  //     key={term}
  //     sx={{
  //       mr: 2,
  //       borderRadius: "18px",
  //       borderColor: "#DCDCDC",
  //       p: "12px",
  //       border: "1px solid lightBlue",
  //     }}
  //     onClick={() => handleFilterClick(data,term)}
  //   >
  //     <Typography variant="body2">{term}</Typography>
  //   </Button>
  // ));

  // const handleSearch = (event) => {
  //   const query = event.target.value.toLowerCase();
  //   setSearchTerm(query);

  //   const filteredResults = data.filter((filteredData) => {
  //     return (
  //       filteredData.firstName.toLowerCase().includes(query) ||
  //       filteredData.email.toLowerCase().includes(query)
  //     );
  //   });
  //   setSearchResults(filteredResults);
  // };

  return (
    <Box sx={{ mt: 8, mb: 2 }}>
      <Box display="flex" justifyContent={"space-between"} mb={3}>
        <TextField
          placeholder="Search Stakeholders..."
          size="medium"
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined sx={{ color: "#2E2E2E" }} />
              </InputAdornment>
            ),
            style: {
              height: "48px",
              borderRadius: "8px",
              fontSize: "14px",
            },
          }}
          sx={{ width: "360px" }}
        />
        <Box sx={{ position: "relative" }}>
          <Button
            startIcon={<Add />}
            onClick={handleModalToggle}
            variant="contained"
            sx={{}}
          >
            <Typography variant="subtitle2">Add Facilitator</Typography>
          </Button>
          {openModal && (
            <Box sx={{ position: "absolute", top: "100%", left: 0 }}>
              <FacilitatorAddModal
              id={id}
                onOpen={handleModalToggle}
                boolean={openModal}
              />
            </Box>
          )}
        </Box>
      </Box>
      {searchTerm === "" ? (
        <FacilatorTable data={allFacilitator}   />
      ) : (
        <FacilatorTable data={filteredFacilitator} />
      )}
    </Box>
  );
}

export default FacilitatorFilter;
