class CJ4_FMC_TakeOffRefPage {
    static ShowPage1(fmc) {
        fmc.clearDisplay();
        let v1 = "---[color]blue";
        if (fmc.v1Speed) {
            v1 = fmc.v1Speed + "KT[color]blue";
        }
        fmc.onRightInput[0] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            if (value === FMCMainDisplay.clrValue) {
                fmc.v1Speed = undefined;
                SimVar.SetSimVarValue("L:AIRLINER_V1_SPEED", "Knots", -1);
                CJ4_FMC_TakeOffRefPage.ShowPage1(fmc);
            }
            else if (value === "") {
                fmc._computeV1Speed();
                CJ4_FMC_TakeOffRefPage.ShowPage1(fmc);
            }
            else {
                if (fmc.trySetV1Speed(value)) {
                    CJ4_FMC_TakeOffRefPage.ShowPage1(fmc);
                }
            }
        };
        let vR = "---[color]blue";
        if (fmc.vRSpeed) {
            vR = fmc.vRSpeed + "KT[color]blue";
        }
        fmc.onRightInput[1] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            if (value === FMCMainDisplay.clrValue) {
                fmc.vRSpeed = undefined;
                SimVar.SetSimVarValue("L:AIRLINER_VR_SPEED", "Knots", -1);
                CJ4_FMC_TakeOffRefPage.ShowPage1(fmc);
            }
            else if (value === "") {
                fmc._computeVRSpeed();
                CJ4_FMC_TakeOffRefPage.ShowPage1(fmc);
            }
            else {
                if (fmc.trySetVRSpeed(value)) {
                    CJ4_FMC_TakeOffRefPage.ShowPage1(fmc);
                }
            }
        };
        let v2 = "---[color]blue";
        if (fmc.v2Speed) {
            v2 = fmc.v2Speed + "KT[color]blue";
        }
        fmc.onRightInput[2] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            if (value === FMCMainDisplay.clrValue) {
                fmc.v2Speed = undefined;
                SimVar.SetSimVarValue("L:AIRLINER_V2_SPEED", "Knots", -1);
                CJ4_FMC_TakeOffRefPage.ShowPage1(fmc);
            }
            else if (value === "") {
                fmc._computeV2Speed();
                CJ4_FMC_TakeOffRefPage.ShowPage1(fmc);
            }
            else {
                if (fmc.trySetV2Speed(value)) {
                    CJ4_FMC_TakeOffRefPage.ShowPage1(fmc);
                }
            }
        };
        let flapsCell = "---";
        if (isFinite(fmc.flapTakeOffDegree)) {
            flapsCell = fmc.flapTakeOffDegree.toFixed(0) + "°[color]blue";
        }
        fmc.onLeftInput[0] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            if (fmc.setFlapTakeOffDegree(value)) {
                CJ4_FMC_TakeOffRefPage.ShowPage1(fmc);
            }
        };
        let thrRedCell = "";
        if (isFinite(fmc.thrustReductionAltitude)) {
            thrRedCell = fmc.thrustReductionAltitude.toFixed(0);
        }
        else {
            thrRedCell = "---";
        }
        thrRedCell += "FT[color]blue";
        fmc.onLeftInput[2] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            if (fmc.trySetThrustReductionAccelerationAltitude(value)) {
                CJ4_FMC_InitRefIndexPage.ShowPage1(fmc);
            }
        };
        let runwayCell = "---";
        let selectedRunway = fmc.flightPlanManager.getDepartureRunway();
        if (selectedRunway) {
            runwayCell = "RW " + Avionics.Utils.formatRunway(selectedRunway.designation);
        }
        fmc.setTemplate([
            ["TAKE OFF"],
            ["FLAPS", "V1"],
            [flapsCell, v1],
            ["E/O ACCEL HT", "VR"],
            ["000FT", vR],
            ["THR REDUCTION", "V2"],
            [thrRedCell, v2],
            ["WIND/SLOPE", "CG", "TRIM"],
            ["H00/U0.0"],
            ["RW COND", "POS"],
            ["DRY", runwayCell],
            ["__FMCSEPARATOR"],
            ["<INDEX", "THRUST LIM>"]
        ]);
        fmc.onLeftInput[5] = () => { CJ4_FMC_InitRefIndexPage.ShowPage1(fmc); };
        fmc.onRightInput[5] = () => { CJ4_FMC_ThrustLimPage.ShowPage1(fmc); };
    }
}
//# sourceMappingURL=CJ4_FMC_TakeOffRefPage.js.map