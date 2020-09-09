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
            }
        ];

        // Setup variables
        SimVar.SetSimVarValue("L:SEATBELT_LIGHTS_ON", "Bool", 1);
        SimVar.SetSimVarValue("A:GLOBAL_SEATBELT_LIGHTS_ON", "Bool", 1);
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

        if (takeOffTime == 0){
            const onGround = SimVar.GetSimVarValue("SIM ON GROUND", "Bool");
            const altitude = SimVar.GetSimVarValue("GPS POSITION ALT", "number");

            if (!onGround && altitude > 3){
                const localTime = SimVar.GetGlobalVarValue("LOCAL TIME", "seconds");
                if(localTime){
                    SimVar.SetSimVarValue("L:TAKEOFF_TIME", "seconds", localTime);
                }
            }
        }

        // if(onGround && SimVar.GetSimVarValue("L:TAKEOFF_TIME", "number") !== undefined){
        //     SimVar.SetSimVarValue("L:TAKEOFF_TIME", "seconds", undefined);
        // }
    }

}