class CJ4_FMC_FlightLogPage {
    static ShowPage1(fmc) {
        fmc.clearDisplay();

        // Takeoff time
        const takeOffTime = SimVar.GetSimVarValue("L:TAKEOFF_TIME", "seconds");
        const takeOffDate =  new Date(takeOffTime * 1000); // convert to milliseconds
        let takeOffTimeString = ""
        if(takeOffTime !== undefined){
            takeOffTimeString = takeOffDate.getHours() + ":" + takeOffDate.getMinutes();
        }

        // Calculate enroute time
        const enrouteTime = SimVar.GetSimVarValue("GPS ETE", "seconds");
        let enrouteTimeString = "";
        if(enrouteTime !== undefined){
            enrouteTimeString = (enrouteTime / 3600).toFixed(0) + ":" + ((enrouteTime % 3600) / 60).toFixed(0);
        }

        // Landing time
        const landingTime = takeOffTime + enrouteTime;
        const landingDate =  new Date(landingTime * 1000); // convert to milliseconds
        const landingTimeString = landingDate.getHours() + ":" + landingDate.getMinutes();

        // Calculate planned flight distance
        let flightPlanManagerWaypoints = fmc.flightPlanManager.getWaypoints();
        let totalWaypointDistance = 0;

        for(let i = 0; i < flightPlanManagerWaypoints.length; i++){
            let waypoint = flightPlanManagerWaypoints[i];
            let nextWaypointDistance = isFinite(waypoint.cumulativeDistanceInFP) ? waypoint.cumulativeDistanceInFP.toFixed(0) : 0;
            totalWaypointDistance += nextWaypointDistance;
        }

        // Calculate fuel usage
        let startingFuel = SimVar.GetSimVarValue("L:STARTING_FUEL", "gallons");
        const currentFuel = SimVar.GetSimVarValue("FUEL TOTAL QUANTITY", "gallons");

        if(currentFuel >= startingFuel){
            SimVar.SetSimVarValue("L:STARTING_FUEL", "gallons", currentFuel);
            startingFuel = SimVar.GetSimVarValue("L:STARTING_FUEL", "gallons");
        }

        const fuelUsed = (startingFuel - currentFuel).toFixed(0);

        fmc.setTemplate([
            ["FLIGHT LOG"],
            ["T/O", "LDG", "EN ROUTE"],
            [takeOffTimeString, landingTimeString, enrouteTimeString],
            [""],
            ["FUEL USED", "AVG TAS/GS"],
            [fuelUsed + " GAL", ""],
            ["", ""],
            ["AIR DIST", "GND DIST"],
            ["", ""],
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