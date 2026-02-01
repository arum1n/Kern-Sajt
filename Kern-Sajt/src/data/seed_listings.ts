export interface Listing {
    id: string;
    title: string;
    price: number;
    currency: string;
    category: "COMPUTER" | "LAPTOP" | "COMPONENT" | "PERIPHERAL";
    cpu?: string;
    gpu?: string;
    ram?: string;
    storage?: string;
    motherboard?: string;
    psu?: string;
    description: string;
    detailedSpecs?: Record<string, string>;
    images: string[];
    seller?: string;
    location?: string;
    datePosted?: string;
}

export const seedListings: Listing[] = [
    // ============ GAMING PCs ============
    {
        id: "gaming-pc-5070ti",
        title: "GAMING PC RTX 5070 TUNGZEN 7 7800X3D/32GB DDR5",
        price: 5399,
        currency: "KM",
        category: "COMPUTER",
        cpu: "Ryzen 7 7800X3D",
        gpu: "GIGABYTE RTX 5070 Ti GAMING OC 16GB",
        ram: "32 GB DDR5",
        storage: "1TB NVMe",
        motherboard: "GIGABYTE B650 AORUS ELITE AX V2",
        psu: "Gigabyte UD850GM",
        description: `Novo, fabički zapakovano - garancija 24 mjeseca!

Mogućnost izmjene komponenata po vašoj kupca kad i skalptate komplekterje konfiguracije po narudžbi.

Novo, fabički zapakovano - garancija 24 mjeseca!

Mogućnost izmjene komponenata po vašoj kupca kad i skalptate komplekterje konfiguracije po narudžbi.`,
        detailedSpecs: {
            "Proizvođač": "AMD",
            "Operativni sistem": "Win 11",
            "Broj procesora (CPU)": "8",
            "Stanje": "Novo",
            "Model procesora": "Ryzen 7 7800X3D",
            "SSD/USB": "1TB NVMe",
            "Grafička kartica": "GIGABYTE RTX 5070 Ti GAMING OC 16GB",
            "Memorija grafike": "16GB",
            "Radna memorija (RAM)": "32 GB",
            "Kućište": "NZXT",
            "Garancija (mjeseci)": "24",
            "Datum objave": "22.01.2026"
        },
        images: ["/marketplace/gaming-pc-5070ti-v2.jpeg"],
        seller: "MComputers",
        location: "Sarajevo"
    },
    {
        id: "gaming-pc-5060",
        title: "GAMING PC RTX 5060 8GB/RYZEN 5 5600X/16GB DDR4",
        price: 1819,
        currency: "KM",
        category: "COMPUTER",
        cpu: "Ryzen 5 5600X",
        gpu: "RTX 5060 8GB PALIT Dual",
        ram: "16 GB DDR4",
        storage: "500GB SSD",
        motherboard: "Gigabyte A520M K V2",
        psu: "Marvo",
        description: `Novo, fabički zapakovano - garancija 24 mjeseca!

Mogućnost izmjene komponenata po vašoj kupca kad i skalptate komplekterje konfiguracije po narudžbi.

Novo, fabički zapakovano - garancija 24 mjeseca!`,
        detailedSpecs: {
            "Proizvođač": "AMD",
            "Operativni sistem": "Win 11",
            "Broj procesora (CPU)": "6x4",
            "Stanje": "Novo",
            "Model procesora": "Ryzen 5 5600X",
            "SSD/USB": "500GB SSD",
            "Grafička kartica": "RTX 5060 8GB PALIT Dual",
            "Memorija grafike": "8GB",
            "Radna memorija (RAM)": "16 GB",
            "Kućište": "Marvo",
            "Garancija (mjeseci)": "24",
            "Datum objave": "01.01.2026"
        },
        images: ["/marketplace/gaming-pc-5060.jpeg"],
        seller: "GUMAKtrojana",
        location: "Mostar"
    },
    {
        id: "gaming-pc-prime",
        title: "GAMING PC PRIME RYZEN 5 5600X / NVIDIA RTX 2060 / SSD 1TB M2",
        price: 1499,
        currency: "KM",
        category: "COMPUTER",
        cpu: "AMD Ryzen 5 5600X",
        gpu: "RTX 2060",
        ram: "16 GB DDR4",
        storage: "SSD 1TB M.2",
        motherboard: "ASUS PRIME B450M-A II",
        description: `GAMING PC PRIME RYZEN 5 5600X / NVIDIA RTX 2060 / 8GB DDR4 RGB

DDR4 KM 32GB RAM+150KM

Doplata za Ryzen 7 5700x 100km`,
        detailedSpecs: {
            "Proizvođač": "AMD",
            "Operativni sistem": "Win 11",
            "Broj procesora (CPU)": "4x6",
            "Stanje": "Novo",
            "RAM": "16 GB",
            "Matična ploča": "B450",
            "Grafička kartica": "RTX 2060",
            "Datum objave": "07.08.2024"
        },
        images: ["/marketplace/gaming-pc-prime.jpg"],
        seller: "A.Prime",
        location: "Sarajevo"
    },

    // ============ LAPTOPS ============
    {
        id: "lenovo-legion-5",
        title: "Laptop Lenovo Legion 5 i7-14650HX RTX 4060 1TB 32GB 16\" DOPER",
        price: 3499,
        currency: "KM",
        category: "LAPTOP",
        cpu: "Intel Core i7-14650HX",
        gpu: "Nvidia GeForce RTX 4060",
        ram: "32 GB DDR5",
        storage: "1TB NVMe SSD",
        description: `Laptop Lenovo Legion 5 i 16IRX9
DOPER TECH

Processor: Intel Core i7-14650HX up to 5.25GHz 24C/32T
Grafika: NVIDIA GeForce RTX 4060 8GB GDDR6
SSD: 1TB
RAM: 32 GB
Display: IPS`,
        detailedSpecs: {
            "Proizvođač": "Lenovo",
            "Dijagonala (inch)": "16",
            "Operativni sistem": "Win 11",
            "RAM": "32 GB",
            "Tip procesora (CPU)": "Laptop",
            "Grafička kartica (model)": "Nvidia GeForce RTX 4060",
            "Max CPU turbo takt": "5.1 GHz",
            "Rezolucija (px)": "2560 x 1600",
            "Model procesora": "Intel Core i7-14650HX",
            "Stanje": "Novo",
            "SSD kapacitet (GB)": "1000",
            "Boja grafike": "Zasebna",
            "Datum objave": "06.11.2025"
        },
        images: ["/marketplace/lenovo-legion-5.jpg"],
        seller: "DOPER",
        location: "Sarajevo"
    },
    {
        id: "razer-blade-18",
        title: "RAZER BLADE 18 300Hz RTX 4090 4K Gaming laptop Mini Led",
        price: 9000,
        currency: "KM",
        category: "LAPTOP",
        cpu: "Intel i9-13980HX",
        gpu: "RTX 4090",
        ram: "32 GB DDR5",
        storage: "SSD kapacitet 1GB",
        description: `Mokte mi z desi sa pislakom napasti krast odobre Bol tasrive.
Da hocu stifrije cija kojim de langes- Razer ok flippe Wondowo lasmice

ISPOD CIJENE PRODAJA. 50Kb Fi US za saksadent mnala!

Mokte mi z desi sa pislakom napasti krast odobre Bol tasrive.
Da hocu stifrije cija kojim de langes- Razer ok flippe Wondowo lasmice

ISPOD CIJENE PRODAJA. 50Kb Fi US za saksadent mnala!`,
        detailedSpecs: {
            "Display (inch)": "18.5",
            "Operativni sistem": "Win 11",
            "Procesor": "i9",
            "RAM": "32 GB",
            "Hard disk (HDD za laptop)": "SSD kapacitet 1GB",
            "Grafička kartica (model)": "RTX 4090",
            "Cijena proizvođače": "6500",
            "Datum objave": "14.01.2025"
        },
        images: ["/marketplace/razer-blade-18-v2.jpg"],
        seller: "AdministraciJa",
        location: "Banja Luka"
    },
    {
        id: "razer-blade-16-2025",
        title: "Razer Blade 16 2025 Gaming Laptop OLED RTX 5090 Ryzen 9 AI",
        price: 9000,
        currency: "KM",
        category: "LAPTOP",
        cpu: "Ryzen 9 AI",
        gpu: "RTX 5090",
        ram: "64 GB DDR5",
        storage: "4TB NVMe Gen5",
        description: `Najveći laptop godine 2025, RAZER BLADE serija.
Da hocu stifrije cija kojim de langes- Razer ok flippe Wondowo lasmice

KO NOV. MINT STANJE. Full pa.kovanje, LAPTOP, BRIZ, PUNJAUZ, RACUN.
ISPOD CIJENE PRODAJA!

NAJNOVNALI NA ITRU RIVAR LAPTOP-GLOE DISPLAY RTX 5090 GRAFIČKA`,
        detailedSpecs: {
            "Proizvođač": "Razer",
            "Display (inch)": "16",
            "Operativni sistem": "Win 11",
            "Procesor": "AM98",
            "RAM": "64 GB",
            "Vrst grafike": "Integrisana + Zasebna",
            "SSD kapacitet (GB)": "4000",
            "Godina proizvodnje": "2025",
            "Datum objave": "06.07.2025"
        },
        images: ["/marketplace/razer-blade-16.jpg"],
        seller: "AdministraciJa",
        location: "Sarajevo"
    },

    // ============ COMPONENTS - GPUs ============
    {
        id: "asus-rtx-5060-ti",
        title: "Nvidia ASUS Prime RTX 5060 Ti OC 16GB GDDR7",
        price: 1149,
        currency: "KM",
        category: "COMPONENT",
        gpu: "RTX 5060 Ti 16GB GDDR7",
        description: `Box Hardware d.o.o. Sarajevo: od pouzdani partner u nabavi računalne opreme. Sarajevski
favorita sa jasno uslove jednog porodimm, Reokid stikar - garantuje da ju niško samo prijse zbog jedina
sama se aranžeanja! Reselle omagegenium kad slegam! srdce plaju porodu dodo dolazi uz količjugo zakon i
kreacije na sriže.

Za sve dopušte informacije, slobodno me kontak brajte na.

070 935 400`,
        detailedSpecs: {
            "Marka": "Asus",
            "PCIe": "5.0 x16",
            "Model": "Prime",
            "Tip memorije": "GDDR7",
            "Video memorije (GB)": "16",
            "Maksimum raymonitoring": "8K",
            "Stanje": "Novo",
            "Napajanje neeophodno": "1x",
            "Datum objave": "28.01.2026"
        },
        images: ["/marketplace/asus-rtx-5060-ti.jpeg"],
        seller: "Box Hardware",
        location: "Sarajevo"
    },
    {
        id: "rtx-3060-ti-strix",
        title: "RTX 3060 Ti Asus Rog Strix",
        price: 579,
        currency: "KM",
        category: "COMPONENT",
        gpu: "RTX 3060 Ti 8GB",
        description: `RTX 3060 Ti Asus Rog Strix 3xf4 RGB

Grafika drma, dobro orvan-sva RAR podmanovna.

30 dana garancije our artifiala.`,
        detailedSpecs: {
            "Proizvođač": "Asus",
            "PCIe": "4.0 x16",
            "Model": "ROG Strix",
            "Tip memorije": "GDDR6X",
            "Video memorije (GB)": "8",
            "Stanje": "Korišteno",
            "Model GPU": "ROG Strix 2025",
            "Datum objave": "14.03.2025"
        },
        images: ["/marketplace/rtx-3060-ti-strix.jpeg"],
        seller: "Cyber Zone",
        location: "Tuzla"
    },
    {
        id: "radeon-rx-9070-xt",
        title: "Radeon RX 9070 XT 16GB",
        price: 1719,
        currency: "KM",
        category: "COMPONENT",
        gpu: "RX 9070 XT 16GB GDDR6",
        description: `ACER Radeon RX 9070 XT 16GB GDDR6 Predator BiFrost CC PCL

• Predator BiFrost RX 9070 XT Lift go-hrg and grofičku koncu rir dan sve vode kojnorički AAIS Radeon RX 9000
tarke GD ce GDMG (Unoposisly) ~ meduseposito p. ofrčitnih igrame, trimedere spredikagg besleadiveseka,
mako, OC, ij edngepada!

ACER Radeon RX 9070 XT 16GB GDDR6 Predator BiFrost CC PCL`,
        detailedSpecs: {
            "Marka": "XFX",
            "DAFE memorije": "16 GB",
            "Tip memorije": "GDDR6",
            "Slot sekundor (bit)": "256",
            "Stanje": "Novo",
            "Datum objave": "31.01.2026"
        },
        images: ["/marketplace/radeon-rx-9070-xt.jpeg"],
        seller: "idealni_online",
        location: "Sarajevo"
    },

    // ============ COMPONENTS - CPU ============
    {
        id: "amd-ryzen-7800x3d",
        title: "AMD Ryzen 7 7800X3D 16x4 2-5.0GHz box AM5",
        price: 849,
        currency: "KM",
        category: "COMPONENT",
        cpu: "Ryzen 7 7800X3D 8 Cores / 16 Threads",
        description: `AMD Ryzen 7 7800X3D 16x4 2-5.0GHz box AM5
Rabeni novi - garancija 36 mjesec, NOVO!!

ANTS-4: B75HA TriFektor EVALUATION - COMBU-CAM.
1 Cores 16 MULITMADING za LUCHSIM Perfilak.

Mogućite se nabavka svih komponetita po olal kupca, pa najvišekritik pakete u tibi`,
        detailedSpecs: {
            "Proizvođač": "AMD",
            "Socket": "AM5",
            "Broj jezgri": "8",
            "Model": "Ryzen 7 7800X3D",
            "TDP": "120W",
            "Tip čipa": "Desktop PC",
            "Cache (MB)": "98",
            "Boost": "5.0GHz",
            "Datum objave": "14.08.2025"
        },
        images: ["/marketplace/amd-ryzen-7800x3d.jpg"],
        seller: "MComputers",
        location: "Sarajevo"
    },

    // ============ COMPONENTS - SSDs ============
    {
        id: "samsung-990-pro-2tb",
        title: "Samsung 990 PRO 2TB NVMe M.2 SSD",
        price: 349,
        currency: "KM",
        category: "COMPONENT",
        storage: "2TB NVMe Gen4",
        description: `Samsung 990 PRO 2TB NVMe M.2 SSD - Najbrži potrošački SSD na tržištu!

Čitanje: 7450 MB/s | Pisanje: 6900 MB/s
Idealan za gaming i profesionalne workstations.

Garancija: 5 godina`,
        detailedSpecs: {
            "Proizvođač": "Samsung",
            "Kapacitet": "2TB",
            "Interfejs": "NVMe PCIe 4.0 x4",
            "Form Factor": "M.2 2280",
            "Brzina čitanja": "7450 MB/s",
            "Brzina pisanja": "6900 MB/s",
            "TBW": "1200 TB",
            "Stanje": "Novo",
            "Datum objave": "28.01.2026"
        },
        images: ["/marketplace/samsung-990-pro.jpg"],
        seller: "Box Hardware",
        location: "Sarajevo"
    },
    {
        id: "wd-black-sn850x-1tb",
        title: "WD Black SN850X 1TB NVMe M.2 SSD",
        price: 189,
        currency: "KM",
        category: "COMPONENT",
        storage: "1TB NVMe Gen4",
        description: `Western Digital Black SN850X 1TB - Gaming SSD

Optimiziran za gaming sa Game Mode 2.0
Čitanje: 7300 MB/s | Pisanje: 6300 MB/s

Dostupno odmah!`,
        detailedSpecs: {
            "Proizvođač": "Western Digital",
            "Kapacitet": "1TB",
            "Interfejs": "NVMe PCIe 4.0 x4",
            "Form Factor": "M.2 2280",
            "Brzina čitanja": "7300 MB/s",
            "Brzina pisanja": "6300 MB/s",
            "TBW": "600 TB",
            "Stanje": "Novo",
            "Datum objave": "28.01.2026"
        },
        images: ["/marketplace/wd-black-sn850x.jpg"],
        seller: "TechShop",
        location: "Banja Luka"
    },
    {
        id: "crucial-p3-plus-500gb",
        title: "Crucial P3 Plus 500GB NVMe M.2 SSD",
        price: 79,
        currency: "KM",
        category: "COMPONENT",
        storage: "500GB NVMe Gen4",
        description: `Crucial P3 Plus 500GB - Odličan omjer cijene i performansi!

Čitanje: 5000 MB/s | Pisanje: 3600 MB/s
Idealan za budget buildove.

30 dana garancije.`,
        detailedSpecs: {
            "Proizvođač": "Crucial",
            "Kapacitet": "500GB",
            "Interfejs": "NVMe PCIe 4.0 x4",
            "Form Factor": "M.2 2280",
            "Brzina čitanja": "5000 MB/s",
            "Brzina pisanja": "3600 MB/s",
            "TBW": "110 TB",
            "Stanje": "Novo",
            "Datum objave": "28.01.2026"
        },
        images: ["/marketplace/crucial-p3-plus.jpg"],
        seller: "MComputers",
        location: "Sarajevo"
    },

    // ============ COMPONENTS - PSUs ============
    {
        id: "corsair-rm850x-2024",
        title: "Corsair RM850x 850W 80+ Gold Modularno Napajanje",
        price: 249,
        currency: "KM",
        category: "COMPONENT",
        description: `Corsair RM850x 850W - Premium modularno napajanje!

80+ Gold certificirano, potpuno modularno.
Zero RPM fan mode za tihi rad.
10 godina garancije od proizvođača.

Idealno za RTX 4070 Ti i slične konfiguracije.`,
        detailedSpecs: {
            "Proizvođač": "Corsair",
            "Snaga": "850W",
            "Certifikat": "80+ Gold",
            "Modularno": "Potpuno modularno",
            "Ventilator": "135mm",
            "Dimenzije": "160mm x 150mm x 86mm",
            "Garancija": "10 godina",
            "Stanje": "Novo",
            "Datum objave": "28.01.2026"
        },
        images: ["/marketplace/corsair-rm850x.jpg"],
        seller: "Box Hardware",
        location: "Sarajevo"
    },
    {
        id: "seasonic-focus-gx-750",
        title: "Seasonic Focus GX-750 750W 80+ Gold Modularno",
        price: 199,
        currency: "KM",
        category: "COMPONENT",
        description: `Seasonic Focus GX-750 - Japanski kvalitet!

80+ Gold certificirano, potpuno modularno.
Tihi Fluid Dynamic Bearing ventilator.
10 godina garancije.

Odličan izbor za mid-range konfiguracije.`,
        detailedSpecs: {
            "Proizvođač": "Seasonic",
            "Snaga": "750W",
            "Certifikat": "80+ Gold",
            "Modularno": "Potpuno modularno",
            "Ventilator": "120mm FDB",
            "Dimenzije": "140mm x 150mm x 86mm",
            "Garancija": "10 godina",
            "Stanje": "Novo",
            "Datum objave": "28.01.2026"
        },
        images: ["/marketplace/seasonic-focus-gx-750.jpg"],
        seller: "TechShop",
        location: "Banja Luka"
    },
    {
        id: "evga-supernova-1000-g6",
        title: "EVGA SuperNOVA 1000 G6 1000W 80+ Gold",
        price: 289,
        currency: "KM",
        category: "COMPONENT",
        description: `EVGA SuperNOVA 1000 G6 - Za najzahtjevnije konfiguracije!

1000W snage za RTX 4090 i najjače procesore.
80+ Gold certificirano, potpuno modularno.
ECO Mode za tihi rad.

Garancija: 10 godina`,
        detailedSpecs: {
            "Proizvođač": "EVGA",
            "Snaga": "1000W",
            "Certifikat": "80+ Gold",
            "Modularno": "Potpuno modularno",
            "Ventilator": "135mm",
            "Dimenzije": "150mm x 150mm x 85mm",
            "Garancija": "10 godina",
            "Stanje": "Novo",
            "Datum objave": "28.01.2026"
        },
        images: ["/marketplace/evga-supernova-1000.jpg"],
        seller: "MComputers",
        location: "Sarajevo"
    },
    {
        id: "be-quiet-pure-power-12-650",
        title: "be quiet! Pure Power 12 M 650W 80+ Gold",
        price: 149,
        currency: "KM",
        category: "COMPONENT",
        description: `be quiet! Pure Power 12 M - Tihi i pouzdan!

650W snage za budget i mid-range buildove.
80+ Gold certificirano, polu-modularno.
Tihi 120mm ventilator.

Odličan za uredske i gaming konfiguracije.`,
        detailedSpecs: {
            "Proizvođač": "be quiet!",
            "Snaga": "650W",
            "Certifikat": "80+ Gold",
            "Modularno": "Polu-modularno",
            "Ventilator": "120mm",
            "Dimenzije": "150mm x 150mm x 86mm",
            "Garancija": "5 godina",
            "Stanje": "Novo",
            "Datum objave": "28.01.2026"
        },
        images: ["/marketplace/be-quiet-pure-power-12.jpg"],
        seller: "KLINK_doo",
        location: "Mostar"
    },

    // ============ PERIPHERALS ============
    {
        id: "alienware-monitor",
        title: "Monitor Alienware 34 AW3425DWM Curved AW3425DWM-09",
        price: 858.70,
        currency: "KM",
        category: "PERIPHERAL",
        description: `Monitor Alienware 34 Gaming AW3425DWM Curved, 3440x1440, WQHD, 180Hz, VA Antiglare, 21:9, 3000:1, 400
cd/m2, AMD FreeSync + VESA, 4ms/2ms/1ms, 178/178, DP, 2xHDMI, 2xUSB-A, USB-B, Tilt, Pivot, Height Adjust, 3Y

Fiskalni račun i garancija: Dostupno odmah uz dostavu širom zemlje. Kontakt tel: +387 61 198 035 (Viber/Whatsapp)!`,
        detailedSpecs: {
            "Dijagonala (inch)": "34",
            "Rezolucija": "3440x1440 WQHD",
            "Vrsta": "Curved QD-OLED",
            "Osvježavanje": "180Hz",
            "Vrijeme odziva": "0.03ms",
            "Panel": "QD-OLED",
            "Priključci": "DP, 2xHDMI, 2xUSB-A, USB-B",
            "Stanje": "Novo",
            "Datum objave": "28.01.2026"
        },
        images: ["/marketplace/alienware-monitor.jpg"],
        seller: "KLINK_doo",
        location: "Mostar"
    }
];

// Helper function to find listing by ID
export function getListingById(id: string): Listing | undefined {
    return seedListings.find(listing => listing.id === id);
}
