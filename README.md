# CJ4 Extended
![image](https://user-images.githubusercontent.com/48885195/92542021-fe0e9a80-f28a-11ea-961f-ebb8e8b5ef0e.png)
## About
This project extends upon the features of the Citation CJ4 aircraft in Microsoft Flight Simulator 2020. Access to technical documentation around the systems in the CJ4 are unfortunately restricted, and as such, the features added in add-on are not perfectly accurate. Instead, the focus is on fleshing out the flight experience.

**Current features**
- Air and heat knob animation functionality (Pilot, Copilot, and Cabin Fan, Cockpit and Cabin Temperature, Climate Control)
- Seatbelt lights and annucations
- Static airport charting functionality (first of its kind?)
- More realistic fuel consumption
- Nearest airports FMS
- Flight log FMS page (Take-off time, en-route time, esitmated landing time, used fuel)
- Fixed FMS styling bugs
- UTC clock functionality on MFD and PFD

If you have knowledge around the systems in the CJ4 and would like to contribute, please contact me on Discord at Hosky#6451. If you would like to contribute to development, feel free to submit a pull request. A list of features can be found in the 'Issues' tab.

**Useful Links**
- [Planned Features](https://github.com/J-Hoskin/CJ4-Extended/issues)
- [Releases](https://github.com/J-Hoskin/CJ4-Extended/releases)

## Installation
Installation requires that you place the "CJ4-Extended" folder into the "Community" folder of your MSFS2020 installation. The location of the "Community" folder depends on what platform you run MSFS2020 on.

**Microsoft Store / Gamepass edition:**
- C:\Users\[USER]\AppData\Local\Packages\Microsoft.FlightSimulator_<RANDOMLETTERS>\LocalCache\Packages\Community
  
**For the Steam edition:**
- C:\Users\[USER]\AppData\Roaming\Microsoft Flight Simulator\Packages\Community

**For the Boxed edition:**
- C:\Users\[USER]\AppData\Local\MSFSPackages\Community

## Setting up and Using Airport Charts
![image](https://user-images.githubusercontent.com/48885195/93568759-f7db9500-f9d3-11ea-8800-b051b0641765.png)
This add-on adds the ability to load airport charts onto the MFD of the CJ4. This is a very simple experimental implementation which allows you to see airport details and get directions without leaving the cockpit, adding to the flight immersion.

### Sourcing Charts

As the feature uses PNG images, you are free to source airport charts from any provider.

**Free and no signup**

- Australia: [Air Services Australia](https://www.airservicesaustralia.com/aip/current/dap/AeroProcChartsTOC.htm) - Very high quality
- USA: [FAA](https://www.faa.gov/airports/runway_safety/diagrams/), [SkyVector]()
- Germany []
- World: [Opennav](https://opennav.com/airport/ZSPD) - Only some airports have charts attached
- Just aerodromes: [FSX charts](https://mutleyshangar.com/forum/index.php?/topic/23067-airport-diagram-download-center/#Queen)

### Adding airports charts must be done in the following way:

- Create a folder in the /Charts folder with the exact ICAO name of airport
- Create the folders Arrivals, Airport, Deperature, Approach
- Drop your charts for the airport in the relevant folder. Images must be PNGs
- Add to .layout file the path of the images you just added (if this charting feature is liked, this will be automated in future)

### Using airport charts
- First set an origin and/or a destination in the FMS
- Press the chart button in the lower control panel to oepn the chart display
- Press the LWR MENU button with chart display open to open the main chart index menu. Here you can select the chart you wish to view. You can also switch to chart to dark mode
- Use the pan joystick next to the chart button to scroll your chart.
- Use the turn knob to load next chart ('page') in the relevant folder.

### Feature Notes
- Current chart implementation is done through static images, meaning they will not show your aircraft's position on them.
- MSFS2020 makes up the taxiways of airports, and as such, stock ATC directions are unlikely to correspond with your airport charts.
- The following instructions have to be followed exactly for the feature to work.




