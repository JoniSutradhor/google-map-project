import "./App.css";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import {
  Box,
  Button,
  ButtonGroup,
  Drawer,
  Hidden,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ZoomOutMapOutlinedIcon from "@mui/icons-material/ZoomOutMapOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocationLightGreen from "./assets/images/location_light_green.png";
import LocationBlue from "./assets/images/location_new_blue.png";

export default function App() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMore, setIsMore] = useState(false);
  const [responseData, setResponseData] = useState([]);
  const [responseDetailsData, setResponseDetailsData] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchBoxDataLength, setSearchBoxDataLength] = useState(0);
  const [nearByData, setNearByData] = useState([]);
  const [center, setCenter] = useState({
    lat: 23.989014,
    lng: 90.418167,
  });
  const [markers, setMarkers] = useState([
    {
      lat: 23.989014,
      lng: 90.418167,
    },
    {
      lat: 24.069452,
      lng: 90.222122,
    },
    {
      lat: 23.911522,
      lng: 90.388962,
    },
  ]);
  const [searchBoxText, setSearchBoxText] = useState("");
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_PUBLIC_API_KEY,
    libraries: ["places"],
  });
  const [map, setMap] = useState(null);
  const inputRef = useRef();

  const closeSearchDrawer = () => {
    setIsOpen(false);
  };
  const buttons = [
    <Button key="one" style={{ backgroundColor: "white", color: "black" }}>
      <AddIcon />
    </Button>,
    <Button key="two" style={{ backgroundColor: "white", color: "black" }}>
      <RemoveIcon />
    </Button>,
    <Button key="three" style={{ backgroundColor: "white", color: "black" }}>
      <UnfoldMoreIcon />
    </Button>,
  ];

  const nearByOptions = [
    {
      title: "Food",
      value: "food",
      isNearbySearchOption: true,
    },
    {
      title: "Bank",
      value: "bank",
      isNearbySearchOption: true,
    },
    {
      title: "Healthcare",
      value: "healthcare",
      isNearbySearchOption: true,
    },
    {
      title: "More..",
      value: "more",
      isNearbySearchOption: false,
    },
    {
      title: "Education",
      value: "education",
      isMoreOption: true,
      isNearbySearchOption: true,
    },
    {
      title: "Hotel",
      value: "hotel",
      isMoreOption: true,
      isNearbySearchOption: true,
    },
  ];

  const handleSuggestionsList = (param) => {
    setSearchBoxDataLength(param?.length || 0);
    setSearchBoxText(param);
    if (param) {
      // fetch(`https://barikoi.xyz/v1/api/search/autocomplete/NDgyMjpHRVFNTDdGTkQ4/place?q=${param}`)
      fetch(`https://api.bmapsbd.com/search/autocomplete/web?search=${param}`)
        .then(async (response) => {
          const parsedData = await response.json();
          setResponseData(parsedData.places);
        })
        .catch((error) => console.error("Error:", error));
    } else setResponseData([]);
  };

  const getLocationDetails = (param) => {
    setResponseData([]);
    if (param) {
      // fetch(`https://barikoi.xyz/v1/api/search/autocomplete/NDgyMjpHRVFNTDdGTkQ4/place?q=${param}`)
      fetch(`https://api.bmapsbd.com/place/${param}`)
        .then(async (response) => {
          const parsedData = await response.json();
          const { latitude, longitude } = parsedData;
          setSelectedLocation({ lat: latitude, lng: longitude });
          setCenter({ lat: latitude, lng: longitude });
          setResponseDetailsData(parsedData);
        })
        .catch((error) => console.error("Error:", error));
    } else setResponseDetailsData([]);
  };

  const exploreNearby = (param) => {
    setResponseData([]);
    if (param) {
      // fetch(`https://barikoi.xyz/v1/api/search/autocomplete/NDgyMjpHRVFNTDdGTkQ4/place?q=${param}`)
      fetch(
        `https://api.bmapsbd.com/public/find/nearby/by/catagory/noauth?latitude=${param.lat}&longitude=${param.lng}&ptype=${param.category}`
      )
        .then(async (response) => {
          const parsedData = await response.json();
          setNearByData(parsedData);
        })
        .catch((error) => console.error("Error:", error));
    } else setNearByData([]);
  };

  const getLocationByTextBoxValue = (searchBoxText) => {
    if (searchBoxText) {
      const data = new URLSearchParams();
      data.append("q", searchBoxText);
      fetch(`https://api.bmapsbd.com/elastic-search-masking`, {
        method: "POST",
        body: data,
      })
        .then(async (response) => {
          const parsedData = await response.json();
          setResponseDetailsData(parsedData.places[0]);
          const { latitude, longitude } = parsedData.places[0];
          setSelectedLocation({
            lat: parseFloat(latitude),
            lng: parseFloat(longitude),
          });
          setCenter({ lat: parseFloat(latitude), lng: parseFloat(longitude) });
          setResponseData([]);
        })
        .catch((error) => console.error("Error:", error));
    } else setResponseDetailsData([]);
  };

  const clearSearchBoxText = () => {
    setSearchBoxText("");
    setSearchBoxDataLength(0);
    setResponseData([]);
    setResponseDetailsData(null);
    setNearByData([]);
  };

  if (!isLoaded) return <div>Loading...</div>;
  return (
    <div>
      <Hidden smUp>
        <div className="absolute mt-5 z-50 w-full">
          <div className="search-bar">
            <div className="input-container relative">
              <input
                style={{
                  backgroundColor: "white",
                  height: "20px",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                }}
                type="text"
                name="search"
                placeholder="Search"
                value={searchBoxText}
                onChange={(e) => handleSuggestionsList(e.target.value)}
                className="w-full"
              />
              {searchBoxDataLength > 0 && (
                <button
                  type="submit"
                  className="absolute right-20 top-2"
                  onClick={() => clearSearchBoxText()}
                >
                  <CloseIcon />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-0 top-1 mr-4 search-icon btn"
                onClick={() => getLocationByTextBoxValue(searchBoxText)}
              >
                <SearchIcon />
              </button>
            </div>
          </div>
          {responseData.length > 0 && (
            <div className="autocomplete-content">
              <ul className="scroll">
                {responseData.map((data) => (
                  <li
                    key={data.id}
                    className="flex flex-row justify-self-start cursor-pointer"
                    onClick={() => getLocationDetails(data.uCode)}
                  >
                    <LocationOnIcon className="self-center" />
                    <div className="pl-5">
                      <p>{data.Address.split(", ")[0]}</p>
                      <p>{`${data.Address.split(", ")[1]}, ${data.area}, ${
                        data.city
                      }`}</p>
                      <p>
                        {data.thana} <span>{data.district}</span>
                      </p>
                      <p>
                        {data.pType} <span>{data.subType}</span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Hidden>
      <Hidden smUp>
        {!!responseDetailsData && (
          <div className="px-5 absolute bottom-[-150px] bg-[#2a2e43] text-white z-50">
            <div className="py-4">
              <Typography style={{ fontSize: "20px" }}>
                {responseDetailsData.business_name}
              </Typography>
              <Typography
                style={{ fontSize: "15px" }}
              >{`${responseDetailsData.Address} ${responseDetailsData.area},  ${responseDetailsData.city}`}</Typography>
              <Typography style={{ fontSize: "15px" }}>
                Thana: {responseDetailsData.thana}
              </Typography>
              <Typography style={{ fontSize: "15px" }}>
                Destrict: {responseDetailsData.district}
              </Typography>
              <Typography style={{ fontSize: "15px" }}>
                Postcode: {responseDetailsData.postCode}
              </Typography>
              <Typography style={{ fontSize: "15px" }}>
                <span
                  style={{
                    backgroundColor: "white",
                    color: "#00DBA0",
                    borderRadius: "2px",
                  }}
                  className="px-1"
                >
                  {responseDetailsData.subType}
                </span>
              </Typography>
              <Typography style={{ fontSize: "15px" }}>
                Place Code :{" "}
                <span
                  style={{
                    backgroundColor: "white",
                    color: "#00DBA0",
                    borderRadius: "2px",
                  }}
                  className="px-1"
                >
                  {responseDetailsData.uCode}
                </span>
              </Typography>
            </div>
            <div className="pb-2">
              <Typography style={{ fontSize: "20px" }}>
                Explore Nearby
              </Typography>
                <div className="flex flex-row gap-2">
                    {nearByOptions.map(
                        (option) =>
                            !option.isMoreOption && (
                                <Box
                                    component="span"
                                    className="cursor-pointer"
                                    sx={{
                                        border: "1px solid grey",
                                        borderRadius: "8px",
                                        paddingY: 0.5,
                                        paddingX: "15px",
                                    }}
                                    onClick={() => {
                                        !option?.isNearbySearchOption
                                            ? setIsMore(!isMore)
                                            : exploreNearby({
                                                lat: responseDetailsData.latitude,
                                                lng: responseDetailsData.longitude,
                                                category: option.value,
                                            });
                                    }}
                                >
                                    {option.title}
                                </Box>
                            )
                    )}
                </div>

                <div className="flex flex-row gap-2 py-2">
                    {nearByOptions.map((option) => {
                        return option.isMoreOption && isMore ? (
                            <Box
                                component="span"
                                className="cursor-pointer"
                                sx={{
                                    border: "1px solid grey",
                                    borderRadius: "8px",
                                    paddingY: 0.5,
                                    paddingX: "15px",
                                }}
                                onClick={() =>
                                    exploreNearby({
                                        lat: responseDetailsData.latitude,
                                        lng: responseDetailsData.longitude,
                                        category: option.value,
                                    })
                                }
                            >
                                {option.title}
                            </Box>
                        ) : (
                            ""
                        );
                    })}
                </div>
            </div>
            {nearByData.length > 0 && (
              <div
                className="py-2"
                style={{ height: "120px", overflowY: "scroll" }}
              >
                {nearByData.map((nData) => (
                  <div className="py-1">{nData.Address}</div>
                ))}
              </div>
            )}
          </div>
        )}
      </Hidden>
      <Hidden smDown>
        <div>
          <Drawer anchor="left" open={isOpen} onClose={closeSearchDrawer}>
            <div className="px-2">
              <div className="flex flex-row justify-between px-5 pb-4">
                <div className="font-bold  pt-5 text-2xl">
                  Bari<span style={{ color: "#2ddbac" }}>koi</span>
                </div>
                <div
                  className="font-bold  pt-5 cursor-pointer"
                  onClick={() => closeSearchDrawer()}
                >
                  <ArrowBackIosNewIcon />
                </div>
              </div>
              <div className="px-5 md:min-w-[600px]">
                <div className="search-bar">
                  <div className="input-container relative">
                    <input
                      style={{
                        backgroundColor: "white",
                        height: "20px",
                        border: "none",
                        outline: "none",
                        background: "transparent",
                      }}
                      type="text"
                      name="search"
                      placeholder="Search"
                      value={searchBoxText}
                      onChange={(e) => handleSuggestionsList(e.target.value)}
                      className="w-full"
                    />
                    {searchBoxDataLength > 0 && (
                      <button
                        type="submit"
                        className="absolute right-20 top-2"
                        onClick={() => clearSearchBoxText()}
                      >
                        <CloseIcon />
                      </button>
                    )}
                    <button
                      type="submit"
                      className="absolute right-0 top-1 mr-4 search-icon btn"
                      onClick={() => getLocationByTextBoxValue(searchBoxText)}
                    >
                      <SearchIcon />
                    </button>
                  </div>
                </div>
                {responseData.length > 0 && (
                  <div className="autocomplete-content">
                    <ul className="scroll">
                      {responseData.map((data) => (
                        <li
                          key={data.id}
                          className="flex flex-row justify-self-start cursor-pointer"
                          onClick={() => getLocationDetails(data.uCode)}
                        >
                          <LocationOnIcon className="self-center" />
                          <div className="pl-5">
                            <p>{data.Address.split(", ")[0]}</p>
                            <p>{`${
                              data.Address.split(", ")[1]
                                ? data.Address.split(", ")[1]
                                : data.business_name
                            }, ${data.city}`}</p>
                            <p>
                              <span className="bg-[#DEE5ED] px-1 w-auto rounded-sm text-[#000000]">
                                Thana:
                              </span>{" "}
                              {data.thana}{" "}
                              <span>
                                <span className="bg-[#DEE5ED] px-1 w-auto rounded-sm text-[#000000]">
                                  District:
                                </span>{" "}
                                {data.district}
                              </span>
                            </p>
                            <p>
                              <span className="bg-[#DEE5ED] px-1 w-auto rounded-sm text-[#000000]">
                                {data.pType}
                              </span>{" "}
                              <span className="bg-[#DEE5ED] px-1 w-auto rounded-sm text-[#000000]">
                                {data.subType}
                              </span>
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {!!responseDetailsData && (
                  <div className="px-10 ">
                    <div className="py-16">
                      <Typography
                        style={{ fontSize: "30px", fontWeight: "275" }}
                      >
                        {responseDetailsData.business_name}
                      </Typography>
                      <Typography>{`${responseDetailsData.Address} ${responseDetailsData.area},  ${responseDetailsData.city}`}</Typography>
                      <Typography>
                        Thana: {responseDetailsData.thana}
                      </Typography>
                      <Typography>
                        Destrict: {responseDetailsData.district}
                      </Typography>
                      <Typography>
                        Postcode: {responseDetailsData.postCode}
                      </Typography>
                      <Typography>
                        <span className="bg-[#DEE5ED] px-1 w-auto rounded-sm text-[#000000]">
                          {responseDetailsData.subType}
                        </span>
                      </Typography>
                      <Typography>
                        Place Code :{" "}
                        <span className="bg-[#DEE5ED] px-1 w-auto rounded-sm text-[#000000]">
                          {responseDetailsData.uCode}
                        </span>
                      </Typography>
                    </div>
                    <div>
                      <Typography style={{ fontSize: "20px" }}>
                        Explore Nearby
                      </Typography>
                      <div className="flex flex-row gap-2">
                        {nearByOptions.map(
                          (option) =>
                            !option.isMoreOption && (
                              <Box
                                component="span"
                                className="cursor-pointer"
                                sx={{
                                  border: "1px solid grey",
                                  borderRadius: "8px",
                                  paddingY: 0.5,
                                  paddingX: "15px",
                                }}
                                onClick={() => {
                                  !option?.isNearbySearchOption
                                    ? setIsMore(!isMore)
                                    : exploreNearby({
                                        lat: responseDetailsData.latitude,
                                        lng: responseDetailsData.longitude,
                                        category: option.value,
                                      });
                                }}
                              >
                                {option.title}
                              </Box>
                            )
                        )}
                      </div>

                      <div className="flex flex-row gap-2 py-2">
                        {nearByOptions.map((option) => {
                          return option.isMoreOption && isMore ? (
                            <Box
                              component="span"
                              className="cursor-pointer"
                              sx={{
                                border: "1px solid grey",
                                borderRadius: "8px",
                                paddingY: 0.5,
                                paddingX: "15px",
                              }}
                              onClick={() =>
                                exploreNearby({
                                  lat: responseDetailsData.latitude,
                                  lng: responseDetailsData.longitude,
                                  category: option.value,
                                })
                              }
                            >
                              {option.title}
                            </Box>
                          ) : (
                            ""
                          );
                        })}
                      </div>
                    </div>
                    {nearByData.length > 0 && (
                      <div
                        className="py-2"
                        style={{
                          height: "120px",
                          overflowY: "scroll",
                          maxWidth: "680px",
                        }}
                      >
                        {nearByData.map((nData) => (
                          <div className="py-1">{nData.Address}</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Drawer>
        </div>
      </Hidden>

      <Hidden smDown>
        <h1
          style={{
            zIndex: 10,
            position: "absolute",
            left: 20,
            top: 15,
            cursor: "pointer",
          }}
        >
          <ArrowForwardIosIcon
            fontSize="small"
            onClick={() => setIsOpen(true)}
          />
        </h1>
      </Hidden>
      {/*<button*/}
      {/*  style={{*/}
      {/*    zIndex: 10,*/}
      {/*    position: "absolute",*/}
      {/*    left: 10,*/}
      {/*    top: 80,*/}
      {/*    color: "black",*/}
      {/*    backgroundColor: "white",*/}
      {/*    width: "40px",*/}
      {/*    paddingBottom: "5px",*/}
      {/*    borderRadius: "5px",*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <ZoomOutMapOutlinedIcon fontSize="small" />*/}
      {/*</button>*/}
      {/*<ButtonGroup*/}
      {/*  orientation="vertical"*/}
      {/*  aria-label="vertical outlined button group"*/}
      {/*  style={{ position: "absolute", zIndex: 10, top: 115, left: 10 }}*/}
      {/*  size="small"*/}
      {/*  sx={{ width: "5px", backgroundColor: "white" }}*/}
      {/*>*/}
      {/*  {buttons}*/}
      {/*</ButtonGroup>*/}
      <GoogleMap
        zoom={10}
        center={center}
        mapContainerClassName="map-container"
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          zoomControl: true,
          fullscreenControl: true,
          fullscreenControlOptions: {
            position: window.google.maps.ControlPosition.LEFT_CENTER,
          },
          zoomControlOptions: {
            position: window.google.maps.ControlPosition.LEFT_CENTER,
          },
        }}
      >
        {!!selectedLocation && <MarkerF position={selectedLocation} />}
        {nearByData.length > 0 &&
          nearByData.map((nData) => (
            <div>
              <MarkerF
                position={{ lat: nData.latitude, lng: nData.longitude }}
                options={{
                  icon: LocationBlue,
                }}
              />
            </div>
          ))}
      </GoogleMap>
    </div>
  );
}
