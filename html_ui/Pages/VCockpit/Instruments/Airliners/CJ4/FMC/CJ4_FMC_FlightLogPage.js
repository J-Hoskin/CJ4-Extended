class CJ4_FMC_FlightLogPage {
    static ShowPage1(fmc) {
        fmc.clearDisplay();

        // Takeoff time
        let takeOffTimeString = "";
        const takeOffTime = SimVar.GetSimVarValue("L:TAKEOFF_TIME", "seconds");
        if(takeOffTime){
            const takeOffDate = new Date(takeOffTime * 1000); // convert to milliseconds
            const takeOffHours = takeOffDate.getHours() > 9 ? "" + takeOffDate.getHours() : "0" + takeOffDate.getHours();
            const takeOffMinutes = takeOffDate.getMinutes() > 9 ? "" + takeOffDate.getMinutes() : "0" + takeOffDate.getMinutes();
            takeOffTimeString = takeOffHours + ":" + takeOffMinutes;
        }

        // Calculate enroute time
        let enrouteTimeString = "";
        const enrouteTime = SimVar.GetSimVarValue("GPS ETE", "seconds");
        if(enrouteTime !== undefined){
            const enrouteHours = (enrouteTime / 3600).toFixed(0) > 9 ? "" + (enrouteTime / 3600).toFixed(0) : "0" + (enrouteTime / 3600).toFixed(0);
            const enrouteMinutes = ((enrouteTime % 3600) / 60).toFixed(0);
            enrouteTimeString =  enrouteHours + ":" + enrouteMinutes;
        }

        // Calculate landing time
        let landingTimeString = "";
        if(takeOffTime && enrouteTime){
            const landingTime = takeOffTime + enrouteTime;
            const landingDate = new Date(landingTime * 1000); // convert to milliseconds
            const landingHour = landingDate.getHours() > 9 ? "" + landingDate.getHours() : "0" + landingDate.getHours();
            const landingMinute = landingDate.getMinutes() > 9 ? "" + landingDate.getMinutes() : "0" + landingDate.getMinutes();
            landingTimeString = landingHour + ":" + landingMinute;
        }

        // Calculate fuel usage (Currently resets if fuel increased during flight)
        let startingFuel = SimVar.GetSimVarValue("L:STARTING_FUEL", "gallons");
        const currentFuel = SimVar.GetSimVarValue("FUEL TOTAL QUANTITY", "gallons");
        if(currentFuel >= startingFuel){
            SimVar.SetSimVarValue("L:STARTING_FUEL", "gallons", currentFuel);
            startingFuel = SimVar.GetSimVarValue("L:STARTING_FUEL", "gallons");
        }
        const fuelUsed = (startingFuel - currentFuel).toFixed(0);

        // Calculate planned flight ground distance
        let flightPlanManagerWaypoints = fmc.flightPlanManager.getWaypoints();
        let totalWaypointDistance = 0;

        for(let i = 0; i < flightPlanManagerWaypoints.length; i++) {
            let waypoint = flightPlanManagerWaypoints[i];
            let nextWaypointDistance = isFinite(waypoint.cumulativeDistanceInFP) ? waypoint.cumulativeDistanceInFP.toFixed(0) : 0;
            totalWaypointDistance += Number.parseInt(nextWaypointDistance);
        }

        fmc.setTemplate([
            ["FLIGHT LOG"],
            ["T/O", "LDG", "EN ROUTE"],
            [takeOffTimeString, landingTimeString, enrouteTimeString],
            [""],
            ["FUEL USED", "AVG TAS/GS"],
            [fuelUsed + " GAL", ""],
            ["", ""],
            ["TOTAL GND DIST"],
            [totalWaypointDistance.toString()],
            [""],
            [""],
            ["__FMCSEPARATOR"],
            ["<PERF MENU", ""]
        ]);
        fmc.onLeftInput[5] = () => { CJ4_FMC_PerfMenuPage.ShowPage1(fmc); };
        fmc.updateSideButtonActiveStatus();
    }
}
//# sourceMappingURL=CJ4_FMC_ThrustLimPage.js.map