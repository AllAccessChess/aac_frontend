// AAC Zoom Library - Helpers

import { ZoomMtg } from "@zoomus/websdk";

import { ZoomMeetingRole } from "./constants";

export const loadStyleSheet = (url) => {
  var sheet = document.createElement("link");
  sheet.rel = "stylesheet";
  sheet.href = url;
  sheet.type = "text/css";
  document.head.appendChild(sheet);
};

// @security
// For the security reasons, this method needs to be moved to the back-end
export const generateSignature = (
  meetingNumber,
  apiKey,
  apiSecret,
  role = ZoomMeetingRole.Attendee
) => {
  try {
    return new Promise((resolve, reject) => {
      ZoomMtg.generateSignature({
        meetingNumber: meetingNumber,
        apiKey: apiKey,
        apiSecret: apiSecret,
        role: role,
        success: function (res) {
          resolve(res.result);
        },
        error: function (res) {
          reject(res);
        },
      });
    });
  } catch (err) {
    console.error(err);
  }
};
