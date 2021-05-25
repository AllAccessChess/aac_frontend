import AxiosMockAdapter from "axios-mock-adapter";
import axios from "./axios";

const axiosMockAdapter = new AxiosMockAdapter(axios, {
  delayResponse: 0.5,
});

export default axiosMockAdapter;
