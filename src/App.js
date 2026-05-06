import React, { useState } from 'react';
import { Calendar, MapPin, FileText, Scale, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

const CourtCaseTimeline = () => {
  const [expandedCases, setExpandedCases] = useState(new Set());
  const [selectedStatus, setSelectedStatus] = useState('all');

  const cases = [
    {"id": 1, "date": "2025-09-01", "defendant": "Jonathan Michael Alfaro", "location": "Court documents only say Los Angeles County. Federal Protective Service agents are currently guarding the federal building in Downtown Los Angeles.", "address": "n/a", "charge": "Assault on federal officer using a deadly or dangerous weapon", "chargeType": "felony", "description": "Defendant allegedly used his car as a weapon against two Federal Protective Service agents.", "outcome": "Pending", "plea": "Not guilty", "court": "Central District of California", "details": "Trial scheduled for March 17, 2026", "source": "https://www.documentcloud.org/documents/26185383-usa-v-alfaro-e791cd17-18f8-4b93-9563-09d63e9b7123/"},
    {"id": 2, "date": "2025-09-04", "defendant": "Joseph Blandon-Saavedra", "location": "San Bernardino, California", "address": "n/a", "charge": "Assaulting, resisting or impeding a federal officer using a dangerous or deadly weapon", "chargeType": "felony", "description": "ICE and HSI tried to pull over the defendant, who was the target of an immigration enforcement operation. Defendant allegedly back his vehicle into an agent's vehicle, then pulled forward into another agent's vehicle. An agent broke the defendant's window open and took him into custody. Appeal pending on one of the counts.", "outcome": "Pending", "plea": "Not guilty", "court": "Central District of California", "details": "Appeal pending; 25-7261; Feb. 9 and March 11 filing deadlines", "source": "https://www.documentcloud.org/documents/26185384-usa-v-blandon-saavedra-11591914-adf1-4348-832e-7227c44a9f1d/"},
    {"id": 3, "date": "2025-08-24", "defendant": "Hector Manuel Rodriguez, Steven Rivera", "location": "Downtown Los Angeles", "address": "255 East Temple Street, Los Angeles, CA 90012", "charge": "Assault of a federal officer, damage to government property", "chargeType": "felony", "description": "A protester allegedly threw a beer can near federal agents. While the agents arrested him, the two defendants allegedly shoved and punched them.", "outcome": "Pending", "plea": "Not guilty", "court": "Central District of California", "details": "Trial scheduled for March 23, 2026", "source": "https://www.documentcloud.org/documents/26185385-usa-v-parra-eb582bc9-8347-4794-a651-57b0484777ae/"},
    {"id": 4, "date": "2025-08-29", "defendant": "Oscar Magana Reyes", "location": "San Bernardino, California", "address": "700 block of West Rialto Avenue", "charge": "Assaulting, resisting or impeding certain officers or employees involving physical contact", "chargeType": "felony", "description": "CBP and ICE were conducting an immigration enforcement operation in San Bernardino when they saw a bicyclist who \"resembled the target\" of the operation, but wasn't, according to court documents. Even though it was the wrong person, agents tried to arrest the bicyclist, who allegedy bit an agent and stole an agent's taser and shocked them with it.", "outcome": "Pending", "plea": "Not guilty", "court": "Central District of California", "details": "Trial scheduled for March 9, 2026", "source": "https://www.documentcloud.org/documents/26185391-usa-v-reyes-2e1c6477-1625-4806-a97e-9c33025e82b9/"},
    {"id": 5, "date": "2025-08-17", "defendant": "Anthoney Edward Rosales", "location": "Downtown Los Angeles", "address": "255 East Temple Street, Los Angeles, CA 90012", "charge": "Assault on federal officer", "chargeType": "felony", "description": "Defendant allegedly spit on a federal agent's leg during a protest.", "outcome": "Pending", "plea": "n/a", "court": "Central District of California", "details": "Trial date not listed on PACER", "source": "https://www.documentcloud.org/documents/26185392-usa-v-rosales-1070b985-b779-4592-978d-6f6f49509074/"},
    {"id": 6, "date": "2025-06-07", "defendant": "Russell Gomez Dzul", "location": "Los Angeles", "address": "n/a", "charge": "Assaulting, resisting or impeding officers", "chargeType": "misdemeanor", "description": "Border Patrol was conducting a roving patrol when they thought a man riding his bicycle looked \"startled and nervous.\" The bicyclist allegedly tried to escape when agents approached him and resisted their attempts to handcuff him.", "outcome": "Not guilty", "plea": "Not guilty", "court": "Central District of California", "details": "Acquitted at trial on Jan. 14, 2026", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.974610/gov.uscourts.cacd.974610.1.0.pdf"},
    {"id": 7, "date": "2025-06-12", "defendant": "Javier Ramirez", "location": "LA City Junk Cars", "address": "1537 W. Olympic Boulevard, Montebello, California 90640", "charge": "Assaulting, resisting or impeding officers", "chargeType": "n/a", "description": "Defendant, who was a U.S. citizen, was accused of resisting Border Patrol when they approached him at the auto yard where he worked.", "outcome": "Dismissed", "plea": "n/a", "court": "Central District of California", "details": "Complaint dismissed without prejudice", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.974696/gov.uscourts.cacd.974696.1.0.pdf"},
    {"id": 8, "date": "2025-06-09", "defendant": "Rene Luna", "location": "Ronald Reagan Federal Building", "address": "34 Civic Center Plaza, Santa Ana, California", "charge": "Assault on federal officer", "chargeType": "misdemeanor", "description": "Defendant allegedly threw water bottles with \"unknown\" liquids inside during a protest.", "outcome": "Guilty", "plea": "Not guilty", "court": "Central District of California", "details": "Plea agreement for misdemeanor charge of obstruction of use of federal property, fined $100", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.976930/gov.uscourts.cacd.976930.45.0.pdf"},
    {"id": 9, "date": "2025-06-07", "defendant": "Emiliano Garduno Galvez", "location": "Paramount", "address": "6400 Alondra Blvd, Paramount, CA 90723", "charge": "Possession of an unregistered destructive device, civil disorder", "chargeType": "felony", "description": "Defendant allegedly threw a Molotov cocktail at federal agents during a protest near Home Depot, where there were reports of an immigration raid.", "outcome": "Guilty", "plea": "Not guilty", "court": "Central District of California", "details": "Pleaded guilty on Oct. 1, 2025; sentenced to 48 months in prison", "source": "https://www.documentcloud.org/documents/26876330-45adccef-eeea-4814-bd7f-f667a5801629/"},
    {"id": 10, "date": "2025-06-07", "defendant": "Christian Damian Cerna Camacho", "location": "Paramount", "address": "6321 Alondra Blvd., Paramount, CA 90723", "charge": "Assault on federal officer", "chargeType": "felony", "description": "Defendant allegedly punched a Border Patrol agent during a protest.", "outcome": "Guilty", "plea": "Not guilty", "court": "Central District of California", "details": "Plea deal for misdemeanor charge. Sentencing scheduled for March 27, 2026", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.977318/gov.uscourts.cacd.977318.69.0.pdf"},
    {"id": 11, "date": "2025-06-07", "defendant": "Brayan Ramos-Brito", "location": "Paramount", "address": "6321 Alondra Blvd., Paramount, CA 90723", "charge": "Simple assault on federal officer", "chargeType": "misdemeanor", "description": "Defendant allegedly pushed a federal agent during a protest.", "outcome": "Not guilty", "plea": "Not guilty", "court": "Central District of California", "details": "Found not guilty after a September 2025 trial", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.974128/gov.uscourts.cacd.974128.1.0.pdf"},
    {"id": 12, "date": "2025-06-06", "defendant": "David Jose Huerta", "location": "Los Angeles", "address": "2415 E. 15th St., Los Angeles, CA 90021", "charge": "Conspiracy to impede an officer", "chargeType": "n/a", "description": "Defendant allegedly obstructed the path to a gated driveway that federal vehicles were using during a protest.", "outcome": "Pending", "plea": "n/a", "court": "Central District of California", "details": "Facing a misdemeanor charge of obstruction, resistance or opposition of a federal officer. Trial date TBD.", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.991908/gov.uscourts.cacd.991908.29.0.pdf"},
    {"id": 13, "date": "2025-06-07", "defendant": "Gisselle Medina", "location": "Paramount", "address": "6300 block of Alondra Boulevard, Paramount, CA", "charge": "Accessory after the fact", "chargeType": "misdemeanor", "description": "Defendant allegedly assisted other individuals who were accused of assaulting and impeding federal agents during a protest.", "outcome": "Pending", "plea": "n/a", "court": "Central District of California", "details": "Trial scheduled for May 11, 2026", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.977691/gov.uscourts.cacd.977691.15.0.pdf"},
    {"id": 14, "date": "2025-06-07", "defendant": "Elpidio Reyna", "location": "Paramount", "address": "6400 block of Alondra Boulevard, Paramount, CA", "charge": "Assault on federal officer by deadly or dangerous weapon resulting in bodily injury", "chargeType": "felony", "description": "Defendant allegedly threw rocks and other debris at federal agents during a protest.", "outcome": "Guilty", "plea": "Not guilty", "court": "Central District of California", "details": "Plea agreement reached; sentencing scheduled for Aug. 7, 2026", "source": "https://www.documentcloud.org/documents/25984206-5124e139-4676-47b5-820b-3cfaf73c5865/"},
    {"id": 15, "date": "2025-06-07", "defendant": "Jacob Daniel Terrazas", "location": "Paramount", "address": "6321 Alondra Blvd., Paramount, CA 90723", "charge": "Simple assault on federal officer, assault of a federal employee using a deadly and dangerous weapon resulting in bodily injury", "chargeType": "felony", "description": "Defendant was allegedly throwing rocks and pieces of cinderblock at Border Patrol agents during a protest.", "outcome": "Guilty", "plea": "Not guilty", "court": "Central District of California", "details": "Pleaded guilty on Jan. 20, 2026; sentencing scheduled for April 6, 2026", "source": "https://www.documentcloud.org/documents/25984212-0a6e45ac-e2ca-4448-b93d-ab0bb9791cb4/"},
    {"id": 16, "date": "2025-07-25", "defendant": "Maria De Jesus Garcia", "location": "Downtown Los Angeles", "address": "255 East Temple Street, Los Angeles, CA 90012", "charge": "Assault on a federal officer or employee resulting in bodily injury", "chargeType": "felony", "description": "Defendant allegedly threw something at a CBP agent and bit the agent.", "outcome": "Pending", "plea": "Not guilty", "court": "Central District of California", "details": "Trial scheduled for March 24, 2026", "source": "https://www.documentcloud.org/documents/26079415-0832ee92-c689-41a9-b714-238b9c18e517/"},
    {"id": 17, "date": "2025-07-23", "defendant": "Fernando Flores", "location": "Downtown Los Angeles", "address": "255 East Temple Street, Los Angeles, CA 90012", "charge": "Assault of a federal officer", "chargeType": "felony", "description": "Defendant allegedly shoved a Bureau of Prisons agent and grabbed her backpack.", "outcome": "Guilty", "plea": "Not guilty", "court": "Central District of California", "details": "Pleaded guilty; sentencing scheduled for May 13", "source": "https://www.documentcloud.org/documents/26079702-46dc279f-2357-42c7-99e4-7bffb1baabb8/"},
    {"id": 18, "date": "2025-07-14", "defendant": "Alfonso Saldana-Solorio", "location": "Sun Valley", "address": "8000 block of Glencrest Drive, Sun Valley, CA 91352", "charge": "Assault on a federal officer or employee resulting in bodily injury", "chargeType": "felony", "description": "Defendant \"appeared to attempt to stike the officers\" who were trying to arrest him for removal proceedings. Defendant also allegedly kicked an agent.", "outcome": "Pending", "plea": "Not guilty", "court": "n/a", "details": "Trial scheduled for Aug. 4, 2026", "source": "https://www.documentcloud.org/documents/26079546-3058be93-6b1e-4f50-a2a9-ee2aea6c882e/"},
    {"id": 19, "date": "2025-06-07", "defendant": "Mario Albert Castillo-Ortega", "location": "Corona", "address": "1144 Circle City, Apt. 10, Corona, California 92879", "charge": "Assault on a federal officer with a deadly and dangerous weapon", "chargeType": "felony", "description": "Defendant allegedly swerved his car into a government car when agents tried to arrest him for removal proceedings.", "outcome": "Dismissed", "plea": "n/a", "court": "n/a", "details": "Dismissed without prejudice upon motion of the government in November 2025", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.983087/gov.uscourts.cacd.983087.23.0.pdf"},
    {"id": 20, "date": "2025-06-08", "defendant": "Wrackkie Quiogue", "location": "Downtown Los Angeles", "address": "255 East Temple Street, Los Angeles, CA 90012", "charge": "Possession of an unregistered destructive device", "chargeType": "felony", "description": "Defendant allegedly tried to set off a Molotov cocktail before federal agents stopped and arrested him.", "outcome": "Guilty", "plea": "Not guilty", "court": "Central District of California", "details": "Pleaded guilty on Nov. 19, 2025; sentencing scheduled for Feb. 25, 2026", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.975360/gov.uscourts.cacd.975360.1.0_2.pdf"},
    {"id": 21, "date": "2025-07-02", "defendant": "Jeane Wong", "location": "San Diego County", "address": "n/a", "charge": "Assaulting, resisting or impeding federal officers", "chargeType": "felony", "description": "Defendant allegedly slapped a federal agent during an immigration enforcement operation in San Diego's Linda Vista neighborhood.", "outcome": "Pending", "plea": "Not guilty", "court": "Southern District of California", "details": "n/a", "source": "https://storage.courtlistener.com/recap/gov.uscourts.casd.821025/gov.uscourts.casd.821025.1.0.pdf"},
    {"id": 22, "date": "2025-07-02", "defendant": "Raul Kuilon", "location": "San Diego County", "address": "n/a", "charge": "Assaulting, resisting or impeding federal officers", "chargeType": "felony", "description": "Defendant allegedly crossed a police line and brought his arm down forcefully onto the forearm of a federal agent when agents tried to secure the perimeter.", "outcome": "Dismissed", "plea": "Not guilty", "court": "Southern District of California", "details": "Government prosecutors filed a motion to dismiss the case without prejudice", "source": "https://storage.courtlistener.com/recap/gov.uscourts.casd.821019/gov.uscourts.casd.821019.1.0.pdf"},
    {"id": 23, "date": "2025-07-02", "defendant": "Denis Anderson Chicoj-Yacon", "location": "San Diego County", "address": "n/a", "charge": "Assaulting, resisting or impeding federal officers", "chargeType": "felony", "description": "HSI and CBP located a Guatemalan national for removal proceedings. He was in his car and refused to exit. After agents started trying to break into the car, he tried driving away and nearly struck agents who were standing close by.", "outcome": "Dismissed", "plea": "Not guilty", "court": "Southern District of California", "details": "Case dismissed, but defendant is in ICE custody as of Oct. 12, 2025", "source": "https://storage.courtlistener.com/recap/gov.uscourts.casd.821013/gov.uscourts.casd.821013.1.0.pdf"},
    {"id": 24, "date": "2025-10-30", "defendant": "Carlos Jimenez", "location": "Ontario, California", "address": "n/a", "charge": "Assault on a federal officer", "chargeType": "n/a", "description": "Defendant was shot in the back of his shoulder when he stopped in his car near federal agents as they conducted a vehicle stop.", "outcome": "Pending", "plea": "Not guilty", "court": "Central District of California", "details": "Trial scheduled for June 22, 2026", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.993820/gov.uscourts.cacd.993820.1.0.pdf"},
    {"id": 25, "date": "2025-11-06", "defendant": "Robert Chavez Cortez", "location": "Anaheim, California", "address": "800 N. Brookhurst St.", "charge": "Assaulting, resisting or impeding a federal officer involving physical contact", "chargeType": "n/a", "description": "Defendant allegedly spit on a Border Patrol agent.", "outcome": "Guilty", "plea": "Not guilty", "court": "Central District of California", "details": "Accepted plea deal to be convicted for simple assault, sentenced to time served", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.994827/gov.uscourts.cacd.994827.1.0.pdf"},
    {"id": 26, "date": "2025-11-04", "defendant": "Christopher Chitwood", "location": "Sacramento", "address": "650 Capitol Mall", "charge": "Assault on a federal officer", "chargeType": "n/a", "description": "Defendant allegedly assaulted a federal agent who was arresting someone else for trespassing on federal property.", "outcome": "Pending", "plea": "n/a", "court": "Eastern District of California", "details": "Status conference scheduled for June 22, 2026", "source": "https://storage.courtlistener.com/recap/gov.uscourts.caed.474537/gov.uscourts.caed.474537.1.0.pdf"},
    {"id": 27, "date": "2025-06-11", "defendant": "Esteban Armenta Arias", "location": "Downtown Los Angeles", "address": "255 East Temple Street, Los Angeles, CA 90012", "charge": "Assault on federal officer", "chargeType": "n/a", "description": "Defendant allegedly picked up a water bottle and threw it at a federal agent during a protest at the federal building in Downtown L.A.", "outcome": "Pending", "plea": "Not guilty", "court": "Central District of California", "details": "Trial scheduled for Aug. 25, 2026", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.976593/gov.uscourts.cacd.976593.1.0.pdf"},
    {"id": 28, "date": "2025-07-25", "defendant": "Alexandria Demetrius Augustine", "location": "Downtown Los Angeles", "address": "255 East Temple Street, Los Angeles, CA 90012", "charge": "Assault on federal officer", "chargeType": "n/a", "description": "A federal agent tore up the defendant's umbrella, and the defendant allegedly threw the metal frame of the umbrella at the agent.", "outcome": "Dismissed", "plea": "Not guilty", "court": "Central District of California", "details": "As of April 2026, pending charge of causing a disturbance", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.983602/gov.uscourts.cacd.983602.1.0.pdf"},
    {"id": 29, "date": "2025-08-04", "defendant": "Ashleigh Brown", "location": "Downtown Los Angeles", "address": "255 East Temple Street, Los Angeles, CA 90012", "charge": "Assault on federal officer", "chargeType": "n/a", "description": "Defendant allegedly hit a federal agent \"in his left side with her right arm.\"", "outcome": "Dismissed", "plea": "Not guilty", "court": "Central District of California", "details": "Government filed a motion to dismiss the charges", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.983586/gov.uscourts.cacd.983586.1.0.pdf"},
    {"id": 30, "date": "2025-06-08", "defendant": "Kade Wilde Byrand", "location": "Downtown Los Angeles", "address": "255 East Temple Street, Los Angeles, CA 90012", "charge": "Assault on federal officer", "chargeType": "n/a", "description": "Defendant was accused of pushing a Bureau of Prisons agent.", "outcome": "Guilty", "plea": "Guilty", "court": "Central District of California", "details": "Pleaded guilty on Sept. 17, 2025; sentenced to time served (four days in prison), one year supervised release and fined $1,000", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.977308/gov.uscourts.cacd.977308.1.0_1.pdf"},
    {"id": 31, "date": "2025-06-08", "defendant": "Elmore Sylvester Cage", "location": "Los Angeles", "address": "n/a", "charge": "Obstructing, impeding or interfering with law enforcement", "chargeType": "n/a", "description": "Defendant allegedly obstructed, impeded and interfered with LAPD.", "outcome": "Pending", "plea": "Not guilty", "court": "Central District of California", "details": "Trial scheduled for Sept. 28, 2026", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.995250/gov.uscourts.cacd.995250.71.0.pdf"},
    {"id": 32, "date": "2025-06-06", "defendant": "Yovany Macario Canil", "location": "Ambiance warehouse", "address": "927 Stanford Ave., Los Angeles, CA 90021", "charge": "Assault on federal officer", "chargeType": "n/a", "description": "Defendant allegedly pepper-sprayed FBI SWAT team members who were executing a search warrant at a warehouse.", "outcome": "Pending", "plea": "Not guilty", "court": "Central District of California", "details": "Trial scheduled for Aug. 3, 2026", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.995909/gov.uscourts.cacd.995909.1.0.pdf"},
    {"id": 33, "date": "2025-07-10", "defendant": "Jonathan Caravello", "location": "Glasshouse Farms", "address": "645 Laguna Rd., Camarillo, CA 93012", "charge": "Assault on federal officer", "chargeType": "n/a", "description": "Defendant allegedly threw a tear gas cannister back at federal agents while they executed a search warrant.", "outcome": "Pending", "plea": "Not guilty", "court": "Central District of California", "details": "Trial scheduled for March 24, 2026", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.985175/gov.uscourts.cacd.985175.1.0.pdf"},
    {"id": 34, "date": "2025-08-25", "defendant": "Katherine Carreno", "location": "Downtown Los Angeles", "address": "255 East Temple Street, Los Angeles, CA 90012", "charge": "Assault on federal officer", "chargeType": "n/a", "description": "Defendant allegedly used a \"slapping/chopping\" motion on an agent two times.", "outcome": "Not guilty", "plea": "Not guilty", "court": "Central District of California", "details": "Found not guilty after jury trial", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.988835/gov.uscourts.cacd.988835.1.0.pdf"},
    {"id": 35, "date": "2025-07-10", "defendant": "Isai Carrillo", "location": "Glasshouse Farms", "address": "645 Laguna Rd., Camarillo, CA 93012", "charge": "Conspiracy to impede an officer, assaulting an officer with a deadly weapon", "chargeType": "n/a", "description": "Defendant allegedly threw rocks at government vehicles while they were trying to reach Glasshouse Farms.", "outcome": "Pending", "plea": "Not guilty", "court": "Central District of California", "details": "Trial scheduled for June 22, 2026", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.996095/gov.uscourts.cacd.996095.44.0.pdf"},
    {"id": 36, "date": "2025-06-20", "defendant": "Jose Cervantes Licea", "location": "Jack's Car Wash & Detailing", "address": "7030 Atlantic Ave, Bell, CA 90201", "charge": "Assault on federal officer", "chargeType": "n/a", "description": "Defendant charged into a Border Patrol agent, momentarily freeing an undocumented immigrant from apprehension.", "outcome": "Guilty", "plea": "Not guilty", "court": "Central District of California", "details": "Pleaded guilty on Aug. 29, 2025; sentenced to one year of probation", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.979897/gov.uscourts.cacd.979897.1.0.pdf"},
    {"id": 37, "date": "2025-08-15", "defendant": "Mario Chacon", "location": "Downtown Los Angeles", "address": "255 East Temple Street, Los Angeles, CA 90012", "charge": "Assault on federal officer", "chargeType": "n/a", "description": "Defendant allegedly threw a water bottle that hit a federal agent in the head.", "outcome": "Guilty", "plea": "Not guilty", "court": "Central District of California", "details": "Pleaded guilty on Oct. 22, 2025, and sentenced Dec. 3 to time served (109 days in prison).", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.983338/gov.uscourts.cacd.983338.1.0.pdf"},
    {"id": 38, "date": "2025-06-25", "defendant": "Jose Francisco Cirenio-Marcos", "location": "San Bernardino County West Valley Detention Center", "address": "9500 Etiwanda Ave, Rancho Cucamonga, CA 91739", "charge": "Assault on federal officer", "chargeType": "n/a", "description": "Defendant allegedly hid in a bathroom when ICE approached him and then resisted arrest when they tried to handcuff him.", "outcome": "Dismissed", "plea": "Not guilty", "court": "Central District of California", "details": "Dismissed; defendant was deported", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.979844/gov.uscourts.cacd.979844.1.0.pdf"},
    {"id": 39, "date": "2025-09-14", "defendant": "Jose Cruz-Severiano", "location": "Los Angeles", "address": "n/a", "charge": "Assault on federal officer", "chargeType": "n/a", "description": "Defendant allegedly \"made physical contact\" with a federal agent and caused an injury.", "outcome": "Dismissed", "plea": "Not guilty", "court": "Central District of California", "details": "Dismissed on Nov. 12, 2025", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.991779/gov.uscourts.cacd.991779.12.0.pdf"},
    {"id": 40, "date": "2025-07-08", "defendant": "Danielle Nadine Davila", "location": "SCA Health Ontario Advanced Surgery Center", "address": "1211 W. Sixth St., Ontario, CA 91762", "charge": "Assault on federal officer", "chargeType": "n/a", "description": "Defendant was one of two staffers at the surgical center who allegedly interfered with law enforcement as they were trying to apprehend an immigrant.", "outcome": "Pending", "plea": "Not guilty", "court": "Central District of California", "details": "Trial scheduled for June 22, 2026", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.984508/gov.uscourts.cacd.984508.31.0.pdf"},
    {"id": 41, "date": "2025-07-08", "defendant": "Jose de Jesus Ortega", "location": "SCA Health Ontario Advanced Surgery Center", "address": "1211 W. Sixth St., Ontario, CA 91762", "charge": "n/a", "chargeType": "n/a", "description": "Defendant was one of two staffers at the surgical center who allegedly interfered with law enforcement as they were trying to apprehend an immigrant.", "outcome": "Pending", "plea": "Not guilty", "court": "Central District of California", "details": "Trial scheduled for June 22, 2026", "source": "n/a"},
    {"id": 42, "date": "2025-06-09", "defendant": "Danny Duran", "location": "Downtown Los Angeles", "address": "255 East Temple Street, Los Angeles, CA 90012", "charge": "Assault on federal officer", "chargeType": "felony", "description": "Defendant was allegedly driving a car by the federal building in Downtown L.A. when another defendant in the passenger seat fired paintballs at a Federal Protective Service officer.", "outcome": "Pending", "plea": "Not guilty", "court": "Central District of California", "details": "Trial scheduled for July 28, 2026", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.979442/gov.uscourts.cacd.979442.19.0.pdf"},
    {"id": 43, "date": "2025-07-17", "defendant": "Erin Escobar", "location": "Downtown Los Angeles", "address": "255 East Temple Street, Los Angeles, CA 90012", "charge": "Assault on federal officer", "chargeType": "felony", "description": "Defendant was allegedly writing on federal property with a marker and after being arrested, spit on a Federal Protective Services officer.", "outcome": "Dismissed", "plea": "Not guilty", "court": "Central District of California", "details": "Dismissed with prejudice.", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.983289/gov.uscourts.cacd.983289.1.0.pdf"},
    {"id": 44, "date": "2025-07-17", "defendant": "Nick Gutierrez", "location": "Downtown Los Angeles", "address": "255 East Temple Street, Los Angeles, CA 90012", "charge": "Assault on federal officer", "chargeType": "felony", "description": "Defendant allegedly grabbed the bulletproof vest of a federal officer and began shaking him.", "outcome": "Dismissed", "plea": "Not guilty", "court": "Central District of California", "details": "Dismissed with prejudice.", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.983289/gov.uscourts.cacd.983289.1.0.pdf"},
    {"id": 45, "date": "2025-07-12", "defendant": "Hector Galeano-Galindo", "location": "Downtown Los Angeles", "address": "255 East Temple Street, Los Angeles, CA 90012", "charge": "Assault on federal officer", "chargeType": "n/a", "description": "Allegedly struck the arm of a Federal Protective Services agent who was trying to clear a path for an ICE van to enter the federal building driveway.", "outcome": "Guilty", "plea": "n/a", "court": "Central District of California", "details": "Pleaded guilty on Sept. 17, 2025, and sentenced to time served; fined $100", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.982645/gov.uscourts.cacd.982645.1.0.pdf"},
    {"id": 46, "date": "2025-06-09", "defendant": "Christian Andres Garcia", "location": "Santa Ana", "address": "34 Civic Center Plaza, Santa Ana CA 92701", "charge": "Assault on federal officer", "chargeType": "n/a", "description": "Defendant allegedly threw objects at federal agents and a vehicle during a protest.", "outcome": "Dismissed", "plea": "Not guilty", "court": "Central District of California", "details": "Dismissed on Jan. 7, 2026", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.977442/gov.uscourts.cacd.977442.1.0.pdf"},
    {"id": 47, "date": "2025-08-25", "defendant": "Hector Leiva Garcia", "location": "Marina Del Rey", "address": "n/a", "charge": "Assault on federal officer", "chargeType": "n/a", "description": "Defendant was accused of kicking Border Patrol agents who were trying to check his immigration status, but he denied it.", "outcome": "Dismissed", "plea": "n/a", "court": "Central District of California", "details": "Dismissed on Sept. 9, 2025", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.984657/gov.uscourts.cacd.984657.1.0.pdf"},
    {"id": 48, "date": "2025-07-21", "defendant": "Carlos Gutierrez-Cardenas", "location": "Ontario", "address": "658 W. Holt Blvd, Ste A, Ontario, CA 91762", "charge": "Assaulting, resisting or impeding officers", "chargeType": "n/a", "description": "Defendant allegedly threw hot coffee on an ICE agent who was trying to arrest him for deportation proceedings.", "outcome": "Dismissed", "plea": "n/a", "court": "Central District of California", "details": "Dismissed on Aug. 22, 2025", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.980478/gov.uscourts.cacd.980478.1.0.pdf"},
    {"id": 49, "date": "2025-06-12", "defendant": "Thomas Guzman", "location": "Downtown Los Angeles", "address": "255 East Temple Street, Los Angeles, CA 90012", "charge": "Assault on federal officer", "chargeType": "misdemeanor", "description": "Defendant threw a rock at a CBP officer at the federal building in Downtown Los Angeles.", "outcome": "Guilty", "plea": "Guilty", "court": "Central District of California", "details": "Pleaded guilty July 17, 2025; sentenced to one year of probation", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.978055/gov.uscourts.cacd.978055.1.0.pdf"},
    {"id": 50, "date": "2025-07-26", "defendant": "Alireza Hamedani", "location": "Rancho Santa Margarita, California", "address": "n/a", "charge": "Assault on federal officer", "chargeType": "n/a", "description": "Defendant allegedly drove his car into an HSI agent, who suffered a sprained elbow, while trying to arrest the defendant for deportation.", "outcome": "Dismissed", "plea": "n/a", "court": "Central District of California", "details": "Dismissed Sept. 23, 2025; in ICE custody", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.980977/gov.uscourts.cacd.980977.1.0.pdf"},
    {"id": 51, "date": "2025-07-06", "defendant": "Arturo Hermosillo", "location": "San Pedro, California", "address": "n/a", "charge": "Conspiracy to impede an officer", "chargeType": "n/a", "description": "Defendant allegedly followed Border Patrol agents by car and blocked their vehicles.", "outcome": "Dismissed", "plea": "n/a", "court": "Central District of California", "details": "Dismissed on July 29, 2025", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.978018/gov.uscourts.cacd.978018.1.0.pdf"},
    {"id": 52, "date": "2025-07-06", "defendant": "Julian Pecora Carnedas", "location": "San Pedro, California", "address": "n/a", "charge": "Conspiracy to impede an officer", "chargeType": "n/a", "description": "Defendant allegedly followed Border Patrol agents by car and blocked their vehicles.", "outcome": "Dismissed", "plea": "n/a", "court": "Central District of California", "details": "Dismissed on July 29, 2026", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.978018/gov.uscourts.cacd.978018.1.0.pdf"},
    {"id": 53, "date": "2025-06-24", "defendant": "Luis Dalhet Hipolito", "location": "Downtown Los Angeles", "address": "n/a", "charge": "Assault on federal officer", "chargeType": "n/a", "description": "Defendant allegedly tried to block an ICE agent's vehicle and allegedly punched an agent in the face.", "outcome": "Not guilty", "plea": "Not guilty", "court": "Central District of California", "details": "Found not guilty after jury trial from March 31 to April 1", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.979965/gov.uscourts.cacd.979965.1.0.pdf"},
    {"id": 54, "date": "2025-06-24", "defendant": "Andrea Guadalupe Velez", "location": "Downtown Los Angeles", "address": "n/a", "charge": "Assault on federal officer", "chargeType": "n/a", "description": "Defendant allegedly stepped in front of an ICE agent who was chasing someone, then struck the agent's head and chest by sticking her arms out.", "outcome": "Dismissed", "plea": "n/a", "court": "Central District of California", "details": "Dismissed on July 10, 2025", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.979965/gov.uscourts.cacd.979965.1.0.pdf"},
    {"id": 55, "date": "2025-02-28", "defendant": "Kiara Jaime-Flores", "location": "n/a", "address": "n/a", "charge": "Conspiracy to impede or injure officer", "chargeType": "n/a", "description": "Defendant and her boyfriend allegedly followed federal agents in their vehicle and blocked them, brake checked and otherwise impeded them.", "outcome": "Guilty", "plea": "Not guilty", "court": "Central District of California", "details": "Pleaded guilty on Dec. 1, 2025; sentenced to one year of probation", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.973089/gov.uscourts.cacd.973089.1.0_1.pdf"},
    {"id": 56, "date": "2025-02-28", "defendant": "Gustavo Torres", "location": "n/a", "address": "n/a", "charge": "Conspiracy to impede or injure officer", "chargeType": "n/a", "description": "Defendant and his girlfriend allegedly followed federal agents in their vehicle and blocked them, brake checked and otherwise impeded them.", "outcome": "Guilty", "plea": "Not guilty", "court": "Central District of California", "details": "Pleaded guilty on Dec. 1, 2025; sentenced to one year in prison", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.973089/gov.uscourts.cacd.973089.1.0_1.pdf"},
    {"id": 57, "date": "2025-06-14", "defendant": "Angus Johnson", "location": "Downtown Los Angeles", "address": "255 East Temple Street, Los Angeles, CA 90012", "charge": "Assaulting, resisting or impeding officers", "chargeType": "misdemeanor", "description": "Defendant spit on federal agents during the first No Kings protest in Downtown Los Angeles.", "outcome": "Guilty", "plea": "Guilty", "court": "Central District of California", "details": "Pleaded guilty on Aug. 6, 2025; sentenced on Nov. 7 2025, to 14 days in prison and $100 fine", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.979765/gov.uscourts.cacd.979765.1.0.pdf"},
    {"id": 58, "date": "2025-12-01", "defendant": "Jose Francisco Jovel", "location": "Downtown Los Angeles", "address": "255 East Temple Street, Los Angeles, CA 90012", "charge": "Attempted malicious damage of federal property", "chargeType": "n/a", "description": "Defendant allegedly threw two molotov cocktails at the Downtown Los Angeles federal building.", "outcome": "Pending", "plea": "Not guilty", "court": "Central District of California", "details": "Trial scheduled for Oct. 20, 2026", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.1000763/gov.uscourts.cacd.1000763.1.0.pdf"},
    {"id": 59, "date": "2025-07-24", "defendant": "Harold Lemus-Romero", "location": "n/a", "address": "n/a", "charge": "Assault on federal officer", "chargeType": "n/a", "description": "Defendant allegedly tried to escape DHS officers, including biting one agent, who tried to take him into custody in Santa Ana immigration court.", "outcome": "Dismissed", "plea": "n/a", "court": "Central District of California", "details": "Notice to dismiss filed on Nov. 17, 2025; defendant in ICE custody", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.980936/gov.uscourts.cacd.980936.1.0.pdf"},
    {"id": 60, "date": "n/a", "defendant": "Francisco Javier Longoria", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Dismissed", "plea": "n/a", "court": "Central District of California", "details": "Dismissed on Sept. 17, 2025", "source": "n/a"},
    {"id": 61, "date": "n/a", "defendant": "Isaias Lopez", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Not guilty", "plea": "n/a", "court": "Central District of California", "details": "Acquitted at trial, Jan. 29, 2026", "source": "n/a"},
    {"id": 62, "date": "2025-06-09", "defendant": "Edwin Osvaldo Manriquez", "location": "Downtown Los Angeles", "address": "255 East Temple Street, Los Angeles, CA 90012", "charge": "n/a", "chargeType": "felony", "description": "n/a", "outcome": "Guilty", "plea": "Not guilty", "court": "Central District of California", "details": "Accepted a plea deal to be convicted on a count of assault on a federal officer with a deadly or dangerous weapon.", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.979443/gov.uscourts.cacd.979443.1.0.pdf"},
    {"id": 63, "date": "n/a", "defendant": "Adrian Andrew Martinez", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Pending", "plea": "n/a", "court": "Central District of California", "details": "Trial scheduled for May 11, 2026", "source": "n/a"},
    {"id": 64, "date": "n/a", "defendant": "Cosmas Mitchell", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Guilty", "plea": "n/a", "court": "Central District of California", "details": "Pleaded guilty on Dec. 12, 2025; sentencing scheduled for April 3, 2026", "source": "n/a"},
    {"id": 65, "date": "n/a", "defendant": "Jose Manuel Mojica", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Dismissed", "plea": "n/a", "court": "Central District of California", "details": "Dismissed on June 18, 2025", "source": "n/a"},
    {"id": 66, "date": "n/a", "defendant": "Matthew Jules Munoz", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Guilty", "plea": "n/a", "court": "Central District of California", "details": "Pleaded guilty Dec. 9, 2025, to a misdemeanor charge, sentenced to three consecutive weekends of prison from Friday to Sunday starting Dec. 19.", "source": "n/a"},
    {"id": 67, "date": "n/a", "defendant": "Juan Pablo Munoz-Hernandez", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Guilty", "plea": "n/a", "court": "Central District of California", "details": "Pleaded guilty on Oct. 9, sentencing was scheduled for Dec. 19.", "source": "n/a"},
    {"id": 68, "date": "n/a", "defendant": "Bobby Nunez", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Not guilty", "plea": "n/a", "court": "Central District of California", "details": "Acquitted on Dec. 19, 2025", "source": "n/a"},
    {"id": 69, "date": "n/a", "defendant": "Alejandro Orellana", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Dismissed", "plea": "n/a", "court": "Central District of California", "details": "Dismissed on July 30, 2025", "source": "n/a"},
    {"id": 70, "date": "n/a", "defendant": "Margaret Sarah Ortiz", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Dismissed", "plea": "n/a", "court": "Central District of California", "details": "Dismissed on Sept. 5, 2025", "source": "n/a"},
    {"id": 71, "date": "n/a", "defendant": "Carlitos Ricardo Parias", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Dismissed", "plea": "n/a", "court": "Central District of California", "details": "Dismissed on Dec. 27, 2025, but government has appealed. Defendant is in ICE custody.", "source": "n/a"},
    {"id": 72, "date": "n/a", "defendant": "Juan Antonio Parra", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Dismissed", "plea": "n/a", "court": "Central District of California", "details": "Dismissed on Sept. 10, 2026", "source": "n/a"},
    {"id": 73, "date": "n/a", "defendant": "Jesus Posadas-Espinoza", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Pending", "plea": "n/a", "court": "Central District of California", "details": "Trial scheduled for May 5, 2026", "source": "n/a"},
    {"id": 74, "date": "n/a", "defendant": "Omar Pulido Bastida", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Guilty", "plea": "n/a", "court": "Central District of California", "details": "Pleaded guilty on Aug. 7, 2025; sentenced to three months in prison", "source": "n/a"},
    {"id": 75, "date": "n/a", "defendant": "Avery Quinn Scopes Craft", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Dismissed", "plea": "n/a", "court": "Central District of California", "details": "Dismissed on Aug. 28, 2025", "source": "n/a"},
    {"id": 76, "date": "n/a", "defendant": "Dennis Orlando Quinonez", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Pending", "plea": "n/a", "court": "Central District of California", "details": "Trial scheduled for May 19, 2026", "source": "n/a"},
    {"id": 77, "date": "n/a", "defendant": "Tony de Jesus Quintanilla", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Guilty", "plea": "n/a", "court": "Central District of California", "details": "Pleaded guilty on Sept. 19, 2025, and sentenced to one year of probation and $1,850 in restitution", "source": "n/a"},
    {"id": 78, "date": "n/a", "defendant": "Jessica Isabel Ramirez-Vasquez", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Pending", "plea": "n/a", "court": "Central District of California", "details": "Trial scheduled for March 2, 2026", "source": "n/a"},
    {"id": 79, "date": "n/a", "defendant": "Georgina Ravelero", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Guilty", "plea": "n/a", "court": "Central District of California", "details": "Pleaded guilty on Jan. 5, 2026; sentencing scheduled for April 5, 2026", "source": "n/a"},
    {"id": 80, "date": "n/a", "defendant": "Cynthia Raygoza", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Pending", "plea": "n/a", "court": "Central District of California", "details": "Trial scheduled for Feb. 24, 2026", "source": "n/a"},
    {"id": 81, "date": "n/a", "defendant": "Jonathan Redondo-Rosales", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Pending", "plea": "n/a", "court": "Central District of California", "details": "Trial scheduled for Feb. 17, 2026", "source": "n/a"},
    {"id": 82, "date": "n/a", "defendant": "Henry Rendon", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Dismissed", "plea": "n/a", "court": "Central District of California", "details": "Dismissed on July 17, 2025", "source": "n/a"},
    {"id": 83, "date": "n/a", "defendant": "Virginia Reyes", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Pending", "plea": "n/a", "court": "Central District of California", "details": "Trial scheduled for June 22, 2026", "source": "n/a"},
    {"id": 84, "date": "n/a", "defendant": "Geronimo Reyna", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Pending", "plea": "n/a", "court": "Central District of California", "details": "Trial scheduled for May 26, 2026", "source": "n/a"},
    {"id": 85, "date": "n/a", "defendant": "Dominic Rios", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Guilty", "plea": "n/a", "court": "Central District of California", "details": "Pleaded guilty on Aug. 28, 2025; sentenced Dec. 3, 2025, to one year probation and 50 hours community service", "source": "n/a"},
    {"id": 86, "date": "n/a", "defendant": "Ashley Rodriguez", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Pending", "plea": "n/a", "court": "Central District of California", "details": "Trial scheduled for Oct. 20, 2026", "source": "n/a"},
    {"id": 87, "date": "n/a", "defendant": "Eric Anthony Rodriguez", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Guilty", "plea": "n/a", "court": "Central District of California", "details": "Pleaded guilty Sept. 10, 2025; sentencing March 11, 2026", "source": "n/a"},
    {"id": 88, "date": "n/a", "defendant": "Gabriel Rodriguez", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Guilty", "plea": "n/a", "court": "Central District of California", "details": "Pleaded guilty Sept. 12, 2025; sentenced Oct. 8, 2025 to eight months in prison, $325 restitution", "source": "n/a"},
    {"id": 89, "date": "n/a", "defendant": "Joceline Rodriguez", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Pending", "plea": "n/a", "court": "Central District of California", "details": "Trial scheduled for Oct. 20, 2026", "source": "n/a"},
    {"id": 90, "date": "n/a", "defendant": "Randy Paul Ruiz", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Pending", "plea": "n/a", "court": "Central District of California", "details": "Trial date TBD", "source": "n/a"},
    {"id": 91, "date": "n/a", "defendant": "Kaden Rummler", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Pending", "plea": "n/a", "court": "Central District of California", "details": "Arraignment TBD", "source": "n/a"},
    {"id": 92, "date": "n/a", "defendant": "Sandra Carmona Samane", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Pending", "plea": "n/a", "court": "Central District of California", "details": "Trial scheduled for Feb. 24, 2026", "source": "n/a"},
    {"id": 93, "date": "n/a", "defendant": "Alberto Sandoval-Alvarado", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Pending", "plea": "n/a", "court": "Central District of California", "details": "Stipulation to continue trial to May 7, 2026", "source": "n/a"},
    {"id": 94, "date": "n/a", "defendant": "Katelyn Skye Seitz", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Pending", "plea": "n/a", "court": "Central District of California", "details": "Arraignment scheduled for Feb. 17, 2026", "source": "n/a"},
    {"id": 95, "date": "n/a", "defendant": "Jorge Sierra Hernandez", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Dismissed", "plea": "n/a", "court": "Central District of California", "details": "Dismissed on July 17, 2026", "source": "n/a"},
    {"id": 96, "date": "n/a", "defendant": "Ceasar Salvador Sigala", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Pending", "plea": "n/a", "court": "Central District of California", "details": "Trial scheduled for April 28, 2026", "source": "n/a"},
    {"id": 97, "date": "n/a", "defendant": "Robert Strong", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Pending", "plea": "n/a", "court": "Central District of California", "details": "Trial scheduled for May 5, 2026", "source": "n/a"},
    {"id": 98, "date": "n/a", "defendant": "Jessica Elizabeth Trapp", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Pending", "plea": "n/a", "court": "Central District of California", "details": "Trial scheduled for April 21, 2026", "source": "n/a"},
    {"id": 99, "date": "n/a", "defendant": "Noe Vacilio", "location": "n/a", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "n/a", "outcome": "Dismissed", "plea": "n/a", "court": "Central District of California", "details": "Dismissed on Aug. 6, 2025", "source": "n/a"},
    {"id": 100, "date": "2025-06-08", "defendant": "Yachua Mauricio Flores", "location": "Los Angeles", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "One of nine defendants charged with trying to set fire to a California Highway Patrol vehicle or attempting to obstruct or impede law enforcement in the process.", "outcome": "Guilty", "plea": "Not guilty", "court": "Central District of California", "details": "Accepted plea deal to be convicted with a felony count of obstructing, impeding and interfering with law enforcement during a civil disorder.", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.987494/gov.uscourts.cacd.987494.106.0.pdf"},
    {"id": 101, "date": "2025-06-08", "defendant": "Stefano Deong Green", "location": "Los Angeles", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "One of nine defendants charged with trying to set fire to a California Highway Patrol vehicle or attempting to obstruct or impede law enforcement in the process.", "outcome": "Pending", "plea": "Not guilty", "court": "Central District of California", "details": "Trial scheduled for June 16, 2026", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.987494/gov.uscourts.cacd.987494.106.0.pdf"},
    {"id": 102, "date": "2025-06-08", "defendant": "Jesus Gonzalez Hernandez Jr.", "location": "Los Angeles", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "One of nine defendants charged with trying to set fire to a California Highway Patrol vehicle or attempting to obstruct or impede law enforcement in the process.", "outcome": "Guilty", "plea": "Not guilty", "court": "Central District of California", "details": "Accepted guilty plea for misdemeanor count of simple assault on a person assisting a federal officer.", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.987494/gov.uscourts.cacd.987494.106.0.pdf"},
    {"id": 103, "date": "2025-06-08", "defendant": "Adam Charles Palermo", "location": "Los Angeles", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "Defendant allegedly threw a \"flaming object\" at a California Highway Patrol vehicle during a protest.", "outcome": "Guilty", "plea": "Not guilty", "court": "Central District of California", "details": "Accepted plea deal to be convicted with a felony count of assaulting, resisting and impeding persons assisting federal officers.", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.987495/gov.uscourts.cacd.987495.16.0.pdf"},
    {"id": 104, "date": "2025-06-08", "defendant": "Balto Montion", "location": "Los Angeles", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "One of nine defendants charged with trying to set fire to a California Highway Patrol vehicle or attempting to obstruct or impede law enforcement in the process.", "outcome": "Guilty", "plea": "n/a", "court": "Central District of California", "details": "Accepted plea deal to be convicted on a felony count of obstructing, impeding and interfering with law enforcement.", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.987494/gov.uscourts.cacd.987494.106.0.pdf"},
    {"id": 105, "date": "2025-06-08", "defendant": "Hector Daniel Ramos", "location": "Los Angeles", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "One of nine defendants charged with trying to set fire to a California Highway Patrol vehicle or attempting to obstruct or impede law enforcement in the process.", "outcome": "Pending", "plea": "Not guilty", "court": "Central District of California", "details": "Trial scheduled for June 23, 2026", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.987494/gov.uscourts.cacd.987494.106.0.pdf"},
    {"id": 106, "date": "2025-06-08", "defendant": "Junior Roldan", "location": "Los Angeles", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "One of nine defendants charged with trying to set fire to a California Highway Patrol vehicle or attempting to obstruct or impede law enforcement in the process.", "outcome": "Guilty", "plea": "Not guilty", "court": "Central District of California", "details": "Accepted plea deal to be convicted on a misdemeanor count of simple assault on a person assisting a federal officer.", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.987494/gov.uscourts.cacd.987494.106.0.pdf"},
    {"id": 107, "date": "2025-06-08", "defendant": "Ismael Vega", "location": "Los Angeles", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "One of nine defendants charged with trying to set fire to a California Highway Patrol vehicle or attempting to obstruct or impede law enforcement in the process.", "outcome": "Guilty", "plea": "Not guilty", "court": "Central District of California", "details": "Accepted plea deal to be convicted on a count of obstructing, impeding and interfering with law enforcement during a civil disorder.", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.987494/gov.uscourts.cacd.987494.106.0.pdf"},
    {"id": 108, "date": "2025-06-08", "defendant": "Ronald Alexis Coreas", "location": "Los Angeles", "address": "n/a", "charge": "n/a", "chargeType": "n/a", "description": "One of nine defendants charged with trying to set fire to a California Highway Patrol vehicle or attempting to obstruct or impede law enforcement in the process.", "outcome": "Guilty", "plea": "Not guilty", "court": "Central District of California", "details": "Accepting plea deal to be convicted on misdemeanor count of simple assault on a person assisting a federal officer.", "source": "https://storage.courtlistener.com/recap/gov.uscourts.cacd.987494/gov.uscourts.cacd.987494.106.0.pdf"},
    {"id": 109, "date": "2026-03-28", "defendant": "Sherman Reid", "location": "Downtown Los Angeles", "address": "255 East Temple Street, Los Angeles, CA 90012", "charge": "n/a", "chargeType": "n/a", "description": "Allegedly picked up a tear gas canister and threw it back toward federal agents, striking one of them in the chest.", "outcome": "Pending", "plea": "Not guilty", "court": "Central District of California", "details": "Trial scheduled for June 9, 2026", "source": "https://www.documentcloud.org/documents/28078595-shermanreid-031147563980/"}
  ];

  const toggleCase = (id) => {
    const newExpanded = new Set(expandedCases);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCases(newExpanded);
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'n/a') return 'Date unknown';
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getOutcomeColor = (outcome) => {
    const o = outcome.toLowerCase();
    if (o === 'guilty') return 'bg-red-100 text-red-800';
    if (o === 'pending') return 'bg-yellow-100 text-yellow-800';
    if (o === 'dismissed') return 'bg-green-100 text-green-800';
    if (o === 'not guilty') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  // Status bar config
  const statusConfig = [
    { key: 'Pending',    label: 'Pending',    color: 'bg-yellow-400', text: 'text-yellow-900' },
    { key: 'Guilty',     label: 'Guilty',     color: 'bg-red-500',    text: 'text-white'      },
    { key: 'Dismissed',  label: 'Dismissed',  color: 'bg-green-500',  text: 'text-white'      },
    { key: 'Not guilty', label: 'Not Guilty', color: 'bg-blue-500',   text: 'text-white'      },
  ];

  const statusCounts = statusConfig.map(s => ({
    ...s,
    count: cases.filter(c => c.outcome.toLowerCase() === s.key.toLowerCase()).length,
  }));
  const total = cases.length;

  const filteredCases = selectedStatus === 'all'
    ? cases
    : cases.filter(c => c.outcome.toLowerCase() === selectedStatus.toLowerCase());

  const casesByDate = filteredCases.reduce((acc, c) => {
    const key = c.date && c.date !== 'n/a' ? c.date : 'n/a';
    if (!acc[key]) acc[key] = [];
    acc[key].push(c);
    return acc;
  }, {});

  const sortedDates = Object.keys(casesByDate).sort((a, b) => {
    if (a === 'n/a') return 1;
    if (b === 'n/a') return -1;
    return new Date(a) - new Date(b);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            A timeline of alleged assaults committed against federal agents in California since the immigration raids started
          </h1>
          <p className="text-slate-600 mb-1">Data compiled by Luke Harold. Coding by Claude.ai.</p>
          <p className="text-slate-500 text-sm mb-4">Last updated: May 5, 2026</p>
          <p className="text-slate-700 font-medium mb-4">
            {selectedStatus === 'all'
              ? `Total cases: ${cases.length}`
              : `Showing ${filteredCases.length} of ${cases.length} cases`}
          </p>

          {/* Merged clickable status bar */}
          <div className="bg-white rounded-lg shadow-md p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Case Status — click to filter</h2>
              {selectedStatus !== 'all' && (
                <button
                  onClick={() => setSelectedStatus('all')}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium underline"
                >
                  Show all
                </button>
              )}
            </div>
            {/* Proportional bar */}
            <div className="flex rounded-lg overflow-hidden h-8 mb-3 cursor-pointer">
              {statusCounts.map(s => (
                <div
                  key={s.key}
                  onClick={() => setSelectedStatus(selectedStatus === s.key ? 'all' : s.key)}
                  className={`${s.color} flex items-center justify-center transition-all hover:opacity-80 ${
                    selectedStatus !== 'all' && selectedStatus !== s.key ? 'opacity-30' : ''
                  }`}
                  style={{ width: `${(s.count / total) * 100}%`, minWidth: s.count > 0 ? '2rem' : '0' }}
                  title={`Click to filter: ${s.label} (${s.count})`}
                >
                  {s.count > 0 && (
                    <span className={`text-xs font-bold ${s.text} whitespace-nowrap px-1`}>
                      {s.count}
                    </span>
                  )}
                </div>
              ))}
            </div>
            {/* Legend — also clickable */}
            <div className="flex flex-wrap gap-3">
              {statusCounts.map(s => (
                <button
                  key={s.key}
                  onClick={() => setSelectedStatus(selectedStatus === s.key ? 'all' : s.key)}
                  className={`flex items-center gap-1.5 text-sm rounded-md px-2 py-1 transition-colors ${
                    selectedStatus === s.key
                      ? 'bg-slate-200 font-semibold text-slate-900'
                      : selectedStatus !== 'all'
                      ? 'text-slate-400 hover:text-slate-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className={`inline-block w-3 h-3 rounded-sm ${s.color}`}></span>
                  <span>{s.label}: <strong>{s.count}</strong> ({Math.round((s.count / total) * 100)}%)</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {sortedDates.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center border border-slate-200">
            <p className="text-slate-600">No cases match the selected filter.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {sortedDates.map((date) => (
              <div key={date}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span className="font-semibold text-lg">{formatDate(date)}</span>
                  </div>
                  <div className="text-sm text-slate-600 font-medium">
                    {casesByDate[date].length} {casesByDate[date].length === 1 ? 'case' : 'cases'}
                  </div>
                  <div className="h-0.5 flex-grow bg-slate-300"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {casesByDate[date].map((caseItem) => (
                    <div
                      key={caseItem.id}
                      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all border border-slate-200 overflow-hidden flex flex-col"
                    >
                      <div className="p-5 flex-grow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-grow pr-2">
                            <h3 className="text-base font-bold text-slate-800 leading-tight mb-1">
                              {caseItem.defendant}
                            </h3>
                            <p className="text-sm text-slate-600 leading-tight mb-1">
                              {caseItem.charge !== 'n/a' ? caseItem.charge : 'Charge not listed'}
                            </p>
                            {caseItem.chargeType && caseItem.chargeType !== 'n/a' && (
                              <span className="text-xs text-slate-500 font-medium">
                                {caseItem.chargeType}
                              </span>
                            )}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getOutcomeColor(caseItem.outcome)}`}>
                            {caseItem.outcome}
                          </span>
                        </div>

                        <div className="space-y-2 text-sm text-slate-600 mb-4">
                          {caseItem.description !== 'n/a' && (
                            <div className="flex items-start gap-2">
                              <FileText className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              <span className="text-sm leading-relaxed">{caseItem.description}</span>
                            </div>
                          )}
                          {caseItem.location !== 'n/a' && (
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              <span className="text-xs">{caseItem.location}</span>
                            </div>
                          )}
                        </div>

                        {expandedCases.has(caseItem.id) && (
                          <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
                            {caseItem.address && caseItem.address !== 'n/a' && (
                              <div>
                                <h4 className="font-semibold text-slate-700 mb-1 text-sm">Address</h4>
                                <p className="text-slate-600 text-xs">{caseItem.address}</p>
                              </div>
                            )}
                            {caseItem.plea && caseItem.plea !== 'n/a' && (
                              <div>
                                <h4 className="font-semibold text-slate-700 mb-1 text-sm">Plea</h4>
                                <p className="text-slate-600 text-sm">{caseItem.plea}</p>
                              </div>
                            )}
                            {caseItem.court && caseItem.court !== 'n/a' && (
                              <div>
                                <h4 className="font-semibold text-slate-700 mb-1 text-sm flex items-center gap-1">
                                  <Scale className="w-4 h-4" />
                                  Court
                                </h4>
                                <p className="text-slate-600 text-sm">{caseItem.court}</p>
                              </div>
                            )}
                            {caseItem.details && caseItem.details !== 'n/a' && (
                              <div>
                                <h4 className="font-semibold text-slate-700 mb-1 text-sm">Case Details</h4>
                                <p className="text-slate-600 text-sm">{caseItem.details}</p>
                              </div>
                            )}
                            {caseItem.source && caseItem.source !== 'n/a' && (
                              <div>
                                <a
                                  href={caseItem.source}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  View Court Documents
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => toggleCase(caseItem.id)}
                        className="w-full bg-slate-50 hover:bg-slate-100 transition-colors py-2 px-5 flex items-center justify-center gap-2 text-slate-700 text-sm font-medium border-t border-slate-200"
                      >
                        {expandedCases.has(caseItem.id) ? (
                          <>
                            <span>Show Less</span>
                            <ChevronUp className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            <span>View Details</span>
                            <ChevronDown className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 p-6 bg-white rounded-lg shadow-md border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-2">About this visualization</h3>
          <p className="text-slate-600 text-sm">
            This timeline displays {cases.length} federal court cases involving charges of assaulting or impeding federal officers in California, grouped by incident date. I located these cases using PACER and by contacting the courts directly, but it's possible there are others that are not listed here. Use PACER or Courtlistener for the most up to date information about any given case. Use the filter above to view cases by status. Click "View Details" on any card to see the location, court information, and links to source documents.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourtCaseTimeline;