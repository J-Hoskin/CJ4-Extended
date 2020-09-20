class CJ4_FMC_FlightLogPage {
    static ShowPage1(fmc) {
        fmc.clearDisplay();

        // Takeoff time
        let takeOffTimeString = "";
        const takeOffTime = SimVar.GetSimVarValue("L:TAKEOFF_TIME", "seconds");
        if(takeOffTime){
            const hours = Math.floor(takeOffTime / 60 / 60);
            const hoursString = hours > 9 ? "" + hours : "0" + hours;

            const minutes = Math.floor(takeOffTime / 60) - (hours * 60);
            const minutesString = minutes > 9 ? "" + minutes : "0" + minutes;
            takeOffTimeString = hoursString + ":" + minutesString;
        }

        // Enroute time
        let enrouteTimeString = "";
        const enrouteTime = SimVar.GetSimVarValue("L:ENROUTE_TIME", "seconds");
        if(enrouteTime){
            const hours = Math.floor(enrouteTime / 60 / 60);
            const hoursString = hours > 9 ? "" + hours : "0" + hours;

            const minutes = Math.floor(enrouteTime / 60) - (hours * 60);
            const minutesString = minutes > 9 ? "" + minutes : "0" + minutes;
            enrouteTimeString = hoursString + ":" + minutesString;
        }

        // Landing time
        let landingTimeString = "";
        const landingTime = SimVar.GetSimVarValue("L:LANDING_TIME", "seconds");
        if(landingTime){
            const hours = Math.floor(landingTime / 60 / 60);
            const hoursString = hours > 9 ? "" + hours : "0" + hours;

            const minutes = Math.floor(landingTime / 60) - (hours * 60);
            const minutesString = minutes > 9 ? "" + minutes : "0" + minutes;
            landingTimeString = hoursString + ":" + minutesString;
        }

        // Calculate fuel usage (Currently resets if fuel increased during flight)
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
            ["AIR DIST", "GND DIST", ""],
            [],
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