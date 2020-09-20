// Use this to create and sync local simvars that are derived from other simvars.
// To create and sync a new local simvar, you need to add a selector and an updater.
// The selector calculates the new value based on other simvars and some logic.
// The updater compares the new value from the selector with the current value from the local simvar,
// and then updates the local simvar if it changed.
class LocalVarManager {
    constructor() {
        this.updaters = [
            {
                varName: "L:TAKEOFF_TIME",
                type: "seconds",
                selector: this._updateTakeOffTime,
            },
            {
                varName: "L:LANDING_TIME",
                type: "seconds",
                selector: this._updateLandingTime,
            },
            {
                varName: "L:ENROUTE_TIME",
                type: "seconds",
                selector: this._enrouteLandingTime,
            }
        ];

        // Setup variables
        SimVar.SetSimVarValue("L:SEATBELT_LIGHT_ON", "Bool", 0);
        SimVar.SetSimVarValue("L:SAFETY_LIGHT_ON", "Bool", 0);
        SimVar.SetSimVarValue("L:STARTING_FUEL", "gallons", SimVar.GetSimVarValue("FUEL TOTAL QUANTITY", "gallons"));

        // Chart variables
        SimVar.SetSimVarValue("L:SELECTED_AIRPORT_CHART", "number", 1); // Arrival airport aerodrome
        SimVar.SetSimVarValue("L:CHART_DIMMING", "number", 1); // Day dimming
        SimVar.SetSimVarValue("L:CHART_SCROLL_POSITION", "number", 0);
        SimVar.SetSimVarValue("L:CHART_PAGE", "number", 1);
    }

    update() {
        this.updaters.forEach(this._runUpdater);
    }

    _runUpdater({varName, type, selector}) {
        const newValue = selector();
        const currentValue = SimVar.GetSimVarValue(varName, type);
        if (newValue !== currentValue) {
            SimVar.SetSimVarValue(varName, type, newValue);
        }
    }

    _updateTakeOffTime() {
        const takeOffTime = SimVar.GetSimVarValue("L:TAKEOFF_TIME", "seconds");

        if (!takeOffTime){
            const onGround = SimVar.GetSimVarValue("SIM ON GROUND", "Bool");
            const altitude = SimVar.GetSimVarValue("GPS POSITION ALT", "number");

            if (!onGround && altitude > 3){
                const localTime = SimVar.GetGlobalVarValue("LOCAL TIME", "seconds");
                if(localTime){
                    SimVar.SetSimVarValue("L:TAKEOFF_TIME", "seconds", localTime);
                }
            }
        }
    }

    _updateLandingTime() {
        const takeOffTime = SimVar.GetSimVarValue("L:TAKEOFF_TIME", "seconds");

        if(takeOffTime){
            const onGround = SimVar.GetSimVarValue("SIM ON GROUND", "Bool");

            if (onGround){
                const localTime = SimVar.GetGlobalVarValue("LOCAL TIME", "seconds");
                if(localTime){
                    SimVar.SetSimVarValue("L:LANDING_TIME", "seconds", localTime);
                }
            }
        }
    }

    _enrouteLandingTime(){
        const takeOffTime = SimVar.GetSimVarValue("L:TAKEOFF_TIME", "seconds");

        if(takeOffTime){
            const localTime = SimVar.GetGlobalVarValue("LOCAL TIME", "seconds");
            const enrouteTime = localTime - takeOffTime;
            SimVar.SetSimVarValue("L:ENROUTE_TIME", "seconds", enrouteTime);
        }
    }

}