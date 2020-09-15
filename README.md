# CJ4 Extended
![image](https://user-images.githubusercontent.com/48885195/92542021-fe0e9a80-f28a-11ea-961f-ebb8e8b5ef0e.png)
## About
This project extends upon the features of the Citation CJ4 aircraft in Microsoft Flight Simulator 2020. Access to technical documentation around the systems in the CJ4 are unfortunately restricted, and as such, the features added in add-on are not perfectly accurate. Instead, the focus is on fleshing out the flight experience.

**Current features**
- Air and heat knob functionality (Pilot and Copilot, x, x, x, x, x) - Just animations
- Seatbelt lights and annucations
- Static airport navigational charts (first of its kind?)
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
This add-on adds the ability to load airport charts onto the MFD of the CJ4. This is helpful for getting an idea of what an airport looks like and planning your flight accordingly.

**Sourcing Charts**
As the feature uses simple images, there are many providers of airport charts you can use. Many require a subscription or at least for you to sign up. Some free providers of high quality charts are:

- Simple airport charts made for FSX :https://mutleyshangar.com/forum/index.php?/topic/23067-airport-diagram-download-center/#Queen
- Australia: [Air Services Australia](https://www.airservicesaustralia.com/aip/current/dap/AeroProcChartsTOC.htm)
- USA: [FAA](https://www.faa.gov/airports/runway_safety/diagrams/)
- World: [Opennav](https://opennav.com/airport/ZSPD)

**Adding airports charts must be done in the following way:
- Create a folder in the /charts folder with the exact ICAO name of airport
- Create folders Arrivals, Airport, Deperature, Approach
- Drop your images in each named accoringly. Images must be pngs
- Add to layout file

**Please Note**
- Current chart implementation is done through static images, meaning they will not show your aircraft's position on them.
- MSFS2020 makes up the taxiways of airports, and as such, stock ATC directions are unlikely to correspond with your airport charts.
- The following instructions have to be followed exactly for the feature to work.




