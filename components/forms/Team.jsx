import {
  Container,
  Button,
  Typography,
  Box,
  useMediaQuery,
  Grid,
  InputLabel,
} from "@mui/material";
import InputControl from "./InputControl";
import SelectControl from "./SelectControl";
import { breakpoints } from "@/theme/constant";
import { useState, useEffect } from "react";
import stateDistrict from "../../data/state.json";
import { useRouter } from "next/router";
import customAxios from "../../api";
import Link from "next/link";

const Team = ({ handleCloseDialog, setActiveStep = null }) => {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:" + breakpoints.values.sm + "px)");
  const [teamSize, setTeamSize] = useState(3);
  const [teamName, setTeamName] = useState("");
  const [values, setValues] = useState({
    state: "",
  });
  const [teamMembers, setTeamMembers] = useState([]);
  const [errors, setErrors] = useState({});

  const sizeList = [3, 4, 5];

  useEffect(() => {
    const teacherData = JSON.parse(localStorage.getItem("teacherData"));

    setValues({
      school: teacherData?.school,
      state: teacherData?.state,
      district: teacherData?.district,
    });
  }, []);

  useEffect(() => {
    const membersCount = teamMembers.length;
    if (membersCount < teamSize) {
      const emptyMembersToAdd = teamSize - membersCount;
      const newMembers = Array.from({ length: emptyMembersToAdd }, () => ({
        name: "",
        class: "",
      }));
      setTeamMembers((prevMembers) => [...prevMembers, ...newMembers]);
    } else if (membersCount > teamSize) {
      setTeamMembers(teamMembers.slice(0, teamSize));
    }
  }, [teamSize]);

  const createTeam = async () => {
    clearErrors();
    if (validateInputs()){
      try {
        const authToken = JSON.parse(localStorage.getItem("AUTH"));

        const filteredTeamMembers = teamMembers.filter(
          (member) => member.name.trim() !== "" && member.class !== ""
        );

      const response = await customAxios.post(
        "/c4ca/team",
        {
          team_name: teamName,
          team_size: teamSize,
          team_members: filteredTeamMembers,
          school: values.school,
          district: values.district,
          state: values.state,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken.token}`,
            "Content-Type": "application/json",
          },
          {
            headers: {
              Authorization: `Bearer ${authToken.token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.status === "success") {
          router.push("/teacher/teams");
          handleCloseDialog();
        }
      } catch (error) {
        console.error("Error creating a team:", error);
      }
    }
  };
  const validateInputs = () => {
    const newErrors = {};
    if (!teamName) {
      newErrors.teamName = "Team Name is required";
    }
    if (!schoolName) {
      newErrors.schoolName = "School Name is required";
    }
    if (!values.state) {
      newErrors.state = "Please select a State";
    }
    if (!values.district) {
      newErrors.district = "Please select a District";
    }

    const memberErrors = teamMembers.map((member, index) => {
      const memberErrorsForIndex = {};
      if (!member.name) {
        memberErrorsForIndex.name = `Student Name is required`;
      }
      if (!member.class) {
        memberErrorsForIndex.class = `Class for Student is required`;
      }
      return memberErrorsForIndex;
    });

    if (memberErrors.some((errors) => Object.keys(errors).length > 0)) {
      newErrors.teamMembers = memberErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearErrors = () => {
    setErrors({});
  };

  const updateTeamMember = (index, name, classValue) => {
    setTeamMembers((prevMembers) => {
      const newMembers = [...prevMembers];
      newMembers[index] = { name, class: classValue };
      return newMembers;
    });
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ display: "grid", gap: isMobile ? 2 : 4, paddingY: 5 }}
    >
      <Typography variant="h5" color="text.primary">
        Add a Team
      </Typography>
      <InputControl
        label="Team Name"
        type="text"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
      />

      <InputControl
        label="School Name"
        type="text"
        value={values.school}
        onChange={(e) => setValues({ ...values, school: e.target.value })}
      />

      <Grid spacing={5} container>
        <Grid xs={6} item>
          <InputLabel sx={{ fontSize: "14px", color: "#2E2E2E" }}>
            State
          </InputLabel>
          <SelectControl
            value={values.state}
            onChange={(e) => setValues({ ...values, state: e.target.value })}
            options={Object.keys(stateDistrict).map((state) => ({
              label: state,
              value: state,
            }))}
            sx={{mb:1}}
          />
           {errors.state && (
            <Typography variant="caption" color="error">
              {errors.state}
            </Typography>)}
        </Grid>
        <Grid xs={6} item>
          <InputLabel sx={{ fontSize: "14px", color: "#2E2E2E" }}>
            District
          </InputLabel>
          <SelectControl
            value={values.state && values.district}
            onChange={(e) => setValues({ ...values, district: e.target.value })}
            options={
              values.state
                ? stateDistrict[values.state].map((district) => ({
                    label: district,
                    value: district,
                  }))
                : []
            }
            sx={{ mb: 1 }}
            
          />
          {errors.district && (
            <Typography variant="caption" color="error">
              {errors.district}
            </Typography>
          )}
        </Grid>
      </Grid>

      <hr />

      <Box sx={{ display: "grid", gap: 1 }}>
        <Typography variant="body2" color="text.primary">
          Select Team Size
        </Typography>
        <Box className="btnGrp">
          {sizeList.map((size) => (
            <Button
              className={`teamBtn ${
                teamSize === size ? "teamBtn-selected" : ""
              }`}
              variant="subtitle1"
              onClick={() => setTeamSize(size)}
              key={size}
            >
              {size}
            </Button>
          ))}
        </Box>
      </Box>

      <Typography variant="" color="Gray.light">
        User ID and password will be created automatically and shareable from
        the dashboard
      </Typography>

      {Array.from({ length: teamSize }, (_, index) => (
        <Grid spacing={5} container key={index}>
          <Grid xs={6} item>
            <InputControl
              label={`Student Name ${index + 1}`}
              type="text"
              value={teamMembers[index] ? teamMembers[index].name : ""}
              onChange={(e) =>
                updateTeamMember(
                  index,
                  e.target.value,
                  teamMembers[index]?.class
                )
              }
              sx={{mb:1}}
              error={
                errors.teamMembers &&
                errors.teamMembers[index] &&
                errors.teamMembers[index].name
              }
               
            />
          
          </Grid>
          <Grid xs={6} item>
            <InputLabel
              id={`class${index + 1}`}
              style={{ fontSize: "14px", color: "#2E2E2E" }}
            >
              Class
            </InputLabel>
            <SelectControl
              sx={{ mt: 1 ,mb:1}}
              value={teamMembers[index] ? teamMembers[index].class : ""}
              onChange={(e) =>
                updateTeamMember(
                  index,
                  teamMembers[index]?.name,
                  e.target.value
                )
              }
              options={[
                { label: "5th", value: "5" },
                { label: "6th", value: "6" },
                { label: "7th", value: "7" },
                { label: "8th", value: "8" },
                { label: "9th", value: "9" },
                { label: "10th", value: "10" },
              ]}
            />
            {errors.teamMembers &&
              errors.teamMembers[index] &&
              errors.teamMembers[index].class && (
                <Typography variant="caption" color="error">
                  {errors.teamMembers[index].class}
                </Typography>
              )}
          </Grid>
        </Grid>
      ))}

      <Typography variant="" color="Gray.light">
        If you do not have the student details, you can skip this step and add a
        team later
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          onClick={() =>
            setActiveStep ? setActiveStep(0) : handleCloseDialog()
          }
          className="Button"
          color="primary"
        >
          Back
        </Button>
        {setActiveStep && (
          <Button
            className="Button"
            color="primary"
            onClick={() => router.push("/teacher/teams")}
          >
            Skip
          </Button>
        )}
        <Button
          className="Button"
          color="primary"
          variant="contained"
          sx={{ minWidth: 240, display: "block" }}
          onClick={createTeam}
        >
          Add Team
        </Button>
      </Box>
    </Container>
  );
};

export default Team;
