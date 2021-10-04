(async () => {

  const res = await fetch("https://onlinebusiness.icbc.com/deas-api/v1/web/rebook", {
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MzMzMDUzNTUsInN1YiI6IjAyMjQyMjAiLCJpYXQiOjE2MzMzMDM1NTUsInByb2ZpbGUiOiJ7XCJ1c2VySWRcIjpcIjAyMjQyMjBcIixcInJvbGVzXCI6W1wiSm9lUHVibGljXCJdfSJ9.Wdbni1iQdHSO6kPV7iOwuJEVGKKSufsISr7SV2O0v_U",
      "content-type": "application/json",
      "sec-ch-ua": '"Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Linux"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
    },
    referrer: "https://onlinebusiness.icbc.com/webdeas-ui/booking",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: JSON.stringify({
      // userId: "WEBD:1269744",
      appointment: {
        appointmentDt: { dayOfWeek: "Friday", date: "2022-01-21" },
        startTm: "15:00",
        endTm: "15:45",
        posId: 209,
        resourceId: 14457,
        dlExam: { code: "7-R-1", description: "Class 7 Road Test" },
        lemgMsgId: 0,
        officeNum: 90813,
        posName: "COURTENAY",
        bookedIndicator: "ACTIVE",
        bookedTs: "2021-10-03T16:26:24",
        statusCode: "RE-BOOKED",
        drvrDriver: {
          drvrId: 1269744,
          lastName: "VANDERPOL",
          firstName: "PIETER",
          licenseNumber: "0224220",
          phoneNum: "7782690306",
        },
        drscDrvSchl: {},
        checkTm: "14:45",
        posGeo: {
          posId: 209,
          lat: 49.6764489,
          lng: -124.9821591,
          address: "2500 Cliffe Ave, Courtenay, BC V9N 5M6",
          address1: "2500 Cliffe Ave",
          city: "Courtenay",
          province: "BC",
          postcode: "V9N 5M6",
          agency: "Courtenay Service BC centre",
          url: "https://www.google.com/maps/search/?api=1&query=49.676449,-124.982159&query_place_id=ChIJ84lNp38UiFQRNax8V7Wm1CA",
        },
      },
      action: "RE-BOOKED",
    }),
    method: "PUT",
    mode: "cors",
    credentials: "include",
  });

  console.log(await res.text());
})();
