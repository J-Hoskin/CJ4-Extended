class CJ4_MFD extends BaseAirliners {
    constructor() {
        super();
        this.isExtended = false;
        this.showTerrain = false;
        this.showWeather = false;
        this.showFms = false;
        this.showChart = false;
        this.showGwx = false;
        this.mapDisplayMode = Jet_NDCompass_Display.ROSE;
        this.mapNavigationMode = Jet_NDCompass_Navigation.NAV;
        this.mapNavigationSource = 0;
        this.systemPage1 = CJ4_SystemPage.ENGINES;
        this.systemPage2 = CJ4_SystemPage.ELECTRICS;
        this.modeChangeTimer = -1;
        this.initDuration = 11000;
    }
    get templateID() { return "CJ4_MFD"; }
    get IsGlassCockpit() { return true; }
    connectedCallback() {
        super.connectedCallback();
        this.radioNav.init(NavMode.TWO_SLOTS);
        this.systems1 = new CJ4_SystemContainer("System1", "SystemInfos1");
        this.systems2 = new CJ4_SystemContainer("System2", "SystemInfos2");
        this.map = new CJ4_MapContainer("Map", "Map");
        this.mapOverlay = new CJ4_MapOverlayContainer("MapInfos", "MapOverlay");
        this.fms = new CJ4_FMSContainer("Fms", "FMSInfos");
        this.chart = new CJ4_ChartContainer("Chart", "Chart");
        this.navBar = new CJ4_NavBarContainer("Nav", "NavBar");
        this.popup = new CJ4_PopupMenuContainer("Menu", "PopupMenu");
        this.addIndependentElementContainer(this.systems1);
        this.addIndependentElementContainer(this.systems2);
        this.addIndependentElementContainer(this.map);
        this.addIndependentElementContainer(this.mapOverlay);
        this.addIndependentElementContainer(this.navBar);
        this.addIndependentElementContainer(this.fms);
        this.addIndependentElementContainer(this.chart);
        this.addIndependentElementContainer(this.popup);
        this.modeChangeMask = this.getChildById("ModeChangeMask");
        this.maxUpdateBudget = 12;
    }
    disconnectedCallback() {
    }
    Update() {
        super.Update();
        if (this.allContainersReady()) {
            SimVar.SetSimVarValue("L:Glasscockpit_MFD_Started", "number", this.isStarted ? 1 : 0);
            if (this.modeChangeMask && this.modeChangeTimer >= 0) {
                this.modeChangeTimer -= this.deltaTime / 1000;
                if (this.modeChangeTimer <= 0) {
                    this.modeChangeMask.style.display = "none";
                    this.modeChangeTimer = -1;
                }
            }
            let dict = this.popup.dictionary;
            if (dict.changed) {
                this.readDictionary(dict);
                dict.changed = false;
            }
            if (this.showGwx)
                this.showWeather = false;
            if (this.showGwx) {
                this.map.showGwx(true);
                this.mapOverlay.showGwx(true);
            }
            else {
                this.map.setMode(this.mapDisplayMode);
                this.mapOverlay.setMode(this.mapDisplayMode, this.mapNavigationMode, this.mapNavigationSource);
                if (this.showTerrain) {
                    this.map.showTerrain(true);
                    this.mapOverlay.showTerrain(true);
                }
                else if (this.showWeather) {
                    this.map.showWeather(true);
                    this.mapOverlay.showWeather(true);
                }
                else {
                    this.map.showTerrain(false);
                    this.mapOverlay.showTerrain(false);
                    this.map.showWeather(false);
                    this.mapOverlay.showWeather(false);
                    this.map.showGwx(false);
                    this.mapOverlay.showGwx(false);
                }
            }
            if (this.showFms) {
                this.systems1.minimize(true);
                this.systems2.show(CJ4_SystemPage.NONE);
                this.fms.show(true);
                this.chart.show(false);
            }
            else if (this.showChart) {
                this.systems1.minimize(true);
                this.systems2.show(CJ4_SystemPage.NONE);
                this.fms.show(false);
                this.chart.show(true);
            }
            else {
                this.fms.show(false);
                this.chart.show(false);
                this.systems1.show(this.systemPage1);
                if (this.systemPage1 == CJ4_SystemPage.ENGINES) {
                    if (this.isExtended && !this.systems2.hasAnnunciations()) {
                        this.map.setExtended(true);
                        this.mapOverlay.setExtended(true);
                        this.systems1.minimize(false);
                        this.systems2.show(CJ4_SystemPage.NONE);
                    }
                    else {
                        this.map.setExtended(false);
                        this.mapOverlay.setExtended(false);
                        if (this.systems2.hasAnnunciations()) {
                            this.systems1.minimize(true);
                            this.systems2.show(CJ4_SystemPage.ANNUNCIATIONS);
                        }
                        else {
                            this.systems1.minimize((this.systemPage2 != CJ4_SystemPage.NONE) ? true : false);
                            this.systems2.show(this.systemPage2);
                        }
                    }
                }
                else {
                    this.systems1.minimize(true);
                    if (this.isExtended) {
                        this.map.setExtended(true);
                        this.mapOverlay.setExtended(true);
                        this.systems2.show(CJ4_SystemPage.NONE);
                    }
                    else {
                        this.map.setExtended(false);
                        this.mapOverlay.setExtended(false);
                        this.systems2.show(this.systemPage2);
                    }
                }
            }
            this.mapOverlay.setRange(this.map.range);
        }
    }
    onEvent(_event) {
        console.log(_event);
        switch (_event) {
            case "Lwr_Push_TERR_WX":
                if (this.showTerrain) {
                    this.showTerrain = false;
                    this.showWeather = true;
                }
                else if (this.showWeather) {
                    this.showTerrain = false;
                    this.showWeather = false;
                }
                else {
                    this.showTerrain = true;
                    this.showWeather = false;
                }
                this.onModeChanged();
                break;
            case "Lwr_Push_TFC":
                this.map.toggleSymbol(CJ4_MapSymbol.TRAFFIC);
                break;
            case "Lwr_Push_SYS":
                this.isExtended = !this.isExtended;
                break;
            case "Lwr_Push_CHART":
                this.showChart = !this.showChart;
                this.popup.setMode(CJ4_PopupMenu.NONE)
                break;
            case "Lwr_Push_ENG":
                this.systemPage1 = (this.systemPage1 == CJ4_SystemPage.ENGINES) ? CJ4_SystemPage.ANNUNCIATIONS : CJ4_SystemPage.ENGINES;
                break;
            case "Lwr_Push_UPR_MENU":
                this.fillDictionary(this.popup.dictionary);
                this.popup.setMode(CJ4_PopupMenu.UPPER);
                break;
            case "Lwr_Push_LWR_MENU":
                this.fillDictionary(this.popup.dictionary);
                if(this.showChart){
                    this.popup.setMode(CJ4_PopupMenu.LOWER_CHART);
                }
                else{
                    this.popup.setMode(CJ4_PopupMenu.LOWER);
                }
                break;
            case "Lwr_JOYSTICK_DOWN":
                if(this.showChart){
                    const currentScrollPosition = SimVar.GetSimVarValue("L:CHART_SCROLL_POSITION", "number");
                    if(currentScrollPosition > -350){
                        SimVar.SetSimVarValue("L:CHART_SCROLL_POSITION", "number", currentScrollPosition - 10);
                    }
                }
                break;
            case "Lwr_JOYSTICK_UP":
                if(this.showChart){
                    const currentScrollPosition = SimVar.GetSimVarValue("L:CHART_SCROLL_POSITION", "number");
                    if(currentScrollPosition < 0){
                        SimVar.SetSimVarValue("L:CHART_SCROLL_POSITION", "number", currentScrollPosition + 10);
                    }
                }
                break;
            case "Lwr_DATA_INC":
                // Prevent page scrolling when main chart index menu is open
                if(this.showChart && this.popup.mode != CJ4_PopupMenu.LOWER_CHART){
                    const currentChartPage = SimVar.GetSimVarValue("L:CHART_PAGE", "number");
                    // 10 is an arbitrary page limit
                    if(currentChartPage < 10){
                        SimVar.SetSimVarValue("L:CHART_PAGE", "number", currentChartPage + 1);
                    }
                }
                break;
            case "Lwr_DATA_DEC":
                // Prevent page scrolling when main chart index menu is open
                if(this.showChart && this.popup.mode != CJ4_PopupMenu.LOWER_CHART){
                    const currentChartPage = SimVar.GetSimVarValue("L:CHART_PAGE", "number");
                    if(currentChartPage > 1){
                        SimVar.SetSimVarValue("L:CHART_PAGE", "number", currentChartPage - 1);
                    }
                }
                break;
        }
    }
    allContainersReady() {
        for (var i = 0; i < this.IndependentsElements.length; i++) {
            if (!this.IndependentsElements[i].isInitialized) {
                return false;
            }
        }
        return true;
    }
    onModeChanged() {
        if (this.modeChangeMask) {
            this.modeChangeMask.style.display = "block";
            this.modeChangeTimer = 0.15;
        }
    }
    readDictionary(_dict) {
        let modeChanged = false;
        let format = _dict.get(CJ4_PopupMenu_Key.MAP_FORMAT);
        if (format == "ROSE") {
            if (this.mapDisplayMode != Jet_NDCompass_Display.ROSE) {
                this.mapDisplayMode = Jet_NDCompass_Display.ROSE;
                modeChanged = true;
            }
        }
        else if (format == "ARC" || format == "PPOS" || format == "TCAS") {
            if (this.mapDisplayMode != Jet_NDCompass_Display.ARC) {
                this.mapDisplayMode = Jet_NDCompass_Display.ARC;
                modeChanged = true;
            }
        }
        else if (format == "PLAN") {
            if (this.mapDisplayMode != Jet_NDCompass_Display.PLAN) {
                this.mapDisplayMode = Jet_NDCompass_Display.PLAN;
                modeChanged = true;
                modeChanged = true;
            }
        }
        let navSrc = _dict.get(CJ4_PopupMenu_Key.NAV_SRC);
        if (navSrc == "FMS1") {
            if (this.mapNavigationMode != Jet_NDCompass_Navigation.NAV) {
                this.mapNavigationMode = Jet_NDCompass_Navigation.NAV;
                this.mapNavigationSource = 0;
                modeChanged = true;
            }
        }
        else if (navSrc == "VOR1") {
            if (this.mapNavigationMode != Jet_NDCompass_Navigation.VOR || this.mapNavigationSource != 1) {
                this.mapNavigationMode = Jet_NDCompass_Navigation.VOR;
                this.mapNavigationSource = 1;
                modeChanged = true;
            }
        }
        else if (navSrc == "VOR2") {
            if (this.mapNavigationMode != Jet_NDCompass_Navigation.VOR || this.mapNavigationSource != 2) {
                this.mapNavigationMode = Jet_NDCompass_Navigation.VOR;
                this.mapNavigationSource = 2;
                modeChanged = true;
            }
        }
        this.map.setSymbol(CJ4_MapSymbol.AIRPORTS, (_dict.get(CJ4_PopupMenu_Key.MAP_SYMBOL_AIRPORTS) == "ON") ? true : false);
        this.map.setSymbol(CJ4_MapSymbol.CONSTRAINTS, (_dict.get(CJ4_PopupMenu_Key.MAP_SYMBOL_CONSTRAINTS) == "ON") ? true : false);
        this.map.setSymbol(CJ4_MapSymbol.INTERSECTS, (_dict.get(CJ4_PopupMenu_Key.MAP_SYMBOL_INTERSECTS) == "ON") ? true : false);
        this.map.setSymbol(CJ4_MapSymbol.AIRWAYS, (_dict.get(CJ4_PopupMenu_Key.MAP_SYMBOL_AIRWAYS) == "ON") ? true : false);
        this.map.setSymbol(CJ4_MapSymbol.AIRSPACES, (_dict.get(CJ4_PopupMenu_Key.MAP_SYMBOL_AIRSPACES) == "ON") ? true : false);
        this.map.setSymbol(CJ4_MapSymbol.NAVAIDS, (_dict.get(CJ4_PopupMenu_Key.MAP_SYMBOL_NAVAIDS) == "ON") ? true : false);

        // Uses a space for ORIGIN chart menu names for easy implementation
        let chartSelection = _dict.get(CJ4_PopupMenu_Key.CHART_SELECTED);
        if (chartSelection === "AIRPORT ") {
            SimVar.SetSimVarValue("L:SELECTED_AIRPORT_CHART", "number", 1);
            modeChanged = true;
        }
        else if (chartSelection === "DEPARTURE ") {
            SimVar.SetSimVarValue("L:SELECTED_AIRPORT_CHART", "number", 2);
            modeChanged = true;
        }
        else if (chartSelection === "ARRIVAL ") {
            SimVar.SetSimVarValue("L:SELECTED_AIRPORT_CHART", "number", 3);
            modeChanged = true;
        }
        else if (chartSelection === "APPROACH ") {
            SimVar.SetSimVarValue("L:SELECTED_AIRPORT_CHART", "number", 4);
            modeChanged = true;
        }
        else if (chartSelection === "ANY CHART ") {
            SimVar.SetSimVarValue("L:SELECTED_AIRPORT_CHART", "number", 5);
            modeChanged = true;
        }
        else if (chartSelection === "ARRIVAL") {
            SimVar.SetSimVarValue("L:SELECTED_AIRPORT_CHART", "number", 6);
            modeChanged = true;
        }
        else if (chartSelection === "APPROACH") {
            SimVar.SetSimVarValue("L:SELECTED_AIRPORT_CHART", "number", 7);
            modeChanged = true;
        }
        else if (chartSelection === "AIRPORT") {
            SimVar.SetSimVarValue("L:SELECTED_AIRPORT_CHART", "number", 8);
            modeChanged = true;
        }
        else if (chartSelection === "DEPARTURE") {
            SimVar.SetSimVarValue("L:SELECTED_AIRPORT_CHART", "number", 9);
            modeChanged = true;
        }
        else if (chartSelection === "ANY CHART") {
            SimVar.SetSimVarValue("L:SELECTED_AIRPORT_CHART", "number", 10);
            modeChanged = true;
        }

        let sysMode = _dict.get(CJ4_PopupMenu_Key.SYS_SRC);
        if (sysMode == "OFF") {
            this.isExtended = true;
            this.showFms = false;
            this.showChart = false;
        }
        else if (sysMode == "FMS TEXT") {
            this.isExtended = false;
            this.showFms = true;
            this.showChart = false;
        }
        else if (sysMode == "CHART") {
            this.isExtended = false;
            this.showFms = false;
            this.showChart = true;
        }
        else if (sysMode == "SYSTEMS") {
            this.isExtended = false;
            this.showFms = false;
            this.showChart = false;
        }
        if (modeChanged)
            this.onModeChanged();
    }
    fillDictionary(_dict) {
        if (this.mapDisplayMode == Jet_NDCompass_Display.ROSE)
            _dict.set(CJ4_PopupMenu_Key.MAP_FORMAT, "ROSE");
        else if (this.mapDisplayMode == Jet_NDCompass_Display.ARC)
            _dict.set(CJ4_PopupMenu_Key.MAP_FORMAT, "ARC");
        else if (this.mapDisplayMode == Jet_NDCompass_Display.PLAN)
            _dict.set(CJ4_PopupMenu_Key.MAP_FORMAT, "PLAN");
        if (this.mapNavigationMode == Jet_NDCompass_Navigation.VOR && this.mapNavigationSource == 1)
            _dict.set(CJ4_PopupMenu_Key.NAV_SRC, "VOR1");
        else if (this.mapNavigationMode == Jet_NDCompass_Navigation.VOR && this.mapNavigationSource == 2)
            _dict.set(CJ4_PopupMenu_Key.NAV_SRC, "VOR2");
        else if (this.mapNavigationMode == Jet_NDCompass_Navigation.NAV)
            _dict.set(CJ4_PopupMenu_Key.NAV_SRC, "FMS1");

        _dict.set(CJ4_PopupMenu_Key.MAP_SYMBOL_AIRPORTS, (this.map.hasSymbol(CJ4_MapSymbol.AIRPORTS)) ? "ON" : "OFF");
        _dict.set(CJ4_PopupMenu_Key.MAP_SYMBOL_CONSTRAINTS, (this.map.hasSymbol(CJ4_MapSymbol.CONSTRAINTS)) ? "ON" : "OFF");
        _dict.set(CJ4_PopupMenu_Key.MAP_SYMBOL_INTERSECTS, (this.map.hasSymbol(CJ4_MapSymbol.INTERSECTS)) ? "ON" : "OFF");
        _dict.set(CJ4_PopupMenu_Key.MAP_SYMBOL_AIRWAYS, (this.map.hasSymbol(CJ4_MapSymbol.AIRWAYS)) ? "ON" : "OFF");
        _dict.set(CJ4_PopupMenu_Key.MAP_SYMBOL_AIRSPACES, (this.map.hasSymbol(CJ4_MapSymbol.AIRSPACES)) ? "ON" : "OFF");
        _dict.set(CJ4_PopupMenu_Key.MAP_SYMBOL_NAVAIDS, (this.map.hasSymbol(CJ4_MapSymbol.NAVAIDS)) ? "ON" : "OFF");
        if (this.isExtended)
            _dict.set(CJ4_PopupMenu_Key.SYS_SRC, "OFF");
        else if (this.showFms)
            _dict.set(CJ4_PopupMenu_Key.SYS_SRC, "FMS TEXT");
        else if (this.showChart)
            _dict.set(CJ4_PopupMenu_Key.SYS_SRC, "CHART");
        else
            _dict.set(CJ4_PopupMenu_Key.SYS_SRC, "SYSTEMS");
    }
}
class CJ4_FMSContainer extends NavSystemElementContainer {
    constructor(_name, _root) {
        super(_name, _root, null);
        this.isVisible = undefined;
        this._k = 0;
    }
    static secondsTohhmm(seconds) {
        let h = Math.floor(seconds / 3600);
        seconds -= h * 3600;
        let m = Math.ceil(seconds / 60);
        return h.toFixed(0) + ":" + m.toFixed(0).padStart(2, "0");
    }
    init() {
        super.init();
        this.root = this.gps.getChildById(this.htmlElemId);
        if (!this.root) {
            console.log("Root component expected!");
        }
        else {
            let waypointContainers = this.root.querySelectorAll(".cj4x-navigation-data-flightplan-leg");
            this._previousWaypointContainer = waypointContainers[0];
            this._activeWaypointContainer = waypointContainers[1];
            this._nextWaypointContainer = waypointContainers[2];
        }
    }
    show(_value) {
        if (this.isVisible != _value) {
            this.isVisible = _value;
            this.root.setAttribute("visible", (_value) ? "true" : "false");
        }
    }
    onUpdate(_deltaTime) {
        super.onUpdate(_deltaTime);
        if (!this._previousWaypointContainer || !this._activeWaypointContainer || !this._nextWaypointContainer) {
            if (!this.isInitialized) {
                this.init();
            }
            return;
        }
        let flightPlanManager = this.gps.currFlightPlanManager;
        if (flightPlanManager) {
            this._k++;
            if (this._k > 60) {
                flightPlanManager.updateFlightPlan();
                this._k = 0;
            }
            let origin = flightPlanManager.getOrigin();
            let destination = flightPlanManager.getDestination();
            this.root.querySelector(".cj4x-navigation-data-flightplan-name")
                .textContent = (origin ? origin.ident : "---") + " to " + (destination ? destination.ident : "---");
            if (destination) {
                let eteValue = "---";
                if (isFinite(destination.cumulativeEstimatedTimeEnRouteFP)) {
                    eteValue = CJ4_FMSContainer.secondsTohhmm(destination.cumulativeEstimatedTimeEnRouteFP);
                }
                this.root.querySelector(".cj4x-navigation-data-page-foot")
                    .querySelector(".cj4x-navigation-data-flight-plan-ete-dest")
                    .querySelector(".cj4x-navigation-data-flight-plan-value")
                    .textContent = eteValue;
                let distTogoValue = "0";
                if (isFinite(destination.cumulativeDistanceInFP)) {
                    distTogoValue = destination.cumulativeDistanceInFP.toFixed(0) + " NM";
                }
                this.root.querySelector(".cj4x-navigation-data-page-foot")
                    .querySelector(".cj4x-navigation-data-flight-plan-dist-togo")
                    .querySelector(".cj4x-navigation-data-flight-plan-value")
                    .textContent = distTogoValue;
            }
            let previousWaypointIndex = flightPlanManager.getActiveWaypointIndex() - 1;
            let previousWaypoint = flightPlanManager.getWaypoint(previousWaypointIndex);
            if (previousWaypoint) {
                this._previousWaypointContainer.style.display = "block";
                this._previousWaypointContainer.querySelector(".cj4x-navigation-data-waypoint-ident").textContent = previousWaypoint.ident;
                this._previousWaypointContainer.querySelector(".cj4x-navigation-data-waypoint-coordinates").textContent = previousWaypoint.infos.coordinates.toDegreeString();
                let ataValue = "---";
                if (isFinite(previousWaypoint.estimatedTimeEnRouteFP)) {
                    ataValue = CJ4_FMSContainer.secondsTohhmm(previousWaypoint.estimatedTimeOfArrivalFP);
                }
                this._previousWaypointContainer
                    .querySelector(".cj4x-navigation-data-waypoint-ata")
                    .querySelector(".cj4x-navigation-data-waypoint-value")
                    .textContent = ataValue;
                this._previousWaypointContainer
                    .querySelector(".cj4x-navigation-data-waypoint-dist")
                    .querySelector(".cj4x-navigation-data-waypoint-value")
                    .textContent = previousWaypoint.distanceInFP.toFixed(1) + " NM";
            }
            else {
                this._previousWaypointContainer.style.display = "none";
            }
            let activeWaypoint = flightPlanManager.getActiveWaypoint();
            if (activeWaypoint) {
                this._activeWaypointContainer.style.display = "block";
                this._activeWaypointContainer.querySelector(".cj4x-navigation-data-waypoint-ident").textContent = activeWaypoint.ident;
                this._activeWaypointContainer.querySelector(".cj4x-navigation-data-waypoint-coordinates").textContent = activeWaypoint.infos.coordinates.toDegreeString();
                let etaValue = "---";
                if (isFinite(activeWaypoint.estimatedTimeEnRouteFP)) {
                    etaValue = CJ4_FMSContainer.secondsTohhmm(activeWaypoint.estimatedTimeOfArrivalFP);
                }
                let legtValue = "---";
                if (isFinite(activeWaypoint.estimatedTimeEnRouteFP)) {
                    legtValue = CJ4_FMSContainer.secondsTohhmm(activeWaypoint.estimatedTimeEnRouteFP);
                }
                this._activeWaypointContainer
                    .querySelector(".cj4x-navigation-data-waypoint-eta")
                    .querySelector(".cj4x-navigation-data-waypoint-value")
                    .textContent = etaValue;
                this._activeWaypointContainer
                    .querySelector(".cj4x-navigation-data-waypoint-legt")
                    .querySelector(".cj4x-navigation-data-waypoint-value")
                    .textContent = legtValue;
                this._activeWaypointContainer
                    .querySelector(".cj4x-navigation-data-waypoint-dist")
                    .querySelector(".cj4x-navigation-data-waypoint-value")
                    .textContent = activeWaypoint.distanceInFP.toFixed(1) + " NM";
                this._activeWaypointContainer
                    .querySelector(".cj4x-navigation-data-waypoint-crs")
                    .querySelector(".cj4x-navigation-data-waypoint-value")
                    .textContent = activeWaypoint.bearingInFP.toFixed(1) + " °";
            }
            else {
                this._activeWaypointContainer.style.display = "none";
            }
            let nextWaypointIndex = flightPlanManager.getActiveWaypointIndex() + 1;
            let nextWaypoint = flightPlanManager.getWaypoint(nextWaypointIndex);
            if (nextWaypoint && activeWaypoint) {
                this._nextWaypointContainer.style.display = "block";
                this._nextWaypointContainer.querySelector(".cj4x-navigation-data-waypoint-ident").textContent = nextWaypoint.ident;
                this._nextWaypointContainer.querySelector(".cj4x-navigation-data-waypoint-coordinates").textContent = nextWaypoint.infos.coordinates.toDegreeString();
                let etaValue = "---";
                if (isFinite(activeWaypoint.estimatedTimeEnRouteFP)) {
                    etaValue = CJ4_FMSContainer.secondsTohhmm(nextWaypoint.estimatedTimeOfArrivalFP);
                }
                let legtValue = "---";
                if (isFinite(activeWaypoint.estimatedTimeEnRouteFP)) {
                    legtValue = CJ4_FMSContainer.secondsTohhmm(nextWaypoint.estimatedTimeEnRouteFP);
                }
                this._nextWaypointContainer
                    .querySelector(".cj4x-navigation-data-waypoint-eta")
                    .querySelector(".cj4x-navigation-data-waypoint-value")
                    .textContent = etaValue;
                this._nextWaypointContainer
                    .querySelector(".cj4x-navigation-data-waypoint-legt")
                    .querySelector(".cj4x-navigation-data-waypoint-value")
                    .textContent = legtValue;
                this._nextWaypointContainer
                    .querySelector(".cj4x-navigation-data-waypoint-dist")
                    .querySelector(".cj4x-navigation-data-waypoint-value")
                    .textContent = nextWaypoint.distanceInFP.toFixed(1) + " NM";
                this._nextWaypointContainer
                    .querySelector(".cj4x-navigation-data-waypoint-crs")
                    .querySelector(".cj4x-navigation-data-waypoint-value")
                    .textContent = nextWaypoint.bearingInFP.toFixed(1) + " °";
            }
            else {
                this._nextWaypointContainer.style.display = "none";
            }
        }
    }
    
}
class CJ4_ChartContainer extends NavSystemElementContainer {
    constructor(_name, _root) {
        super(_name, _root, null);
        this.isVisible = false;
    }
    init() {
        super.init();
        this.root = this.gps.getChildById(this.htmlElemId);
        if (!this.root) {
            console.log("Root component expected!");
            return;
        }
        this.root.setAttribute("visible", "false");
    }
    show(_value) {
        if (this.isVisible != _value) {
            this.isVisible = _value;
            this.root.setAttribute("visible", (_value) ? "true" : "false");
        }
    }
    onUpdate(_deltaTime) {
        super.onUpdate(_deltaTime);
        if (!this.isInitialized) {
            this.init();
            return;
        }

        const chartTypeSelected = SimVar.GetSimVarValue("L:SELECTED_AIRPORT_CHART", "number");
        const baseChartPath = "/Pages/VCockpit/Instruments/Airliners/CJ4/MFD/Charts";
        const chartPage = SimVar.GetSimVarValue("L:CHART_PAGE", "number");
        const airportName = this.getSelectedAirportICAO(chartTypeSelected);
        const chartFolder = this.getChartFolder(chartTypeSelected);
        const chartImagePath = baseChartPath + "/" + airportName + "/" + chartFolder + "/" + airportName + "-" + chartPage + ".png";

        // Manage scrolling
        const scrollPosition = SimVar.GetSimVarValue("L:CHART_SCROLL_POSITION", "number");
        let dimmingClass = "day";
        if(SimVar.GetSimVarValue("L:CHART_DIMMING", "number") == 2){
            dimmingClass = "night";
        }

        if(airportName != ""){
            this.root.querySelector(".airportChart")
                .setAttribute('style', "background-image: url('" + chartImagePath + "'); background-position-y:" + scrollPosition + 'px;"');

            this.root.querySelector(".chartName").textContent = airportName + " " + chartPage;
            this.root.querySelector(".chartType").textContent = chartFolder;
            this.root.querySelector(".airportChart")
                .setAttribute('class', 'airportChart' + ' ' + dimmingClass);
        }
        else{
            this.root.querySelector(".chartName").textContent = "No airport selected";
            this.root.querySelector(".chartType").textContent = "";
        }

    }
    getSelectedAirportICAO(_chartTypeSelected) {
        // Get airport ICAO
        const flightPlanManager = this.gps.currFlightPlanManager;
        if (_chartTypeSelected == 1 || _chartTypeSelected == 2 || _chartTypeSelected == 3 || _chartTypeSelected == 4 || _chartTypeSelected == 5) {
            let origin = flightPlanManager.getOrigin();
            if (origin) {
                return origin.ident;
            }
        } else if (_chartTypeSelected == 6 || _chartTypeSelected == 7 || _chartTypeSelected == 8 || _chartTypeSelected == 9 || _chartTypeSelected == 10) {
            let destination = flightPlanManager.getDestination();
            if (destination) {
                return destination.ident;
            }
        }
        return "";
    }
    getChartFolder(_chartTypeSelected){
        // Folder info
        let folder = "Aerodrome";
        if(_chartTypeSelected == 1 || _chartTypeSelected == 8){
            folder = "Aerodrome";
        }
        else if(_chartTypeSelected == 2 || _chartTypeSelected == 9){
            folder = "Departure";
        }
        else if(_chartTypeSelected == 3 || _chartTypeSelected == 6){
            folder = "Arrival";
        }
        else if(_chartTypeSelected == 4 || _chartTypeSelected == 7){
            folder = "Approach";
        }
        else if(_chartTypeSelected == 5 || _chartTypeSelected == 10){
            folder = "Other";
        }
        return folder;
    }

}
registerInstrument("cj4-mfd-element", CJ4_MFD);
//# sourceMappingURL=CJ4_MFD.js.map