class CJ4_FMC_PerfMenuPage {
    static ShowPage1(fmc) {
        fmc.clearDisplay();
        fmc.setTemplate([
            ["PERF MENU"],
            [""],
            ["<PERF INIT", "FUEL MGMT>"],
            [""],
            ["<VNAV SETUP", "FLT LOG>"],
            [""],
            [""],
            [""],
            [""],
            [""],
            [""],
            [""],
            [""]
        ]);
        fmc.onLeftInput[0] = () => { CJ4_FMC_PerfInitPage.ShowPage1(fmc); };
        fmc.onRightInput[1] = () => { CJ4_FMC_FlightLogPage.ShowPage1(fmc); };
        fmc.updateSideButtonActiveStatus();
    }
}
//# sourceMappingURL=CJ4_FMC_InitRefIndexPage.js.map