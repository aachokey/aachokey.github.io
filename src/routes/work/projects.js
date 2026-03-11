export const projects = [
	{
		title: "Donor Lookup",
		description: "A searchable database of donors who gave to federal political candidates using data from the Federal Election Commission.",
		image: "images/donor-lookup.png",
		url: "https://www.opensecrets.org/donor-lookup",
		slug: "donor-lookup",
		tags: ["Python", "ElasticSearch", "Docker"],
		is_displayed: true,
		about: "OpenSecrets tracks who funds federal campaigns using FEC filings. The project requires regular updates, which involve moving millions of rows of data from staging database tables. I built the pipeline that ingests those transactions, indexes them in ElasticSearch, and keeps the Donor Lookup tool updated with new data."
	},
	{
		title: "State campaign finance framework",
		description: "An ETL pipeline that houses state campaign finance scrapers that power OpenSecrets.org.",
		image: "images/state-data.png",
		url: "https://www.opensecrets.org/states",
		slug: "state-contribution-framework",
		tags: ["Python", "Prefect", "Github Actions", "Docker", "Pydantic"],
		is_displayed: true,
		about: "OpenSecrets collects campaign finance data from all 50 states and some major cities. I created a Python library that houses and standardizes a fleet of scrapers for all of the jurisdictions and orchestrates scraper runs. The framework provides a universal strandard for scraping and parsing the data from a wide variety of sources, while allowing development to remain flexible depending on the scrape method needed for a particular jurisdiction's data.",
		photografs: [
			{
				image: "../images/state-schema.png",
				alt: "A screenshot of the Python data model",
				graf: "Making this framework meant first figuring out what the data needed to look like. I worked with our state data experts to design a universal data model that would be able to house data from all sources we collect from. Some states offer data fields others don't, and even states with similar data may format their values differently, so we had to account for it all."
			},
			{
				image: "../images/mt-log.png",
				alt: "Chart of daily COVID-19 cases in Florida",
				graf: "With a unified schema in place, I was then able to start making state-specific scrapers using a shared source of truth for the output data. This also helps guide other contributors who may add or edit scrapers in the future, aiding in the maintainability of the pipeline."
			},
			{
				image: "../images/co-os-page.png",
				alt: "Chart of daily COVID-19 cases in Florida",
				graf: "After the data goes through internal review and value-add processes from our research team, the end result is a browsable view of state-level data on OpenSecrets.org."
			},
		]
	},
	{
		title: "Foreign Lobbying",
		description: "A data pipeline collecting and parsing foreign lobbying disclosures from the Foreign Agents Registration Act.",
		image: "images/fara.png",
		url: "https://www.opensecrets.org/fara",
		slug: "FARA",
		tags: ["Python", "S3", "OCR", "Jenkins"],
		is_displayed: false,
		about: "OpenSecrets has maintained a searchable database of foreign lobbying for years, so I modernized the "
	},
	{
		title: "Online ads spending",
		description: "A ETL pipeline that fetches political ad spending data from popular social media platforms. ",
		image: "images/online-ads.png",
		url: "https://www.opensecrets.org/online-ads",
		slug: "online-ads",
		tags: ["Python", "S3", "Jenkins"],
		is_displayed: true,
		about: "Political campaigns pour millions into ads on Facebook, Instagram, Google, and other platforms. I built the pipeline that pulls that spending data, processes it, and powers tools that track where money flows online."
	},
	{
		title: "Florida COVID-19 dashboard",
		description: "Automated tracking, charting, and mapping system for COVID-19 data in Florida.",
		image: "images/covid-tracker-daily-cases.png",
		url: "https://www.sun-sentinel.com/coronavirus/fl-ne-coronavirus-county-progress-tracker-20200528-mo62gyjbwray5f3rxvsmwpi7zu-htmlstory.html",
		slug: "florida-covid-dashboard",
		tags: ["JavaScript", "d3.js", "Python"],
		is_displayed: true,
		about: "As the COVID-19 pandemic unfolded, our newsroom scrambled to report scope and severity of its spread in Florida. I made a Python-based scraper system that collected daily data on new cases, deaths, outbreak hotspots, and tools to help readers find access to vaccines. Partnering with Orlando Sentinel data reporter Adelaide Chen, we put the data into auto-updating charts on our newspapers' respective websites. Note: This project is now defunct due to changes in the newspaper's website, so it does not display anymore.",
		photografs: [
			{
				image: "../images/covid-tracker-daily-cases.png",
				alt: "Chart of daily COVID-19 cases in Florida",
				graf: "As the infections began popping up in Florida, I built Python scrapers to download the data from the state health department's data portal. The first datasets tracked cases and deaths."
			},
			{
				image: "../images/covid-county-cases.jpeg",
				alt: "",
				graf: "While the pandemic spread throughout Florida, I made maps tracking how counties compared for cases, deaths, and hospitlizations."
			},
			{
				image: "../images/covid-county-breakout.jpeg",
				alt: "",
				graf: "The dashboard allowed users to drill down to see how their own county fared specifically. The data updated daily and gave readers the latest snapshots of how the pandemic was unfolding in their community."
			},
			{
				image: "../images/covid-tracker-1.png",
				alt: "",
				graf: "Once the vaccines became available, our newsroom began tracking the rollout immediately. I started collecting vaccine distribution counts both per county and statewide. Using Census data, I made a progress chart calculating vaccines given vs. the state's population to give an estimate of the share of the population that were vaccinated daily."
			},
			{
				image: "../images/covid-tracker-publix.png",
				alt: "",
				graf: "Vaccine distribution was, for a time, limited to specific pharmacy chains. This made me question where there might be gaps, so I used Census data again to map low-income neighborhood and compare that to vaccine access."
			},
			{
				image: "../images/covid-story.png",
				alt: "",
				graf: "While the dashboard provided a data-driven hub for readers to get both a statewide and county-by-county grasp on the pandemic, the system was built to help reporters, too. Daily, the script tallied up case and death totals for the local counties in our coverage area. By eliminating the need to look up data, the system saved our health and breaking news reporters time when they wrote up their daily COVID stories."
			},
		]
	},
	{
		title: "Teenage Time bombs",
		description: "Interactive investigation into Florida's mental health crisis in schools.",
		image: "images/teenage-timebombs-promo.jpg",
		url: "https://projects.sun-sentinel.com/teenage-time-bombs/",
		slug: "teenage-timebombs",
		tags: ["JavaScript", "d3.js", "Adobe Illustrator"],
		is_displayed: true,
		about: "After the Parkland school shooting in 2018, the Sun Sentinel's investigative team set out to see how common it was for Florida school children to make threats against their schools. While threats varied in seriousness and credibility, the investigation took a look ones where those making the threat had access to the means to carry them out. Working closely with the investigative team, I designed and built interactive microsites for each of the three parts of the project.",
	},
	{
		title: "Democratic presidential candidates",
		description: "Profiles of candidates in the 2020 election.",
		image: "images/dem-cands.gif",
		url: "https://www.sun-sentinel.com/news/politics/fl-ne-who-are-the-democratic-candidates-20190626-ybqaws4c4ramxigp4wgmviher4-story.html",
		slug: "democratic-presidential-candidates",
		tags: ["Vue.js"],
		is_displayed: false,
		about: ""
	},
	{
		title: "Unprepared and Overwhelmed",
		description: "A minute-by-minute look at what went wrong during the Parkland school shooting.",
		image: "images/unprepared.jpg",
		url: "https://projects.sun-sentinel.com/2018/sfl-parkland-school-shooting-critical-moments/",
		slug: "unprepared-and-overwhelmed",
		tags: ["JavaScript", "d3.js", "Adobe Illustrator"],
		awards: [
			{
				name: "The Al Neuharth Innovation in Investigative Journalism Award, Large Newsroom",
				award_org: "Online Journalism Awards",
				link: "https://awards.journalists.org/entries/parkland-unprepared-and-overwhelmed/"
			},
			{
				name: "2018 Public Service (Medium Staff)",
				award_org: "Education Writer's Association",
				link: "https://ewa.org/awards/investigative-public-service/2018-public-service-medium-staff-winner"
			},
			{
				name: "First Place News Interactive",
				award_org: "FSNE",
				link: "https://floridamediacontests.com/wp-content/uploads/2019/07/FSNE-2019.pdf"
			},
		],
		is_displayed: true,
		about: "After ammassing a years-worth of police radio comms, photos, videos, public records, and testimonies from people who were present, our newsroom at the South Florida Sun Sentinel wanted to put it all together to get a look at what went wrong during the Parkland school shooting. Working closely with many reporters throughout the newsroom, I designed and built a second-by-second look at the failures that showed clearly how unprepared law enforcement and school officials were for the tragedy.",
		photografs: [
			{
				image: "../images/unprepared1.png",
				alt: "",
				graf: "First, I made a spreadsheet where we could collaborate on the key moments we wanted to include. Part of that also meant going through the hundreds of photos, videos, police radio calls, and testimonies from the state's investigating commission to map out what multimedia elements we had available to work with."
			},
			{
				image: "../images/unprepared2.png",
				alt: "",
				graf: "The locations of the shooter and responding law enforcement were important here, so an illustrated map was one of the first elements I included so readers had a sense of place and where the key people were. The time element was also a main datapoint, so I build a progress bar tied to a timestamp display as you progressed on the page."
			},
			{
				image: "../images/unprepared3.png",
				alt: "",
				graf: "With so many multimedia elements to choose from, we narrowed down the list to the most poignant and chose a design that was minimalistic to let the elements stand on their own with minimal styling."
			},
		]
	},
	{
		title: "Florida hurricane and severe weather trackers",
		description: "Tracking hurricane paths and the Florida communities subject to severe weather alerts in real-time.",
		image: "images/hurricane-path-tracker.png",
		url: "https://www.sun-sentinel.com/news/weather/hurricane/fl-ne-hurricane-dorian-weather-service-alerts-map-20190901-e6qnt3yvrrgtnijmqzaangikhu-story.html",
		slug: "noaa-watch-and-warning-tracker",
		tags: ["d3.js", "AWS Lambda", "Python"],
		is_displayed: true,
		about: "Hurricanes and severe weather were frequent topics of coverage at the South Florida Sun Sentinel. I dug into NOAA data to create the paper's real-time hurricane tracker and weather alert maps. Using Python, the hurricane tracker pulled “spaghetti” models and plotted them into a map. Readers got real-time, visual updates on where storms were and where they might have been heading. A second data pipeline pulled geodata for any weather alerts from the National Weather Service (such as flood warnings, storm surge warnings, etc.) and put them into a map, while also allowing readers to see if their exact address was under a watch or warning.",
		photografs: [
			{
				image: "../images/hurricane-tracker.png",
				alt: "",
				graf: "Every hour, a python scraper would check the National Hurricane Center's endpoint for active tropical storms and, if present, downloaded the geodata. Paired with 'spaghetti' models from the University of Wisconsin, the data fed a map that plotted all the information residents needed to know about the latest predictions."
			},
			{
				image: "../images/severe-weather.png",
				alt: "",
				graf: "Whether there was a hurricane or not, other severe weather was also a paramount concern. A separate data pipeline checked another endpoint from the National Weather Service for flooding, storm surge, and tornado watches and warnings geodata. This also fed a map that showed readers if their locale was part of a watch or warning area. All at once, this system created ready-to-use maps that could be embedded on a dashboard or in accompanying breaking news stories."
			},
		]
	},
	{
		title: "Florida oil and gas drilling",
		description: "A look into where companies have drilled for oil and gas in Florida.",
		image: "images/wells.png",
		url: "https://projects.sun-sentinel.com/2019/fl-oil-and-gas-well-locations",
		slug: "florida-oil-drilling",
		tags: ["d3.js", "Leaflet"],
		is_displayed: true,
		about: "After coming across the raw dataset, I was interested in mapping where drilling had happened historically in Florida. The result was this map that showed the hotspots of oil and gas drilling since the 1940s."
	},
    {
		title: "Florida Election Night results app",
		description: "A Django project that scraped county and state election results and displayed them in real time.",
		image: "images/sentinel-elections.png",
		url: "http://voterguide.sun-sentinel.com/2018/municipal/",
		slug: "election-night-results",
		tags: ["Django", "React"],
		is_displayed: true,
		about: "After previous work scraping election result data from counties, I was recruited to help build an election night result reporting system with the developers of Tribune Publishing. We created a Django-based in which I built scrapers that fetched results from the election offices of each county we covered, as well as the state of Florida. The app fed the data to charts that lived on a special election night section for both the Sun Sentinel and the Orlando Sentinel. The app also generated modular charts that could be embedded directly in stories about specific races in order to aid breaking news coverage of the results."
	},
	{
		title: "Florida Voter registration",
		description: "A self-updating breakdown of who is registering to vote in Florida.",
		image: "images/voters.png",
		url: "http://projects.sun-sentinel.com/2018/fl-voters/",
		slug: "florida-voter-registrations",
		tags: ["d3.js", "Python", "AWS Lambda"],
		is_displayed: true,
		about: "After our state politics team expressed interest in tracking voter registration trends, I wanted to make an auto-updating dashboard to display the latest updates for states and counties. I created Python scripts to get the data, and scheduled them to run with Amazon Lambda. With the help of our data editor John Maines, we came up with a minimalistic page to show some high-level views of the latest figures."
	},
	{
		title: "Nikolas Cruz: The violent path of a teenage killer",
		description: "A scrollytelling story of the Parkland school shooter's disciplinary history.",
		image: "images/troubled-life.png",
		url: "http://projects.sun-sentinel.com/cruz-troubled-life/",
		slug: "nikolas-cruz-timeline",
		tags: ["d3.js", "Scrollama"],
		is_displayed: false,
		about: ""
	},
	{
		title: "Parkland shooter: Seven key facts hidden in the school district's report",
		description: "Interactive look at an unredacted report about the Parkland school shooter.",
		image: "images/redactions.png",
		url: "https://www.sun-sentinel.com/local/broward/parkland/florida-school-shooting/fl-florida-school-shooting-unredacted-report-20180813-htmlstory.html",
		slug: "parkland-shooting-hidden-facts",
		tags: [],
		is_displayed: false,
		about: ""
	},
	{
		title: "2018 Voter Guide",
		description: "A Flask-based guide to local elections, including profiles and answers to a questionnaire from each candidate.",
		image: "images/voter-guide.png",
		url: "http://voterguide.sun-sentinel.com/2018/municipal/",
		slug: "voter-guide-2018",
		tags: ["Flask"],
		is_displayed: true,
		about: "Ahead of the 2018 midterms, myself and a news designer worked with the Sun Sentinel's politcs team to collect questionnaire responses from local candidates and built a guide for residents to see where candidates stood on specific local issues."
	},
	{
		title: "Doctor Discipline",
		description: "A Django app and python scrapers to compile disciplinary info on Florida doctors.",
		image: "images/docs.png",
		url: "http://data.sun-sentinel.com/docdiscipline/",
		slug: "doctor-discipline",
		tags: ["Django"],
		is_displayed: true,
        about: "I was part of a team that developed a Django-based searchable database that allowed readers to look up their doctor to see their medical malpractice claim history. My part involved writing the Python script to fetch the data and feed it into our data model, while also contributing to the front-end data display and search functions. This was my first production Django project."
	},
	{
		title: "INCapitolEdits bot",
		description: "A Twitter bot that watches Wikipedia for edits from Indiana statehouse computers and tweets them out.",
		image: "https://pbs.twimg.com/profile_images/720965849729916928/OSVbaFsZ.jpg",
		url: "https://twitter.com/INCapitolEdits",
		slug: "in-capitol-edits",
		tags: ["Python"],
		is_displayed: false,
		about: ""
	},
	{
		title: "One Wild Ride",
		description: "A scrollytelling story to animate the writer's bike ride through the height of Florida on a map.",
		image: "http://i.imgur.com/zMOAvOe.png",
		url: "http://tampabay.com/projects/2015/features/one-wild-ride/",
		slug: "one-wild-ride",
		tags: ["d3.js", "Mapbox"],
		is_displayed: false,
		about: ""
	}
];
