# CJ4 Extended
![image](https://user-images.githubusercontent.com/48885195/93709493-dae4c480-fb81-11ea-8fbc-919519f2bc1f.png)
## About
This project extends upon the features of the Citation CJ4 aircraft in Microsoft Flight Simulator 2020. **This project is currently being merged with fspackages for the best CJ4 experience. Charting will remain here for the time being**

**Current features**
- Air and heat knob animation functionality (Pilot, Copilot, and Cabin Fan, Cockpit and Cabin Temperature, Climate Control)
- Seatbelt lights and chime sounds
- Static airport charting functionality (first of its kind?)
- Flight log FMS page (Take-off time, time en-route, landing time, fuel used)
- FMS Perf Menu with `PERF` button functionality
- Fixed FMS styling bugs
- UTC clock and RAT functionality on MFD and PFD
- Significant fuel performance improvements

## Installation
Installation requires unzipping [CJ4-Extended.zip](https://github.com/J-Hoskin/CJ4-Extended/releases/tag/v1.0) and placing the `CJ4-Extended` folder into the `Community` folder of your MSFS2020 installation. The location of the `Community` folder depends on what platform you run MSFS2020 on. Potential directories include:

**Microsoft Store / Gamepass edition:**

`C:\Users\[USER]\AppData\Local\Packages\Microsoft.FlightSimulator_<RANDOMLETTERS>\LocalCache\Packages\Community`
  
**For the Steam edition:**

`C:\Users\[USER]\AppData\Roaming\Microsoft Flight Simulator\Packages\Community`

**For the Boxed edition:**

`C:\Users\[USER]\AppData\Local\MSFSPackages\Community`

## Setting up and Using Airport Charts
![image](https://user-images.githubusercontent.com/48885195/93709529-2d25e580-fb82-11ea-821e-ecb2a48a5e72.png)
![image](https://user-images.githubusercontent.com/48885195/93727376-40769680-fbfe-11ea-9bca-1caf3a6387c1.png)
This add-on adds the ability to load airport charts onto the MFD of the CJ4. This is an experimental implementation which allows you to see airport details and get directions without leaving the cockpit, adding to the flight immersion. There are some charts included for Melbourne and Hobart in Australia. You can load the flight plans in the `other/Chart Flight Plans` directory to try the feature before setting it up on your own.

### Sourcing Charts

As the feature uses PNG images for charts, you are free to source airport charts from any provider.

**Free and no signup**

Most of these resources are PDFs. To convert to PNGs, a tool such as [pdf2png](https://pdf2png.com/) can be used.
- Australia: [Air Services Australia](https://www.airservicesaustralia.com/aip/current/dap/AeroProcChartsTOC.htm) - Very high quality
- USA: [FAA](https://www.faa.gov/airports/runway_safety/diagrams/), [SkyVector](https://skyvector.com/)
- Germany [Vatsim Germany](https://vatsim-germany.org/pilots/aerodromes) - Other Vatsim communities have charts too
- World: [Opennav](https://opennav.com/airport/ZSPD) - Only some airports have charts attached
- Just aerodromes: [FSX charts](https://mutleyshangar.com/forum/index.php?/topic/23067-airport-diagram-download-center/#Queen) - Basic FSX charts

### Adding airports charts:
The following steps need to be followed closely in order for the add-on to work.

**Repeat for each airport:**
- Create a new folder with the exact ICAO name of the desired airport in the `html_ui/Pages/VCockpit/Instruments/Airliners/CJ4/MFD/Charts` folder
- Create the folders: `Arrivals`, `Airport`, `Deperature`, `Approach`, `Other`
- Drop your charts for the airport in the relevant folders. Images must be PNGs. The chart file name must be: `[ICAO]-[PAGE NUMBER]`. Example: `YPAD-1.png`. These page numbers allow you to easily navigate through multple charts in each chart folder. The `Other` folder can contain any charts such as apron charts.

Run the `build.py` python script to load all of the new charts into the addon's layout.json automatically. Now you can start up Microsoft Flight Simulator 2020 and enjoy flying off navigational charts.

### Using airport charts
- First set an origin and/or a destination in the FMS, or from the main flight menu.
- Press the `CHART` button in the lower control panel to open the chart display
- Press the `LWR MENU` button with the chart display open to open the Main Chart Index Menu. Here you can select the type of chart you wish to view. You can also switch the chart to dark mode by selecting `Chart Dimming`.
- Use the pan joystick next to the `CHART` button to scroll your chart.
- Use the outer turn knob to load the next chart ('page') in the relevant folder.

### Feature Notes
- Current chart implementation is done through static images, meaning they will not show your aircraft's position on them.
- MSFS2020 makes up the taxiways of airports, and as such, stock ATC directions are unlikely to correspond with your airport charts.
- The charting feature will not automatically load the chart for your set approach. You will have to navigate through the pages to it.
- If night mode makes elements hard to see on your chart, you can always dim the MFD when on day mode.

## Credits
Thanks goes to:
- [Soberat](https://www.nexusmods.com/microsoftflightsimulator/mods/225) for RAT code
- [Vaporized_Butter](https://www.nexusmods.com/microsoftflightsimulator/mods/8) for fuel improvements
- [dga711](https://github.com/dga711/devtools-backend-refurb) for devtools which kept me barely sane
- [FlyByWire Team](https://github.com/flybywiresim) for trailblazing addon development
