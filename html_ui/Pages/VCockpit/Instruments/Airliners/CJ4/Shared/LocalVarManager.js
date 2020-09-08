// Use this to create and sync local simvars that are derived from other simvars.
// To create and sync a new local simvar, you need to add a selector and an updater.
// The selector calculates the new value based on other simvars and some logic.
// The updater compares the new value from the selector with the current value from the local simvar,
// and then updates the local simvar if it changed.
class LocalVarManager {
    constructor() {
        this.updaters = [
            {
                varName: "L:AVG_AIR_SPEED",
                type: "number",
                selector: this._averageAirSpeed,
            },
            // {
            //     varName: "L:AVG_GROUND_SPEED",
            //     type: "number",
            //     selector: this._averageAirSpeed,
            // },
            // {
            //     varName: "L:GROUND_DISTANCE",
            //     type: "number",
            //     selector: this._groundDistance,
            // },
            // {
            //     varName: "L:AIR_DISTANCE",
            //     type: "number",
            //     selector: this._averageAirSpeed,
            // },
            {
                varName: "L:TAKEOFF_TIME",
                type: "seconds",
                selector: this._updateTakeOffTime,
            },


        ];
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

        if(!takeOffTime){
            const onGround = SimVar.GetSimVarValue("SIM ON GROUND", "Bool");
            const altitude = SimVar.GetSimVarValue("GPS POSITION ALT", "number");
            if(!onGround && altitude > 3){
                let currentTime = SimVar.GetSimVarValue("LOCAL TIME", "seconds");
                if(!currentTime){
                    currentTime = new Date().getTime();
                }
                SimVar.SetSimVarValue("L:TAKEOFF_TIME", "seconds", currentTime);
            }
        }

        // if(onGround && SimVar.GetSimVarValue("L:TAKEOFF_TIME", "number") !== undefined){
        //     SimVar.SetSimVarValue("L:TAKEOFF_TIME", "seconds", undefined);
        // }
    }

    _averageAirSpeed() {
        const airSpeed = SimVar.GetSimVarValue("AIRSPEED TRUE", "number");
        SimVar.SetSimVarValue("L:AVG_AIR_SPEED", "number", airSpeed);
    }

    // _groundDistance() {
    //     const lastPos
    //
    //     const groundSpeed = SimVar.GetSimVarValue("GPS GROUND SPEED", "number");
    //     let groundDistance = SimVar.GetSimVarValue("L:GROUND_DISTANCE", "number");
    //     groundDistance +=  groundSpeed;
    //     SimVar.SetSimVarValue("L:GROUND_DISTANCE", "number", groundDistance);
    // }
    //
    // _averageGroundSpeed() {
    //     const groundSpeed = SimVar.GetSimVarValue("GPS GROUND SPEED", "number");
    //     const groundDistance = SimVar.GetSimVarValue("L:GROUND_DISTANCE", "number");
    //
    //     const averageGroundSpeed = groundDistance / groundSpeed;
    //     let averageGroundDistance = SimVar.GetSimVarValue("L:GROUND_DISTANCE", "number");
    //
    //     s = d/t
    //     groundDistance +=  groundSpeed;
    //     SimVar.SetSimVarValue("L:GROUND_DISTANCE", "number", groundDistance);
    // }

}