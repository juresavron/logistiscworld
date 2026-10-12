import { companySchema, type Company } from "../domain/company";

// Owner-supplied listings with scoped official-source checks. See listingNote per record.
export const slovenianCompanies: Company[] = [
  {
    "id": "si-schenker",
    "slug": "schenker",
    "name": "Schenker",
    "legalName": "Schenker",
    "summary": "Freight forwarding and contract logistics in Ljubljana–Črnuče. Schenker is now part of DSV.",
    "description": "",
    "types": [
      "Freight forwarder"
    ],
    "offices": [
      {
        "city": "Ljubljana–Črnuče",
        "country": "SI",
        "primary": true,
        "address": "Brnčičeva ulica 51",
        "postalCode": "1231",
        "phone": "+38615885700"
      }
    ],
    "services": [
      "road",
      "sea",
      "warehouse",
      "forwarding"
    ],
    "coverage": [],
    "capabilities": [
      "E-commerce fulfilment"
    ],
    "website": "https://www.dsv.com/",
    "email": "",
    "phone": "+38615885700",
    "whatsapp": "",
    "sourceUrl": "https://www.dsv.com/en/support/find-dsv",
    "checkedAt": "2026-10-12",
    "tone": "blue",
    "initials": "SCH",
    "isSample": false,
    "serviceDetails": [
      "Full and part truckloads (FTL / LTL)",
      "Full and shared containers (FCL / LCL)",
      "Contract logistics",
      "E-commerce logistics"
    ],
    "listingNote": "Schenker’s website now redirects to DSV following their combination. This legacy Schenker office is listed separately to help visitors find it; it is not an independent group. Address, phone and service details were supplied by the directory owner. The address also appears in Schenker’s published removals document; current office availability and phone should be confirmed with DSV.",
    "additionalSources": [
      "https://www.dbschenker.com/resource/blob/1681390/8cc9c7644f3500177833d28f645dd0f6/removals-download-1-data.pdf"
    ]
  },
  {
    "id": "si-dsv-transport",
    "slug": "dsv-transport",
    "name": "DSV Transport d.o.o.",
    "legalName": "DSV Transport d.o.o.",
    "summary": "Road, air and sea freight, logistics solutions and courier services from DSV’s Slovenian team in Kranj.",
    "description": "",
    "types": [
      "Freight forwarder"
    ],
    "offices": [
      {
        "city": "Kranj",
        "country": "SI",
        "primary": true,
        "address": "Struževo 90",
        "postalCode": "4000",
        "phone": "+38645021100",
        "email": "info@si.dsv.com"
      }
    ],
    "services": [
      "road",
      "air",
      "sea",
      "forwarding"
    ],
    "coverage": [],
    "capabilities": [],
    "website": "https://www.dsv.com/en/countries/slovenia",
    "email": "info@si.dsv.com",
    "phone": "+38645021100",
    "whatsapp": "",
    "sourceUrl": "https://www.dsv.com/en/countries/slovenia",
    "checkedAt": "2026-10-12",
    "tone": "blue",
    "initials": "DSV",
    "isSample": false,
    "serviceDetails": [
      "Road transport",
      "Air and sea freight",
      "Logistics solutions",
      "Courier services"
    ],
    "listingNote": "The Slovenian DSV website confirms the main phone and listed service categories. The supplied company name, street address and email have been retained from the directory owner’s information. DSV and Schenker now belong to the same group.",
    "additionalSources": []
  },
  {
    "id": "si-rail-cargo-logistics",
    "slug": "rail-cargo-logistics",
    "name": "Rail Cargo Logistics d.o.o.",
    "legalName": "Rail Cargo Logistics d.o.o.",
    "summary": "Rail and intermodal freight forwarding in Ljubljana, connecting rail, road and Adriatic port services.",
    "description": "",
    "types": [
      "Freight forwarder"
    ],
    "offices": [
      {
        "city": "Ljubljana",
        "country": "SI",
        "primary": true,
        "address": "Letališka cesta 35",
        "postalCode": "1000",
        "phone": "+38615868755",
        "email": "railway.rcl.si@railcargo.com",
        "fax": "+38615245531"
      }
    ],
    "services": [
      "rail",
      "road",
      "sea",
      "warehouse",
      "customs",
      "forwarding"
    ],
    "coverage": [],
    "capabilities": [],
    "website": "https://www.railcargo.com/sl/podjetje/mednarodno/slovenija/prisotnost",
    "email": "railway.rcl.si@railcargo.com",
    "phone": "+38615868755",
    "whatsapp": "",
    "sourceUrl": "https://www.railcargo.com/en/company/international/slovenia/subsidiaries",
    "checkedAt": "2026-10-12",
    "tone": "blue",
    "initials": "RC",
    "isSample": false,
    "serviceDetails": [
      "Rail, road and sea intermodal transport",
      "Transport and transshipment coordination",
      "Warehousing and distribution",
      "Customs clearance"
    ],
    "listingNote": "The official Rail Cargo subsidiary page confirms the Ljubljana address, phone, email and rail/intermodal activity. The email has been corrected to railway.rcl.si@railcargo.com. Warehousing, distribution, customs and fax details were supplied by the directory owner.",
    "additionalSources": []
  },
  {
    "id": "si-spedicija-stori",
    "slug": "spedicija-stori",
    "name": "Špedicija Stori",
    "legalName": "Špedicija Stori",
    "summary": "Customs clearance and freight forwarding with offices in Ljubljana and at Brnik airport.",
    "description": "",
    "types": [
      "Freight forwarder",
      "Customs broker"
    ],
    "offices": [
      {
        "city": "Ljubljana",
        "country": "SI",
        "primary": true,
        "address": "Letališka cesta 16",
        "postalCode": "1122",
        "phone": "+38615209270",
        "email": "ales.koncilja@stori.si",
        "fax": "+38615851103"
      },
      {
        "city": "Brnik",
        "country": "SI",
        "primary": false,
        "address": "Letališče Jožeta Pučnika",
        "postalCode": "4210",
        "phone": "+38642365590",
        "email": "stori@siol.net",
        "fax": "+38642061713"
      }
    ],
    "services": [
      "customs",
      "air",
      "road",
      "warehouse",
      "forwarding"
    ],
    "coverage": [],
    "capabilities": [],
    "website": "https://www.stori.si/",
    "email": "ales.koncilja@stori.si",
    "phone": "+38615209270",
    "whatsapp": "",
    "sourceUrl": "https://www.stori.si/sl/kontakt/",
    "checkedAt": "2026-10-12",
    "tone": "blue",
    "initials": "ST",
    "isSample": false,
    "serviceDetails": [
      "Customs services and logistics support",
      "Time-critical express delivery",
      "Air and road freight",
      "Warehousing, repacking and transshipment"
    ],
    "listingNote": "Office locations and phone numbers were checked against Stori’s contact page. Branch emails, fax numbers and detailed service information were supplied by the directory owner. Both offices belong to this single company profile.",
    "additionalSources": []
  },
  {
    "id": "si-gebrueder-weiss",
    "slug": "gebrueder-weiss",
    "name": "Gebrüder Weiss d.o.o.",
    "legalName": "Gebrüder Weiss d.o.o.",
    "summary": "Road, air and sea freight with contract logistics, warehousing and fulfilment in Ljubljana.",
    "description": "",
    "types": [
      "Freight forwarder"
    ],
    "offices": [
      {
        "city": "Ljubljana–Šentvid",
        "country": "SI",
        "primary": true,
        "address": "Celovška cesta 490",
        "postalCode": "1210",
        "phone": "+38612351600",
        "email": "gw.slovenia@gw-world.com",
        "fax": "+38612351770"
      },
      {
        "city": "Ljubljana",
        "country": "SI",
        "primary": false,
        "address": "Leskoškova cesta 2",
        "postalCode": "1000",
        "phone": "+38612351723",
        "email": "airsea.ljubljana@gw-world.com",
        "fax": "+38612351776"
      }
    ],
    "services": [
      "road",
      "air",
      "sea",
      "warehouse",
      "forwarding"
    ],
    "coverage": [],
    "capabilities": [
      "E-commerce fulfilment"
    ],
    "website": "https://www.gw-world.com/si/",
    "email": "gw.slovenia@gw-world.com",
    "phone": "+38612351600",
    "whatsapp": "",
    "sourceUrl": "https://www.gw-world.com/si/impresum",
    "checkedAt": "2026-10-12",
    "tone": "blue",
    "initials": "GW",
    "isSample": false,
    "serviceDetails": [
      "Groupage, part-load and full-load transport",
      "Air and sea freight",
      "Project cargo and breakbulk",
      "Parcel services",
      "Warehousing and order fulfilment"
    ],
    "listingNote": "The official Slovenian imprint confirms the Celovška address, main phone, fax and general email. The Leskoškova office address also appears in a company job posting. Its branch phone, fax and email, and the detailed service list, were supplied by the directory owner.",
    "additionalSources": [
      "https://www.gw-world.com/fileadmin/Country_Documents/SI_documents/SI_VODJA_PRODAJE_LADIJSKEGA.PDF"
    ]
  },
  {
    "id": "si-preza",
    "slug": "preza",
    "name": "Preza špedicija in transport d.o.o.",
    "legalName": "Preza špedicija in transport d.o.o.",
    "summary": "Domžale company offering truck washing and parking. The supplied freight transport and vehicle storage services still need confirmation.",
    "description": "",
    "types": [
      "Carrier",
      "Warehouse operator"
    ],
    "offices": [
      {
        "city": "Domžale",
        "country": "SI",
        "primary": true,
        "address": "Krumperška ulica 19, Zaboršt",
        "postalCode": "1230",
        "phone": "+38615231246",
        "email": "office@preza.si",
        "fax": "+38615411609"
      }
    ],
    "services": [
      "road",
      "warehouse"
    ],
    "coverage": [],
    "capabilities": [],
    "website": "https://preza.si/",
    "email": "office@preza.si",
    "phone": "+38615231246",
    "whatsapp": "",
    "sourceUrl": "https://preza.si/",
    "checkedAt": "2026-10-12",
    "tone": "blue",
    "initials": "PR",
    "isSample": false,
    "serviceDetails": [
      "Bulk cargo transport — supplied, not confirmed",
      "Vehicle transport — supplied, not confirmed",
      "Vehicle storage — supplied, not confirmed"
    ],
    "listingNote": "Freight services require confirmation. Preza’s current website primarily advertises truck washing, tank cleaning and parking rental. Its address, phone and office@preza.si email are confirmed there. The directory owner supplied the freight services, fax and transport@preza.si contact; that transport email has not been confirmed on the current site.",
    "additionalSources": []
  },
  {
    "id": "si-starin-transport",
    "slug": "starin-transport",
    "name": "Transport Starin d.o.o.",
    "legalName": "Transport Starin d.o.o.",
    "summary": "Road transport, groupage and ADR cargo, with freight forwarding and warehousing in Domžale.",
    "description": "",
    "types": [
      "Carrier",
      "Freight forwarder"
    ],
    "offices": [
      {
        "city": "Domžale",
        "country": "SI",
        "primary": true,
        "address": "Študljanska cesta 104",
        "postalCode": "1230",
        "phone": "+38631319499",
        "email": "miha@starin-transport.si"
      }
    ],
    "services": [
      "road",
      "warehouse",
      "forwarding"
    ],
    "coverage": [
      {
        "service": "road",
        "countries": [
          "SI",
          "DE",
          "HR"
        ]
      }
    ],
    "capabilities": [
      "Dangerous goods"
    ],
    "website": "https://starin-transport.si/",
    "email": "miha@starin-transport.si",
    "phone": "+38631319499",
    "whatsapp": "",
    "sourceUrl": "https://starin-transport.si/",
    "checkedAt": "2026-10-12",
    "tone": "blue",
    "initials": "ST",
    "isSample": false,
    "serviceDetails": [
      "Road transport in Slovenia, Germany and Croatia",
      "Groupage shipments",
      "ADR dangerous goods transport",
      "Warehousing and freight forwarding"
    ],
    "listingNote": "The current official website lists Študljanska cesta 104, replacing the supplied Selo pri Ihanu address. The direct logistics contact is Miha Vrabič, +386 31 319 499, miha@starin-transport.si. The website supports the service categories; the specific Slovenia, Germany and Croatia routes were supplied by the directory owner. Confirm current route availability directly.",
    "additionalSources": []
  },
  {
    "id": "si-maurice-ward-logistika",
    "slug": "maurice-ward-logistika",
    "name": "Maurice Ward Logistika d.o.o.",
    "legalName": "Maurice Ward Logistika d.o.o.",
    "summary": "Freight forwarding, warehousing and customs services from Maurice Ward’s Slovenian office in Šenčur.",
    "description": "",
    "types": [
      "Freight forwarder",
      "Warehouse operator"
    ],
    "offices": [
      {
        "city": "Šenčur",
        "country": "SI",
        "primary": true,
        "address": "Poslovna cona A12",
        "postalCode": "4208",
        "phone": "+38659013725",
        "email": "slovenia@mauriceward.com"
      }
    ],
    "services": [
      "forwarding",
      "warehouse",
      "customs"
    ],
    "coverage": [],
    "capabilities": [],
    "website": "https://www.mauriceward.com/",
    "email": "slovenia@mauriceward.com",
    "phone": "+38659013725",
    "whatsapp": "",
    "sourceUrl": "https://www.mauriceward.com/local-finder/sencur/",
    "checkedAt": "2026-10-12",
    "tone": "blue",
    "initials": "MW",
    "isSample": false,
    "serviceDetails": [
      "Global freight forwarding",
      "Warehousing",
      "Logistics and customs services"
    ],
    "listingNote": "The official Šenčur location page confirms the address, phone and email. The company website describes its freight forwarding, warehousing and customs services. Ask the local team to confirm shipment-specific availability and destinations.",
    "additionalSources": [
      "https://www.mauriceward.com/"
    ]
  },
  {
    "id": "si-mediasped",
    "slug": "mediasped",
    "name": "Mediašped d.o.o.",
    "legalName": "Mediašped d.o.o.",
    "summary": "Freight forwarding from Koper, with sea, road, air and intermodal transport, customs clearance and warehousing.",
    "description": "",
    "types": [
      "Freight forwarder"
    ],
    "offices": [
      {
        "city": "Koper",
        "country": "SI",
        "primary": true,
        "address": "Ferrarska ulica 30",
        "postalCode": "6000",
        "phone": "+38641728712",
        "email": "info@mediasped.com"
      }
    ],
    "services": [
      "forwarding",
      "sea",
      "road",
      "air",
      "rail",
      "customs",
      "warehouse"
    ],
    "coverage": [],
    "capabilities": [],
    "website": "https://mediasped.com/en/",
    "email": "info@mediasped.com",
    "phone": "+38641728712",
    "whatsapp": "",
    "sourceUrl": "https://mediasped.com/en/",
    "checkedAt": "2026-10-12",
    "tone": "blue",
    "initials": "MD",
    "isSample": false,
    "serviceDetails": [
      "Sea and container transport",
      "Road and air freight",
      "Rail and intermodal transport",
      "Customs clearance and warehousing"
    ],
    "listingNote": "Contact details and service categories were checked against Mediašped’s official website. Featured placement is selected by the directory owner and is not an independent quality ranking.",
    "additionalSources": [],
    "featured": true
  },
  {
    "id": "si-alpha-polaris",
    "slug": "alpha-polaris",
    "name": "Alpha Polaris d.o.o.",
    "legalName": "Alpha Polaris d.o.o.",
    "summary": "Shipping agency and freight forwarding in Koper, handling container shipments, inland transport and port coordination.",
    "description": "",
    "types": [
      "Freight forwarder"
    ],
    "offices": [
      {
        "city": "Koper",
        "country": "SI",
        "primary": true,
        "address": "Ferrarska ulica 14",
        "postalCode": "6000",
        "phone": "+38641671604",
        "email": "info@apkp.si"
      }
    ],
    "services": [
      "forwarding",
      "sea",
      "road",
      "warehouse",
      "customs"
    ],
    "coverage": [],
    "capabilities": [],
    "website": "https://alpha-polaris.si/",
    "email": "info@apkp.si",
    "phone": "+38641671604",
    "whatsapp": "",
    "sourceUrl": "https://alpha-polaris.si/contact/",
    "checkedAt": "2026-10-12",
    "tone": "blue",
    "initials": "AP",
    "isSample": false,
    "serviceDetails": [
      "FCL and LCL sea freight",
      "Shipping agency and port coordination",
      "Inland transport, customs support and storage"
    ],
    "listingNote": "Address, mobile and email are published on the official contact page. Service categories follow the company’s own description.",
    "additionalSources": [
      "https://alpha-polaris.si/company/"
    ],
    "featured": false
  },
  {
    "id": "si-abc-logistika",
    "slug": "abc-logistika",
    "name": "ABC Logistika d.o.o.",
    "legalName": "ABC Logistika d.o.o.",
    "summary": "International freight forwarding in Koper, with air freight, customs clearance and cargo handling and storage.",
    "description": "",
    "types": [
      "Freight forwarder"
    ],
    "offices": [
      {
        "city": "Koper",
        "country": "SI",
        "primary": true,
        "address": "Ferrarska ulica 14",
        "postalCode": "6000",
        "phone": "+38659072761",
        "email": "info@abcl.eu"
      }
    ],
    "services": [
      "forwarding",
      "air",
      "customs",
      "warehouse"
    ],
    "coverage": [],
    "capabilities": [],
    "website": "https://abcl.eu/",
    "email": "info@abcl.eu",
    "phone": "+38659072761",
    "whatsapp": "",
    "sourceUrl": "https://abcl.eu/contact-us/",
    "checkedAt": "2026-10-12",
    "tone": "blue",
    "initials": "AL",
    "isSample": false,
    "serviceDetails": [
      "Air freight",
      "Customs clearance",
      "Cargo handling and storage"
    ],
    "listingNote": "The official website confirms the Koper address, email, customs and cargo-handling services. The phone and air-freight category were supplied by the directory owner.",
    "additionalSources": [],
    "featured": false
  },
  {
    "id": "si-cargomind",
    "slug": "cargomind",
    "name": "Cargomind (SI) d.o.o.",
    "legalName": "Cargomind (SI) d.o.o.",
    "summary": "Ocean freight from the Koper office, with air freight handled by Cargomind’s team at Ljubljana airport.",
    "description": "",
    "types": [
      "Freight forwarder"
    ],
    "offices": [
      {
        "city": "Koper",
        "country": "SI",
        "primary": true,
        "address": "Ankaranska cesta 7",
        "postalCode": "6000",
        "phone": "+38652927600",
        "email": "kop-ocean-export@cargomind.com"
      }
    ],
    "services": [
      "forwarding",
      "sea",
      "air"
    ],
    "coverage": [],
    "capabilities": [],
    "website": "https://www.cargomind.com/en/locations/slovenia",
    "email": "kop-ocean-export@cargomind.com",
    "phone": "+38652927600",
    "whatsapp": "",
    "sourceUrl": "https://www.cargomind.com/en/locations/slovenia",
    "checkedAt": "2026-10-12",
    "tone": "blue",
    "initials": "C(",
    "isSample": false,
    "serviceDetails": [
      "Ocean freight imports and exports through Koper",
      "Air freight via Ljubljana airport"
    ],
    "listingNote": "The Slovenian location page confirms the office, phone and services. The displayed email is for ocean exports; ocean imports use kop-ocean-import@cargomind.com.",
    "additionalSources": [],
    "featured": false
  },
  {
    "id": "si-asr-logistic-transport",
    "slug": "asr-logistic-transport",
    "name": "ASR Logistic and Transport d.o.o.",
    "legalName": "ASR Logistic and Transport d.o.o.",
    "summary": "Koper branch of ASR, offering freight forwarding with road, air, sea and warehousing services.",
    "description": "",
    "types": [
      "Freight forwarder"
    ],
    "offices": [
      {
        "city": "Koper",
        "country": "SI",
        "primary": true,
        "address": "Ankaranska cesta 5C",
        "postalCode": "6000",
        "phone": "+38670494468",
        "email": "slovenia@asrlogistic.com"
      }
    ],
    "services": [
      "forwarding",
      "road",
      "air",
      "sea",
      "warehouse"
    ],
    "coverage": [],
    "capabilities": [],
    "website": "https://www.asrlogistic.com/",
    "email": "slovenia@asrlogistic.com",
    "phone": "+38670494468",
    "whatsapp": "",
    "sourceUrl": "https://www.asrlogistic.com/slovenia/",
    "checkedAt": "2026-10-12",
    "tone": "blue",
    "initials": "AL",
    "isSample": false,
    "serviceDetails": [
      "Road, air and sea freight",
      "Warehousing and door-to-door shipping"
    ],
    "listingNote": "Koper contact details are confirmed on the official Slovenia page. Service categories reflect the group’s website; ask the local team to confirm availability.",
    "additionalSources": [
      "https://www.asrlogistic.com/"
    ],
    "featured": false
  },
  {
    "id": "si-ilg-adriatik",
    "slug": "ilg-adriatik",
    "name": "ILG Adriatik d.o.o.",
    "legalName": "ILG Adriatik d.o.o.",
    "summary": "International freight forwarding in Koper, with ocean, air and project cargo services through the ILG network.",
    "description": "",
    "types": [
      "Freight forwarder"
    ],
    "offices": [
      {
        "city": "Koper",
        "country": "SI",
        "primary": true,
        "address": "Ankaranska cesta 7",
        "postalCode": "6000",
        "phone": "+38682058434",
        "email": "info@si.ilg-group.com"
      }
    ],
    "services": [
      "forwarding",
      "sea",
      "air"
    ],
    "coverage": [],
    "capabilities": [],
    "website": "https://ilg-group.com/en/contactsSloveniaEn.html",
    "email": "info@si.ilg-group.com",
    "phone": "+38682058434",
    "whatsapp": "",
    "sourceUrl": "https://ilg-group.com/en/contactsSloveniaEn.html",
    "checkedAt": "2026-10-12",
    "tone": "blue",
    "initials": "IA",
    "isSample": false,
    "serviceDetails": [
      "Ocean freight: FCL and LCL",
      "Air freight",
      "Project cargo"
    ],
    "listingNote": "Address, email and phone follow the official Slovenia contact page. Its phone ends in 8434, replacing the supplied 8435. Service categories are advertised by ILG.",
    "additionalSources": [],
    "featured": false
  },
  {
    "id": "si-trade-logistics",
    "slug": "trade-logistics",
    "name": "Trade Logistics d.o.o.",
    "legalName": "Trade Logistics d.o.o.",
    "summary": "Maritime transport logistics and freight forwarding in Koper. Contact the local team for shipment-specific services.",
    "description": "",
    "types": [
      "Freight forwarder"
    ],
    "offices": [
      {
        "city": "Koper",
        "country": "SI",
        "primary": true,
        "address": "Ferrarska ulica 30",
        "postalCode": "6000",
        "phone": "+38656142041",
        "email": "mgt-koper@trade-logistics.com"
      }
    ],
    "services": [
      "forwarding",
      "sea"
    ],
    "coverage": [],
    "capabilities": [],
    "website": "",
    "email": "mgt-koper@trade-logistics.com",
    "phone": "+38656142041",
    "whatsapp": "",
    "sourceUrl": "https://www.luka-kp.si/storitve-in-terminali/imenik-pristaniske-skupnosti/",
    "checkedAt": "2026-10-12",
    "tone": "blue",
    "initials": "TL",
    "isSample": false,
    "serviceDetails": [
      "Maritime transport logistics"
    ],
    "listingNote": "Contact details follow Luka Koper’s port-community directory. The supplied number ending in 2040 is listed there as a fax; the phone ends in 2041. A working company website could not be confirmed. Service information was supplied by the directory owner.",
    "additionalSources": [],
    "featured": false
  },
  {
    "id": "si-for-trans",
    "slug": "for-trans",
    "name": "FOR TRANS d.o.o.",
    "legalName": "FOR TRANS d.o.o.",
    "summary": "Freight forwarding in Koper, arranging road, sea, air and rail transport and customs services.",
    "description": "",
    "types": [
      "Freight forwarder"
    ],
    "offices": [
      {
        "city": "Koper",
        "country": "SI",
        "primary": true,
        "address": "Ankaranska cesta 5B",
        "postalCode": "6000",
        "phone": "+38656625320",
        "email": "ops@fortrans.si"
      }
    ],
    "services": [
      "forwarding",
      "road",
      "sea",
      "air",
      "rail",
      "customs"
    ],
    "coverage": [],
    "capabilities": [],
    "website": "https://www.fortrans.si/",
    "email": "ops@fortrans.si",
    "phone": "+38656625320",
    "whatsapp": "",
    "sourceUrl": "https://www.fortrans.si/",
    "checkedAt": "2026-10-12",
    "tone": "blue",
    "initials": "FT",
    "isSample": false,
    "serviceDetails": [
      "Road, sea, air and rail freight",
      "Customs representation"
    ],
    "listingNote": "Company address, operations phone and email are published on the official website. Sales enquiries can also use sales@fortrans.si or +386 5 662 53 21.",
    "additionalSources": [
      "https://www.fortrans.si/carinsko-posredovanje"
    ],
    "featured": false
  },
  {
    "id": "si-transocean-shipping",
    "slug": "transocean-shipping",
    "name": "TransOcean Shipping d.o.o.",
    "legalName": "TransOcean Shipping d.o.o.",
    "summary": "Shipping agency and transport logistics in Koper, with a local contact for maritime freight enquiries.",
    "description": "",
    "types": [
      "Freight forwarder"
    ],
    "offices": [
      {
        "city": "Koper",
        "country": "SI",
        "primary": true,
        "address": "Cesta Zore Perello – Godina 2",
        "postalCode": "6000",
        "phone": "+38659025881",
        "email": "tos.koper@transocean-shipping.com"
      }
    ],
    "services": [
      "forwarding",
      "sea"
    ],
    "coverage": [],
    "capabilities": [],
    "website": "https://www.transocean-shipping.com/",
    "email": "tos.koper@transocean-shipping.com",
    "phone": "+38659025881",
    "whatsapp": "",
    "sourceUrl": "https://www.transocean-shipping.com/company",
    "checkedAt": "2026-10-12",
    "tone": "blue",
    "initials": "TS",
    "isSample": false,
    "serviceDetails": [
      "Shipping agency",
      "Maritime freight coordination"
    ],
    "listingNote": "The official Slovenia contact lists the address, email and phone ending in 25881, replacing the supplied 25883. Service categories follow the directory owner’s supplied company information.",
    "additionalSources": [],
    "featured": false
  },
  {
    "id": "si-fms-logistika",
    "slug": "fms-logistika",
    "name": "FMS Logistika d.o.o.",
    "legalName": "FMS Logistika d.o.o.",
    "summary": "Freight forwarding in Koper through the Fr. Meyer’s Sohn network. Contact the local office to discuss cargo and destinations.",
    "description": "",
    "types": [
      "Freight forwarder"
    ],
    "offices": [
      {
        "city": "Koper",
        "country": "SI",
        "primary": true,
        "address": "Ankaranska cesta 5",
        "postalCode": "6000",
        "phone": "+38656116165",
        "email": "koper@fms-logistics.com"
      }
    ],
    "services": [
      "forwarding"
    ],
    "coverage": [],
    "capabilities": [],
    "website": "https://www.fms-logistics.com/en/",
    "email": "koper@fms-logistics.com",
    "phone": "+38656116165",
    "whatsapp": "",
    "sourceUrl": "https://www.fms-logistics.com/en/contact/",
    "checkedAt": "2026-10-12",
    "tone": "blue",
    "initials": "FL",
    "isSample": false,
    "serviceDetails": [
      "Freight forwarding"
    ],
    "listingNote": "The official contact directory confirms the Koper address, phone and email. The freight-forwarding category was supplied by the directory owner; detailed local services should be confirmed directly.",
    "additionalSources": [],
    "featured": false
  },
  {
    "id": "si-frikus-spedicija",
    "slug": "frikus-spedicija",
    "name": "Frikus špedicija d.o.o.",
    "legalName": "Frikus špedicija d.o.o.",
    "summary": "Transport and freight logistics from Frikus’s Koper office, with vehicle and general cargo transport services.",
    "description": "",
    "types": [
      "Freight forwarder"
    ],
    "offices": [
      {
        "city": "Koper",
        "country": "SI",
        "primary": true,
        "address": "Sermin 75C",
        "postalCode": "6000",
        "phone": "+38656393145",
        "email": "office@frikus.si"
      }
    ],
    "services": [
      "forwarding",
      "road"
    ],
    "coverage": [],
    "capabilities": [],
    "website": "https://www.frikus.com/en/",
    "email": "office@frikus.si",
    "phone": "+38656393145",
    "whatsapp": "",
    "sourceUrl": "https://www.frikus.com/en/contact",
    "checkedAt": "2026-10-12",
    "tone": "blue",
    "initials": "FŠ",
    "isSample": false,
    "serviceDetails": [
      "Vehicle transport",
      "General cargo logistics"
    ],
    "listingNote": "Koper contact details follow the official Frikus contact page, including its current phone +386 5 639 3145. The website describes group transport services; confirm the local offer with the Koper office.",
    "additionalSources": [],
    "featured": false
  },
  {
    "id": "si-acl-international",
    "slug": "acl-international",
    "name": "ACL INTERNATIONAL d.o.o.",
    "legalName": "ACL INTERNATIONAL d.o.o.",
    "summary": "Road, sea and air freight forwarding in Koper, with customs brokerage, warehousing and supply-chain support.",
    "description": "",
    "types": [
      "Freight forwarder"
    ],
    "offices": [
      {
        "city": "Koper",
        "country": "SI",
        "primary": true,
        "address": "Ankaranska cesta 7",
        "postalCode": "6000",
        "phone": "+38659015597",
        "email": "info@acl-international.si"
      }
    ],
    "services": [
      "forwarding",
      "road",
      "sea",
      "air",
      "customs",
      "warehouse"
    ],
    "coverage": [],
    "capabilities": [],
    "website": "https://acl-international.si/",
    "email": "info@acl-international.si",
    "phone": "+38659015597",
    "whatsapp": "",
    "sourceUrl": "https://acl-international.si/",
    "checkedAt": "2026-10-12",
    "tone": "blue",
    "initials": "AI",
    "isSample": false,
    "serviceDetails": [
      "Road, sea and air transport",
      "Customs brokerage",
      "Warehousing and supply-chain management"
    ],
    "listingNote": "Contact details and service categories are published on the official website. Ankaranska cesta 7 is the Koper contact office; the site lists headquarters in Kozina.",
    "additionalSources": [],
    "featured": false
  },
  {
    "id": "si-dhl-global-forwarding",
    "slug": "dhl-global-forwarding",
    "name": "DHL Global Forwarding",
    "legalName": "DHL Global Forwarding",
    "summary": "DHL freight forwarding for air, ocean, road and multimodal shipments, with customs support in Slovenia.",
    "description": "",
    "types": [
      "Freight forwarder"
    ],
    "offices": [
      {
        "city": "Koper",
        "country": "SI",
        "primary": true,
        "phone": "+38630603552",
        "email": "si.info.logistika@dhl.com"
      }
    ],
    "services": [
      "forwarding",
      "air",
      "sea",
      "road",
      "rail",
      "customs"
    ],
    "coverage": [],
    "capabilities": [],
    "website": "https://www.dhl.com/si-en/home/global-forwarding.html",
    "email": "si.info.logistika@dhl.com",
    "phone": "+38630603552",
    "whatsapp": "",
    "sourceUrl": "https://www.dhl.com/si-en/home/global-forwarding.html",
    "checkedAt": "2026-10-12",
    "tone": "blue",
    "initials": "DG",
    "isSample": false,
    "serviceDetails": [
      "Air and ocean freight",
      "Road and multimodal transport",
      "Customs services"
    ],
    "listingNote": "The Koper branch location was supplied by the directory owner; its street address has not been confirmed. Phone and email are the Slovenian contact listed by Luka Koper under the Kranj office, not a verified Koper direct line. Service categories follow DHL’s Slovenian website.",
    "additionalSources": [
      "https://www.luka-kp.si/storitve-in-terminali/imenik-pristaniske-skupnosti/"
    ],
    "featured": false
  },
  {
    "id": "si-2hm-logistics",
    "slug": "2hm-logistics",
    "name": "2HM Logistics d.o.o.",
    "legalName": "2HM Logistics d.o.o.",
    "summary": "Koper freight forwarding listing under the supplied 2HM name. Its former website now redirects to Neele-Vat.",
    "description": "",
    "types": [
      "Freight forwarder"
    ],
    "offices": [
      {
        "city": "Koper",
        "country": "SI",
        "primary": true,
        "phone": "+38656393111"
      }
    ],
    "services": [
      "forwarding"
    ],
    "coverage": [],
    "capabilities": [],
    "website": "https://www.neelevat.com/",
    "email": "",
    "phone": "+38656393111",
    "whatsapp": "",
    "sourceUrl": "https://2hm-logistics.com/contact/",
    "checkedAt": "2026-10-12",
    "tone": "blue",
    "initials": "2L",
    "isSample": false,
    "serviceDetails": [
      "Freight forwarding"
    ],
    "listingNote": "The directory owner supplied the 2HM name, Koper location and phone. The former 2HM website now redirects to Neele-Vat. Current local contact details and the legal company name require confirmation with the company; no unconfirmed email or street address is shown.",
    "additionalSources": [],
    "featured": false
  },
  {
    "id": "si-pgs-koper",
    "slug": "pgs-koper",
    "name": "PGS Koper d.o.o.",
    "legalName": "PGS Koper d.o.o.",
    "summary": "Pacorini Group’s Koper logistics company, specialising in commodity handling, warehousing and transport coordination.",
    "description": "",
    "types": [
      "Freight forwarder"
    ],
    "offices": [
      {
        "city": "Koper",
        "country": "SI",
        "primary": true,
        "address": "Vojkovo nabrežje 32",
        "postalCode": "6000",
        "phone": "+38656104000",
        "email": "info@pacorini.si"
      }
    ],
    "services": [
      "forwarding",
      "warehouse"
    ],
    "coverage": [],
    "capabilities": [],
    "website": "https://www.pacorini.si/",
    "email": "info@pacorini.si",
    "phone": "+38656104000",
    "whatsapp": "",
    "sourceUrl": "https://www.pacorini.si/",
    "checkedAt": "2026-10-12",
    "tone": "blue",
    "initials": "PK",
    "isSample": false,
    "serviceDetails": [
      "Commodity handling and warehousing",
      "Logistics coordination through the Port of Koper"
    ],
    "listingNote": "Services follow PGS Koper’s official website. Address, phone and email are also listed in Luka Koper’s port-community directory.",
    "additionalSources": [
      "https://www.luka-kp.si/storitve-in-terminali/imenik-pristaniske-skupnosti/"
    ],
    "featured": false
  },
  {
    "id": "si-dsv-air-sea",
    "slug": "dsv-air-sea",
    "name": "DSV Air & Sea d.o.o.",
    "legalName": "DSV Air & Sea d.o.o.",
    "summary": "DSV’s air and sea freight listing in Koper, with a local contact for international forwarding enquiries.",
    "description": "",
    "types": [
      "Freight forwarder"
    ],
    "offices": [
      {
        "city": "Koper",
        "country": "SI",
        "primary": true,
        "phone": "+38656635844",
        "email": "info.air-sea@si.dsv.com"
      }
    ],
    "services": [
      "forwarding",
      "air",
      "sea"
    ],
    "coverage": [],
    "capabilities": [],
    "website": "https://www.dsv.com/en/countries/slovenia",
    "email": "info.air-sea@si.dsv.com",
    "phone": "+38656635844",
    "whatsapp": "",
    "sourceUrl": "https://www.luka-kp.si/storitve-in-terminali/imenik-pristaniske-skupnosti/",
    "checkedAt": "2026-10-12",
    "tone": "blue",
    "initials": "DA",
    "isSample": false,
    "serviceDetails": [
      "Air freight",
      "Sea freight"
    ],
    "listingNote": "The phone and email match Luka Koper’s port-community directory. Sources list different Koper street addresses, so confirm the current office address before visiting. This company is part of the same group as the DSV Transport and Schenker listings.",
    "additionalSources": [
      "https://www.dsv.com/en/countries/slovenia"
    ],
    "featured": false
  },
  {
    "id": "si-europacific",
    "slug": "europacific",
    "name": "Europacific d.o.o.",
    "legalName": "Europacific d.o.o.",
    "summary": "Koper freight forwarder arranging sea, road, rail and air shipments, with customs and warehousing services.",
    "description": "",
    "types": [
      "Freight forwarder"
    ],
    "offices": [
      {
        "city": "Koper",
        "country": "SI",
        "primary": true,
        "address": "Ankaranska cesta 5",
        "postalCode": "6000",
        "phone": "+38656626380",
        "email": "info@europacific.com"
      }
    ],
    "services": [
      "forwarding",
      "sea",
      "road",
      "rail",
      "air",
      "customs",
      "warehouse"
    ],
    "coverage": [],
    "capabilities": [],
    "website": "https://www.europacific.com/",
    "email": "info@europacific.com",
    "phone": "+38656626380",
    "whatsapp": "",
    "sourceUrl": "https://www.europacific.com/en/contact",
    "checkedAt": "2026-10-12",
    "tone": "blue",
    "initials": "ED",
    "isSample": false,
    "serviceDetails": [
      "FCL containers and LCL groupage",
      "Road FTL / LTL and rail transport",
      "Air freight",
      "Customs clearance and warehousing"
    ],
    "listingNote": "The official contact page confirms the Koper address, main phone and email and lists the service departments. Air freight enquiries are handled by the Domžale office.",
    "additionalSources": [],
    "featured": false
  }
].map(record => companySchema.parse(record));
